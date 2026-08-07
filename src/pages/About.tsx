import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { teamImages, CONTACT } from '../data'
import { Ruler, Scale, Shield, Calculator, ArrowRight, Target, Eye, Pause, Play } from 'lucide-react'

// `image`: pega aquí la URL de la foto/render de cada área cuando la tengas
// (ej. una obra en construcción para Ingeniería, un plano para Arquitectura).
// Mientras esté vacío, el expositor muestra un fondo de color plano.
const disciplines = [
  { icon: Ruler,      label: 'Arquitectura',  desc: 'Diseños funcionales y modernos adaptados a cada terreno y necesidad.',   image: '' },
  { icon: Shield,     label: 'Ingeniería',    desc: 'Estructuras seguras certificadas por ingenieros colegiados.',           image: '' },
  { icon: Scale,      label: 'Legal',         desc: 'Procesos 100% transparentes con respaldo legal en cada etapa.',         image: '' },
  { icon: Calculator, label: 'Contabilidad',  desc: 'Gestión financiera responsable para proyectos sostenibles.',            image: '' },
]

const TEAM_SLIDE_INTERVAL = 4500 // ms entre cada cambio de foto

// Oculta la sección "Equipo" (foto grande a pantalla completa) a pedido, sin
// borrar su código ni sus datos — para volver a mostrarla, poner en `true`.
const SHOW_TEAM_SECTION = false

