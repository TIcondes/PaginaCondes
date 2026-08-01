import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { PanoramaHotspot } from '../../types'

interface Props {
  imageUrl: string
  hotspots?: PanoramaHotspot[]        // Botones de navegación ("puertas") hacia otras áreas del recorrido
  onHotspotSelect?: (targetAreaId: string) => void
  initialYaw?: number                 // Orientación inicial de la cámara al entrar a esta área (grados)
  initialPitch?: number
  className?: string
}

const SPHERE_RADIUS = 500
const HOTSPOT_RADIUS = SPHERE_RADIUS * 0.98 // ligeramente dentro de la esfera para no hacer z-fighting con la textura
const DRAG_SENSITIVITY = 0.15
const MIN_FOV = 30
const MAX_FOV = 90
const MAX_LAT = 85

// Convierte una posición esférica (yaw/pitch, en grados) a un punto 3D sobre
// la esfera del recorrido. Se usa tanto para apuntar la cámara como para
// ubicar los hotspots (botones de "puerta") en el punto correcto.
function sphericalToVector3(yaw: number, pitch: number, radius: number): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - pitch)
  const theta = THREE.MathUtils.degToRad(yaw)
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

// Visor de recorridos 360° 100% nativo (sin iframes externos): mapea una imagen
// equirectangular (exportada de D5 Render) al interior de una esfera con Three.js,
// permite girar la cámara arrastrando el mouse/dedo, hacer zoom con la rueda, y
// "caminar" entre ambientes a través de botones (hotspots) colocados en las puertas.
export default function Panorama360Viewer({
  imageUrl,
  hotspots = [],
  onHotspotSelect,
  initialYaw = 0,
  initialPitch = 0,
  className = '',
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Ref para siempre poder llamar a la última versión del callback desde el
  // loop de animación, sin tener que reconstruir toda la escena por cada
  // cambio de referencia de la función.
  const onHotspotSelectRef = useRef(onHotspotSelect)
  useEffect(() => {
    onHotspotSelectRef.current = onHotspotSelect
  }, [onHotspotSelect])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    setIsLoading(true)
    setHasError(false)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      1,
      SPHERE_RADIUS * 2
    )

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    // Esfera con las normales invertidas para que la textura se vea desde adentro
    const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 60, 40)
    geometry.scale(-1, 1, 1)

    const material = new THREE.MeshBasicMaterial()
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        material.map = texture
        material.needsUpdate = true
        setIsLoading(false)
      },
      undefined,
      () => {
        setIsLoading(false)
        setHasError(true)
      }
    )

    // Arrastrar para girar la cámara (coordenadas esféricas lon/lat)
    let lon = initialYaw
    let lat = initialPitch
    let isDragging = false
    let dragStartX = 0
    let dragStartY = 0
    let lonAtDragStart = 0
    let latAtDragStart = 0

    const canvas = renderer.domElement
    canvas.style.cursor = 'grab'
    canvas.style.touchAction = 'none'

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true
      dragStartX = event.clientX
      dragStartY = event.clientY
      lonAtDragStart = lon
      latAtDragStart = lat
      canvas.style.cursor = 'grabbing'
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging) return
      lon = (dragStartX - event.clientX) * DRAG_SENSITIVITY + lonAtDragStart
      lat = (event.clientY - dragStartY) * DRAG_SENSITIVITY + latAtDragStart
      lat = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat))
    }

    const onPointerUp = () => {
      isDragging = false
      canvas.style.cursor = 'grab'
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      camera.fov = Math.max(MIN_FOV, Math.min(MAX_FOV, camera.fov + event.deltaY * 0.05))
      camera.updateProjectionMatrix()
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    // ---- Hotspots: botones de navegación colocados en las "puertas" ----
    // Se crean como elementos HTML reales (no objetos 3D) para que el texto
    // sea nítido y accesible; su posición en pantalla se recalcula cada frame
    // proyectando su punto 3D sobre el plano de la cámara.
    const hotspotLayer = document.createElement('div')
    hotspotLayer.className = 'absolute inset-0 pointer-events-none'
    mount.appendChild(hotspotLayer)

    // Mientras se reproduce la animación de acercamiento hacia una puerta, se
    // ignoran nuevos clics (en este hotspot y en los demás) para no disparar
    // dos navegaciones a la vez.
    let isTransitioning = false

    const walkThroughDoor = (hotspot: PanoramaHotspot) => {
      if (isTransitioning) return
      isTransitioning = true

      const startFov = camera.fov
      const targetFov = 8 // FOV muy cerrado = sensación de estar justo frente a la puerta
      const duration = 380
      const startTime = performance.now()

      const step = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1)
        const eased = t * t // ease-in: acelera, como al dar los últimos pasos hacia la puerta
        camera.fov = startFov + (targetFov - startFov) * eased
        camera.updateProjectionMatrix()
        if (t < 1) {
          requestAnimationFrame(step)
        } else {
          // La escena se reconstruye por completo al llegar (nueva imagen, nueva
          // cámara con FOV normal), así que solo hace falta avisar hacia dónde ir.
          onHotspotSelectRef.current?.(hotspot.targetAreaId)
        }
      }
      requestAnimationFrame(step)
    }

    const hotspotEntries = hotspots.map((hotspot) => {
      const worldPosition = sphericalToVector3(hotspot.yaw, hotspot.pitch, HOTSPOT_RADIUS)

      const button = document.createElement('button')
      button.type = 'button'
      button.setAttribute('aria-label', hotspot.label)
      button.title = hotspot.label
      button.className =
        'absolute flex items-center justify-center w-12 h-12 rounded-full bg-white/90 border-2 border-white shadow-lg pointer-events-auto hover:bg-brand-500 hover:scale-110 transition-transform duration-150 text-brand-700 hover:text-white animate-pulse'
      button.style.top = '0'
      button.style.left = '0'
      button.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>'
      button.addEventListener('click', () => walkThroughDoor(hotspot))

      hotspotLayer.appendChild(button)
      return { hotspot, worldPosition, button }
    })

    let frameId: number
    const cameraDirection = new THREE.Vector3()
    const projected = new THREE.Vector3()
    const animate = () => {
      frameId = requestAnimationFrame(animate)

      const lookTarget = sphericalToVector3(lon, lat, SPHERE_RADIUS)
      camera.lookAt(lookTarget)
      camera.getWorldDirection(cameraDirection)
      renderer.render(scene, camera)

      const width = mount.clientWidth
      const height = mount.clientHeight
      for (const { worldPosition, button } of hotspotEntries) {
        const facingCamera = worldPosition.dot(cameraDirection) > 0
        if (!facingCamera) {
          button.style.display = 'none'
          continue
        }
        projected.copy(worldPosition).project(camera)
        button.style.display = 'flex'
        const x = (projected.x * 0.5 + 0.5) * width
        const y = (-projected.y * 0.5 + 0.5) * height
        button.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
      }
    }
    animate()

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    })
    resizeObserver.observe(mount)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
      geometry.dispose()
      material.map?.dispose()
      material.dispose()
      renderer.dispose()
      mount.removeChild(canvas)
      mount.removeChild(hotspotLayer)
    }
    // Los hotspots y el punto de entrada son parte del contenido de cada
    // imagen/área, así que reconstruir la escena cuando cambian es correcto:
    // ocurre exactamente cuando el usuario navega a una nueva área.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, hotspots, initialYaw, initialPitch])

  return (
    <div className={`relative w-full h-full bg-gray-900 ${className}`}>
      {/* El canvas y la capa de hotspots de Three.js se montan imperativamente aquí; React nunca les agrega hijos propios. */}
      <div ref={mountRef} className="absolute inset-0" />

      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-white/70 text-sm font-body">Cargando recorrido 360°…</p>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none">
          <p className="text-white/70 text-sm font-body">No se pudo cargar la imagen 360°.</p>
        </div>
      )}
    </div>
  )
}
