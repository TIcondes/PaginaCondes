import { useProjectTransition } from '../../context/TransitionContext'

export default function ProjectTransition() {
  const { isActive, isFadingOut, project } = useProjectTransition()

  if (!isActive || !project) return null

  const bgImage = project.images[0]
  const logoSrc = project.logo
    ? `${import.meta.env.BASE_URL}${project.logo}`
    : null

  return (
    <div
      className={`project-transition-overlay ${isFadingOut ? 'fade-out' : ''}`}
      aria-hidden="true"
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
