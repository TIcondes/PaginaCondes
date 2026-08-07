import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Cada vez que cambia la ruta (incluida la navegación con el overlay de
// transición de ProjectTransition), la página debe abrir desde arriba en vez
// de mantener el scroll de la página anterior.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
