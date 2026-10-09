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

  // El flag de sessionStorage y el timer de respaldo solo deben armarse una
  // vez, al entrar con el intro activo — por eso van en un efecto aparte con
  // deps vacías (no dependen de `phase`, que sigue cambiando después).
  useEffect(() => {
    if (phase === 'done') return
    sessionStorage.setItem(SESSION_KEY, '1')
    const fallback = setTimeout(startFade, FALLBACK_MS)
    return () => clearTimeout(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Bloquea el scroll del body mientras el intro está activo. Atado a
  // `locked` (no a `[]`) para que la limpieza —que restaura el scroll—
  // corra apenas `phase` llega a 'done', en vez de depender de que el
  // componente se desmonte (nunca se desmonta: solo pasa a renderizar
  // `null`), que es lo que dejaba el scroll trabado para siempre.
  const locked = phase !== 'done'
  useEffect(() => {
    if (!locked) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [locked])

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
        // Sin máscara ni borde/sombra: el video se ve tal cual, sin ningún
        // marco ni difuminado en sus bordes — el único desvanecido pasa al
        // final, cuando todo el overlay se disuelve hacia Inicio.
        className={`w-[90vw] sm:w-[75vw] md:w-[65vw] max-w-3xl transition-all ease-out ${
          fading ? 'opacity-0 blur-xl scale-125' : 'opacity-100 blur-none scale-100'
        }`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      />
    </div>
  )
}
