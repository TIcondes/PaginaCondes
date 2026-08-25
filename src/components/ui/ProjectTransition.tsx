import { useProjectTransition } from '../../context/TransitionContext'

export default function ProjectTransition() {
  const { isActive, isFadingOut, project, skipTransition } = useProjectTransition()

  if (!isActive || !project) return null

  const bgImage = project.images[0]
  const logoSrc = project.logo
    ? `${import.meta.env.BASE_URL}${project.logo}`
    : null

  return (
    <div
      className={`project-transition-overlay ${isFadingOut ? 'fade-out' : ''}`}
      // Tocar/hacer clic en cualquier punto salta directo a la página del
      // proyecto en vez de esperar el resto de la animación, para que nunca
      // se sienta como que la pantalla quedó "congelada".
      onClick={skipTransition}
    >
      {/* Render difuminado de fondo */}
      <div className="project-transition-bg">
        <img src={bgImage} alt="" className="project-transition-bg-img" />
        <div className="project-transition-bg-overlay" />
      </div>

      {/* Logo animado en el centro */}
      {logoSrc && (
        <img
          src={logoSrc}
          alt={project.name}
          className="project-transition-logo"
        />
      )}

      {/* Nombre del proyecto (fallback si no hay logo) */}
      {!logoSrc && (
        <h2 className="project-transition-name">{project.name}</h2>
      )}
    </div>
  )
}
