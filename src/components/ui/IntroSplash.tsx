import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Se muestra una sola vez por sesión de navegador (sessionStorage), y solo
// al entrar a Inicio — así no interrumpe cada vez que el usuario vuelve a "/"
// navegando por el sitio, ni aparece en otras páginas.
const SESSION_KEY = 'condes-intro-shown'
// Si el video tarda en cargar o falla, no se queda trabado esperando: a los
// 6s pasa igual a la fase de desvanecido.
const FALLBACK_MS = 6000

type Phase = 'video' | 'cover' | 'fading' | 'done'

export default function IntroSplash() {
  const location = useLocation()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Decide una sola vez, en el primer render, si corresponde mostrar el
  // intro — evita un parpadeo donde se monta y se desmonta de inmediato.
  const [phase, setPhase] = useState<Phase>(() => {
    if (location.pathname !== '/') return 'done'
    if (sessionStorage.getItem(SESSION_KEY)) return 'done'
    return 'video'
  })

  useEffect(() => {
    if (phase === 'done') return

    sessionStorage.setItem(SESSION_KEY, '1')
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const fallback = setTimeout(() => setPhase((p) => (p === 'video' ? 'cover' : p)), FALLBACK_MS)

    return () => {
      document.body.style.overflow = prevOverflow
      clearTimeout(fallback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'cover') return
    // El video ya se desvaneció a blanco sólido; una pausa breve antes de
    // empezar a disolver todo el overlay, para que el blanco se sienta
    // intencional y no como un simple corte.
    const t = setTimeout(() => setPhase('fading'), 400)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'fading') return
    const t = setTimeout(() => setPhase('done'), 900)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-[300] bg-white flex items-center justify-center transition-all duration-[900ms] ease-out ${
        phase === 'fading' ? 'opacity-0 blur-2xl scale-105 pointer-events-none' : 'opacity-100 blur-none scale-100'
      }`}
    >
      <video
        ref={videoRef}
        src={`${import.meta.env.BASE_URL}videos/animacioninicio.mp4`}
        autoPlay
        muted
        playsInline
        onEnded={() => setPhase('cover')}
        className={`w-56 sm:w-72 md:w-80 rounded-2xl shadow-2xl transition-opacity duration-300 ${
          phase === 'video' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
