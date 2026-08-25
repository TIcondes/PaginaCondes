import { createContext, useContext, useState, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import type { Project } from '../types'

interface TransitionState {
  isActive: boolean
  isFadingOut: boolean
  project: Project | null
}

interface TransitionContextValue extends TransitionState {
  startTransition: (project: Project, navigate: (path: string) => void) => void
  skipTransition: () => void
}

const TransitionContext = createContext<TransitionContextValue>({
  isActive: false,
  isFadingOut: false,
  project: null,
  startTransition: () => {},
  skipTransition: () => {},
})

export function useProjectTransition() {
  return useContext(TransitionContext)
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TransitionState>({
    isActive: false,
    isFadingOut: false,
    project: null,
  })
  const busyRef = useRef(false)
  // Timeouts pendientes de la transición en curso, para poder cancelarlos si
  // el usuario toca la pantalla y quiere saltarla (ver skipTransition).
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const navigateRef = useRef<{ navigate: (path: string) => void; project: Project; navigated: boolean } | null>(null)

  const clearPendingTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  const finish = () => {
    clearPendingTimeouts()
    setState({ isActive: false, isFadingOut: false, project: null })
    busyRef.current = false
    navigateRef.current = null
  }

  // Permite saltar la animación en cualquier momento (ej. el usuario toca la
  // pantalla mientras el overlay está activo): navega de inmediato si aún no
  // se navegó, y desmonta el overlay sin esperar el resto de las fases.
  const skipTransition = useCallback(() => {
    if (!busyRef.current || !navigateRef.current) return
    if (!navigateRef.current.navigated) {
      navigateRef.current.navigated = true
      navigateRef.current.navigate(`/proyectos/${navigateRef.current.project.slug}`)
    }
    finish()
  }, [])

  const startTransition = useCallback((project: Project, navigate: (path: string) => void) => {
    if (busyRef.current) return
    busyRef.current = true
    navigateRef.current = { navigate, project, navigated: false }

    // Fase 1: Mostrar overlay con logo creciendo
    setState({ isActive: true, isFadingOut: false, project })

    const t1 = setTimeout(() => {
      // Fase 2: Navegar a la página del proyecto
      if (navigateRef.current) navigateRef.current.navigated = true
      navigate(`/proyectos/${project.slug}`)

      // Fase 3: Iniciar fade-out del overlay
      const t2 = setTimeout(() => {
        setState((prev) => ({ ...prev, isFadingOut: true }))

        // Fase 4: Desmontar overlay completamente
        const t3 = setTimeout(finish, 350)
        timeoutsRef.current.push(t3)
      }, 250)
      timeoutsRef.current.push(t2)
    }, 700)
    timeoutsRef.current.push(t1)
  }, [])

  return (
    <TransitionContext.Provider value={{ ...state, startTransition, skipTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}
