import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Se muestra una sola vez por sesión de navegador (sessionStorage), y solo
// al entrar a Inicio — así no interrumpe cada vez que el usuario vuelve a "/"
// navegando por el sitio, ni aparece en otras páginas.
const SESSION_KEY = 'condes-intro-shown'
// Si el video tarda en cargar/arrancar (autoplay bloqueado, red lenta, etc.)
// no se queda trabado esperando: a los 6s pasa igual a disolverse.
const FALLBACK_MS = 6000
const FADE_MS = 1100

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
        src={`${import.meta.env.BASE_URL}videos/animacioninicio.mp4`}
        autoPlay
        muted
        playsInline
        onEnded={startFade}
        // Máscara radial: los bordes del video se funden a transparente (se
        // ve el blanco del fondo a través), en vez de un recorte rectangular
        // duro — así el video se "disuelve" en la pantalla en vez de verse
        // como una tarjeta flotando encima.
        className={`w-64 sm:w-80 md:w-96 transition-all ease-out ${
          fading ? 'opacity-0 blur-xl scale-125' : 'opacity-100 blur-none scale-100'
        }`}
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at center, black 45%, transparent 85%)',
          maskImage: 'radial-gradient(ellipse 50% 50% at center, black 45%, transparent 85%)',
          transitionDuration: `${FADE_MS}ms`,
        }}
      />
    </div>
  )
}
