import { useEffect } from 'react'

// Cambia el <title> y el meta description del documento al navegar entre
// páginas (esta es una SPA sin servidor, así que index.html solo trae un
// título genérico — esto lo hace específico por página en el navegador y
// para el indexado de Google, que sí ejecuta JS). No reemplaza Open Graph
// por página: eso necesitaría HTML pre-renderizado por ruta en el build,
// que no tenemos.
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title

    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])
}
