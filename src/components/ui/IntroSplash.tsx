import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Se muestra una sola vez por sesión de navegador (sessionStorage), y solo
// al entrar a Inicio — así no interrumpe cada vez que el usuario vuelve a "/"
// navegando por el sitio, ni aparece en otras páginas.
const SESSION_KEY = 'condes-intro-shown'
const PLAYBACK_RATE = 1.5
// El video dura 10s reales (~6.7s a 1.5x). Si tarda en cargar/arrancar
// (autoplay bloqueado, red lenta, etc.) no se queda trabado esperando: a
// los 9s pasa igual a disolverse — con margen de sobra para que en el caso
// normal sea siempre el propio final del video el que dispare el desvanecido.
const FALLBACK_MS = 9000
const FADE_MS = 2200

type Phase = 'video' | 'fading' | 'done'

export default function IntroSplash() {
  const location = useLocation()

  // Decide una sola vez, en el primer render, si corresponde mostrar el
  // intro — evita un parpadeo donde se monta y se desmonta de inmediato.
  const [phase, setPhase] = useState<Phase>(() => {
    if (location.pathname !== '/') return 'done'
    if (sessionStorage.getItem(SESSION_KEY)) return 'done'
    return 'video'
  })

  const startFade = () => setPhase((p) => (p === 'video' ? 'fading' : p))

  useEffect(() => {
    if (phase === 'done') return

    sessionStorage.setItem(SESSION_KEY, '1')
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const fallback = setTimeout(startFade, FALLBACK_MS)

    return () => {
      document.body.style.overflow = prevOverflow
      clearTimeout(fallback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'fading') return
    const t = setTimeout(() => setPhase('done'), FADE_MS)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'done') return null

  const fading = phase === 'fading'

  return (
    <div
      className={`fixed inset-0 z-[300] bg-white flex items-center justify-center transition-opacity ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <video
        ref={(el) => { if (el) el.playbackRate = PLAYBACK_RATE }}
        src={`${import.meta.env.BASE_URL}videos/animacioninicio.mp4`}
        autoPlay
        muted
        playsInline
        // Algunos navegadores reinician playbackRate a 1 apenas resuelven los
        // metadatos del video, pisando el valor puesto por el ref — se vuelve
        // a fijar acá para asegurar que quede en 1.5x.
        onLoadedMetadata={(e) => { e.currentTarget.playbackRate = PLAYBACK_RATE }}
        onEnded={startFade}
        // Máscara radial amplia: el núcleo sólido es chico y el resto es un
        // degradado largo hacia transparente, para que no quede ni un borde
        // tenue del rectángulo — se ve el blanco del fondo "comiéndose" el
        // video por todos lados en vez de un cuadro con esquinas suavizadas.
        className={`w-[90vw] sm:w-[75vw] md:w-[65vw] max-w-3xl transition-all ease-out ${
          fading ? 'opacity-0 blur-xl scale-125' : 'opacity-100 blur-none scale-100'
        }`}
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at center, black 20%, transparent 70%)',
          maskImage: 'radial-gradient(ellipse 50% 50% at center, black 20%, transparent 70%)',
          transitionDuration: `${FADE_MS}ms`,
        }}
      />
    </div>
  )
}
