import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Pause, Play } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { projects, teamImages, seasonalBanner } from '../data'
import ProjectCardLight from '../components/ui/ProjectCardLight'

const costaReal = projects.find((p) => p.slug === 'costa-real')
const TEAM_SLIDE_INTERVAL = 4500 // ms entre cada cambio de foto del carrusel de equipo
const HOME_PROJECTS_LIMIT = 4

export default function Home() {
  // Solo proyectos en venta (disponible o preventa); los entregados no se
  // muestran en el Home — el catálogo completo con ese filtro vive en /proyectos.
  const homeProjects = projects
    .filter((p) => p.status !== 'entregado')
    .slice(0, HOME_PROJECTS_LIMIT)

  const heroRef = useScrollReveal()
  const bannerRef = useScrollReveal()
  const nosotrosRef = useScrollReveal()
  const projectsRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  // Carrusel de fotos del equipo: cambia de imagen lentamente con un
  // crossfade, y se puede pausar (accesibilidad para quienes prefieren
  // menos movimiento en pantalla).
  const [activeTeamImg, setActiveTeamImg] = useState(0)
  const [teamAutoplay, setTeamAutoplay] = useState(true)

  useEffect(() => {
    if (!teamAutoplay) return
    const id = setInterval(() => {
      setActiveTeamImg((i) => (i + 1) % teamImages.length)
    }, TEAM_SLIDE_INTERVAL)
    return () => clearInterval(id)
  }, [teamAutoplay])

  return (
    <>
      {/* HERO — imagen a pantalla completa, título corto, un solo CTA */}
      <section className="relative min-h-screen flex items-end pb-28 overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 reveal">
          <img
            src="https://condescorporacion.com/wp-content/uploads/elementor/thumbs/FOTO-FLORENCIA-PRINCIPAL-scaled-rhd99c2bfikafnj52goytmbz8k96kh5grtn9bklry0.png"
            alt="Condes Corporación"
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/25 to-gray-950/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <h1 className="reveal font-display text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-wide leading-tight max-w-4xl mb-8">
            Creamos <span className="italic text-brand-300 normal-case">hogares</span> que inspiran
          </h1>
          <Link to="/proyectos" className="reveal reveal-delay-1 btn-pill">
            Ver proyectos <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* BANNER DE TEMPORADA — formal, editable desde data/index.ts (seasonalBanner) */}
      <section className="bg-brand-900 py-14" ref={bannerRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border border-white/10 px-8 py-10 md:py-12">
            <div>
              <p className="reveal text-brand-300 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">
                {seasonalBanner.tag}
              </p>
              <h2 className="reveal reveal-delay-1 font-display text-2xl md:text-3xl text-white leading-tight max-w-xl">
                {seasonalBanner.title}
              </h2>
            </div>
            <Link to={seasonalBanner.href} className="reveal reveal-delay-2 btn-outline shrink-0">
              {seasonalBanner.cta} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* NOSOTROS — texto breve + carrusel de fotos con crossfade automático */}
      <section className="py-24 bg-white" ref={nosotrosRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="reveal text-brand-600 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Nuestro equipo</p>
              <h2 className="reveal reveal-delay-1 font-display text-3xl md:text-4xl text-gray-900 leading-tight mb-5">
                Ingenieros y arquitectos <span className="italic text-brand-800">a tu servicio</span>
              </h2>
              <p className="reveal reveal-delay-2 font-body text-gray-500 leading-relaxed mb-8 max-w-md">
                Un equipo multidisciplinario que respalda cada proyecto con procesos transparentes y diseño de calidad.
              </p>
              <Link to="/nosotros" className="reveal reveal-delay-3 btn-dark inline-flex">
                Conoce el equipo <ArrowRight size={16} />
              </Link>
            </div>

            <div className="reveal reveal-delay-2 relative aspect-[4/3] overflow-hidden bg-gray-100">
              {teamImages.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="Equipo Condes Corporación"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    i === activeTeamImg ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}
              <button
                onClick={() => setTeamAutoplay((playing) => !playing)}
                className="absolute bottom-4 right-4 w-9 h-9 flex items-center justify-center bg-gray-950/60 text-white hover:bg-gray-950/80 transition-colors"
                aria-label={teamAutoplay ? 'Pausar carrusel de fotos' : 'Reanudar carrusel de fotos'}
              >
                {teamAutoplay ? <Pause size={14} /> : <Play size={14} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROYECTOS — fondo blanco: intro + encabezado centrado con pestañas + grid.
          Separador propio arriba porque la sección anterior (Nosotros) también
          es blanca y, si no, se confunden en un solo bloque sin corte visual. */}
      <section className="pt-4 pb-24 bg-white" ref={projectsRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="border-t border-gray-100 mb-20" />

          {/* Intro */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            <h2 className="reveal font-display text-3xl md:text-4xl leading-tight">
              <span className="block font-normal text-brand-600">Encuentra tu</span>
              <span className="block font-bold text-gray-900">Hogar ideal</span>
            </h2>
            <p className="reveal reveal-delay-1 font-body text-gray-500 leading-relaxed">
              Encuentra las mejores opciones en Condes Corporación, el ambiente ideal que buscas para ti y tu familia. Somos una desarrolladora inmobiliaria arequipeña firmemente comprometida con el crecimiento y desarrollo de la región.
            </p>
          </div>

          {/* Encabezado */}
          <div className="text-center mb-12">
            <p className="reveal text-brand-600 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Conoce nuestros proyectos</p>
            <h2 className="reveal reveal-delay-1 font-display text-3xl md:text-4xl text-gray-900">Escoge tu mejor opción</h2>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-14">
            {homeProjects.map((project, i) => (
              <ProjectCardLight key={project.id} project={project} index={i} />
            ))}
          </div>

          <div className="flex justify-end mt-12">
            <Link
              to="/proyectos"
              aria-label="Ver todos los proyectos"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-colors"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL — imagen a pantalla completa, título corto, un solo CTA */}
      {costaReal && (
        <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden" ref={ctaRef}>
          <div className="absolute inset-0 reveal">
            <img
              src={costaReal.images[0]}
              alt={costaReal.name}
              className="w-full h-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gray-950/70" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto px-6">
            <h2 className="reveal reveal-delay-1 font-display text-3xl md:text-5xl text-white uppercase tracking-wide mb-8">
              ¿Listo para encontrar <span className="italic text-brand-300 normal-case">tu hogar ideal?</span>
            </h2>
            <Link to="/contacto" className="reveal reveal-delay-2 btn-pill">
              Contáctanos <ChevronRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
