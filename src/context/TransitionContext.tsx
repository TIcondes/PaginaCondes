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
}

const TransitionContext = createContext<TransitionContextValue>({
  isActive: false,
  isFadingOut: false,
  project: null,
  startTransition: () => {},
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

  const startTransition = useCallback((project: Project, navigate: (path: string) => void) => {
    if (busyRef.current) return
    busyRef.current = true

    // Fase 1: Mostrar overlay con logo creciendo (1s)
    setState({ isActive: true, isFadingOut: false, project })

    setTimeout(() => {
      // Fase 2: Navegar a la página del proyecto
      navigate(`/proyectos/${project.slug}`)

      // Fase 3: Iniciar fade-out del overlay (300ms después de navegar)
      setTimeout(() => {
        setState((prev) => ({ ...prev, isFadingOut: true }))

        // Fase 4: Desmontar overlay completamente
        setTimeout(() => {
          setState({ isActive: false, isFadingOut: false, project: null })
          busyRef.current = false
        }, 600)
      }, 400)
    }, 1200)
  }, [])

  return (
    <TransitionContext.Provider value={{ ...state, startTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}