export default function About() {
  const heroRef = useScrollReveal()
  const teamRef = useScrollReveal()
  const valuesRef = useScrollReveal()

  // Carrusel de fotos del equipo: crossfade automático, pausable.
  const [activeImg, setActiveImg] = useState(0)
  const [teamAutoplay, setTeamAutoplay] = useState(true)

  // Expositor de áreas de expertise: pila de imágenes solapadas que se
  // recorre arrastrando el mouse/dedo (sin botones). La activa queda grande
  // y nítida; las demás, detrás y difuminadas.
  const [activeDiscipline, setActiveDiscipline] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const dragStartX = useRef(0)
  const didDrag = useRef(false)

  const goToDiscipline = (i: number) => {
    const len = disciplines.length
    setActiveDiscipline(((i % len) + len) % len)
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
    didDrag.current = false
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) > 5) didDrag.current = true
    setDragX(delta)
  }
  const handlePointerUp = () => {
    if (!isDragging) return
    const SWIPE_THRESHOLD = 60
    if (dragX < -SWIPE_THRESHOLD) goToDiscipline(activeDiscipline + 1)
    else if (dragX > SWIPE_THRESHOLD) goToDiscipline(activeDiscipline - 1)
    setIsDragging(false)
    setDragX(0)
  }

  // Avanza solo mientras no se esté arrastrando. Depende de `activeDiscipline`
  // para que cada cambio (manual o automático) reinicie el conteo, así nunca
  // compite con una interacción reciente del usuario.
  useEffect(() => {
    if (isDragging) return
    const id = setInterval(() => {
      goToDiscipline(activeDiscipline + 1)
    }, 4500)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDiscipline, isDragging])

  useEffect(() => {
    if (!teamAutoplay) return
    const id = setInterval(() => {
      setActiveImg((i) => (i + 1) % teamImages.length)
    }, TEAM_SLIDE_INTERVAL)
    return () => clearInterval(id)
  }, [teamAutoplay])

  return (
    <div>
      {/* Header — imagen a pantalla completa (render), texto abajo. Llega hasta
          el tope real de la página para quedar detrás del navbar transparente. */}
      <section className="relative min-h-[60vh] flex items-end pb-16 overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 reveal">
          <img
            src="https://condescorporacion.com/wp-content/uploads/2026/04/PARQUE-CENTRAL-EDIFICIO.png"
            alt="Condes Corporación"
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-gray-950/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <p className="reveal text-brand-300 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Quiénes somos</p>
          <h1 className="reveal reveal-delay-1 font-display text-4xl md:text-5xl text-white max-w-xl">
            Un equipo de <span className="italic text-brand-300">profesionales</span>
          </h1>
        </div>
      </section>

      {/* Misión — sección propia, fondo blanco, contenido alineado a la izquierda */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-xl mr-auto text-left">
            <div className="w-16 h-16 bg-brand-50 flex items-center justify-center mb-6">
              <Target size={28} className="text-brand-600" />
            </div>
            <p className="text-brand-600 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Misión</p>
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-6">¿Qué hacemos?</h2>
            <p className="font-body text-gray-500 leading-relaxed text-lg">
              Desarrollar proyectos inmobiliarios de alta calidad que mejoren la calidad de vida de las familias arequipeñas, ofreciendo diseños funcionales, estructuras seguras y procesos legales transparentes. Actuamos con responsabilidad, honestidad y compromiso en cada etapa del proceso constructivo.
            </p>
          </div>
        </div>
      </section>

      {/* Visión — sección propia, color oficial de marca de fondo, contenido alineado a la derecha */}
      <section className="py-24 bg-brand-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-xl ml-auto text-left">
            <div className="w-16 h-16 bg-white/10 border border-white/20 flex items-center justify-center mb-6">
              <Eye size={28} className="text-white" />
            </div>
            <p className="text-brand-100 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Visión</p>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">¿A dónde vamos?</h2>
            <p className="font-body text-brand-50 leading-relaxed text-lg">
              Ser la empresa inmobiliaria líder del sur del Perú, reconocida por la calidad de sus proyectos, la solidez de su equipo profesional y la confianza que depositan en nosotros las familias que eligen Condes Corporación como su aliado para encontrar el hogar de sus sueños.
            </p>
          </div>
        </div>
      </section>

      {/* Disciplines — pila de imágenes solapadas: la activa grande y nítida,
          las demás detrás y difuminadas. Se recorre arrastrando, sin botones.
          Subsección más compacta que Misión/Visión. */}
      <section className="py-20 bg-white" ref={valuesRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="reveal section-tag">Áreas de expertise</p>
            <h2 className="reveal reveal-delay-1 section-title">¿Por qué elegirnos?</h2>
          </div>

          <div className="reveal reveal-delay-2 relative h-[560px] overflow-hidden">
            <div
              className="absolute inset-0 select-none touch-none cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {disciplines.map(({ icon: Icon, label, desc, image }, i) => {
                const len = disciplines.length
                let diff = i - activeDiscipline
                if (diff > len / 2) diff -= len
                if (diff < -len / 2) diff += len
                const absDiff = Math.abs(diff)
                const isActive = diff === 0

                const translateX = diff * 300 + (isDragging ? dragX * 0.4 : 0)
                const scale = Math.max(1 - absDiff * 0.14, 0.6)
                const opacity = isActive ? 1 : absDiff === 1 ? 0.55 : 0.25
                const blurClass = isActive ? '' : absDiff === 1 ? 'blur-sm' : 'blur-md'

                return (
                  <div
                    key={label}
                    onClick={() => { if (!didDrag.current) goToDiscipline(i) }}
                    style={{
                      transform: `translateX(-50%) translateX(${translateX}px) scale(${scale})`,
                      zIndex: 20 - absDiff,
                      opacity,
                    }}
                    className={`absolute left-1/2 top-0 w-[340px] md:w-[540px] h-full shadow-2xl ${blurClass} ${
                      isDragging ? '' : 'transition-all duration-500 ease-out'
                    } ${isActive ? '' : 'cursor-pointer'}`}
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      {image ? (
                        <img src={image} alt={label} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />
                      ) : (
                        // Placeholder de fondo plano — reemplazar por `image` en el array `disciplines` de arriba
                        <div className="w-full h-full bg-brand-800" />
                      )}
                      {isActive && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/10 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-10 max-w-full">
                            <div className="w-14 h-14 bg-white/10 border border-white/20 flex items-center justify-center mb-5">
                              <Icon size={26} className="text-white" />
                            </div>
                            <h3 className="font-display text-3xl text-white mb-2">{label}</h3>
                            <p className="font-body text-base text-white/80 leading-relaxed">{desc}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Equipo — imagen grande a pantalla completa con el texto superpuesto */}
      {SHOW_TEAM_SECTION && (
        <section className="relative h-[55vh] min-h-[420px] md:h-[85vh] md:min-h-[600px] flex items-end pb-20 overflow-hidden" ref={teamRef}>
          <div className="absolute inset-0 reveal">
            {teamImages.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Equipo Condes Corporación"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  i === activeImg ? 'opacity-100' : 'opacity-0'
                }`}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <p className="reveal text-brand-300 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Nuestro equipo</p>
            <h2 className="reveal reveal-delay-1 font-display text-3xl md:text-5xl text-white max-w-2xl mb-8">
              Conoce a los <span className="italic text-brand-300">profesionales</span>
            </h2>
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="reveal reveal-delay-2 btn-pill">
              Hablar con nosotros <ArrowRight size={16} />
            </a>
          </div>

          <button
            onClick={() => setTeamAutoplay((playing) => !playing)}
            className="absolute bottom-8 right-8 md:right-12 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            aria-label={teamAutoplay ? 'Pausar carrusel de fotos' : 'Reanudar carrusel de fotos'}
          >
            {teamAutoplay ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </section>
      )}
    </div>
  )
}
