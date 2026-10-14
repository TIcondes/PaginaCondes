import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import IntroLogoMark, { INTRO_ANIMATION_MS } from './IntroLogoMark'

// Se muestra una sola vez por sesión de navegador (sessionStorage), y solo
// al entrar a Inicio — así no interrumpe cada vez que el usuario vuelve a "/"
// navegando por el sitio, ni aparece en otras páginas.
const SESSION_KEY = 'condes-intro-shown'
const FADE_MS = 2200

type Phase = 'logo' | 'fading' | 'done'

export default function IntroSplash() {
  const location = useLocation()

  // Decide una sola vez, en el primer render, si corresponde mostrar el
  // intro — evita un parpadeo donde se monta y se desmonta de inmediato.
  const [phase, setPhase] = useState<Phase>(() => {
    if (location.pathname !== '/') return 'done'
    if (sessionStorage.getItem(SESSION_KEY)) return 'done'
    return 'logo'
  })

  // El flag de sessionStorage y el timer que pasa a la fase de desvanecido
  // solo deben armarse una vez, al entrar con el intro activo — por eso van
  // en un efecto aparte con deps vacías (no dependen de `phase`, que sigue
  // cambiando después). A diferencia del video, la animación en CSS/SVG no
  // depende de que cargue ni de que el navegador permita el autoplay, así
  // que esta espera es siempre la misma, sin necesitar un timer de respaldo.
  useEffect(() => {
    if (phase === 'done') return
    sessionStorage.setItem(SESSION_KEY, '1')
    const t = setTimeout(() => setPhase('fading'), INTRO_ANIMATION_MS)
    return () => clearTimeout(t)
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
      className={`fixed inset-0 z-[300] bg-white flex items-center justify-center transition-all ease-out ${
        fading ? 'opacity-0 blur-xl scale-110 pointer-events-none' : 'opacity-100 blur-none scale-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <IntroLogoMark />
    </div>
  )
}
