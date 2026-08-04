import { Link } from 'react-router-dom'
import { ArrowUpRight, Home, Building2 } from 'lucide-react'
import type { Project } from '../../types'

interface Props {
  project: Project
  index?: number
}

const delayClasses = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3']

// Tarjeta de proyecto "clara" (fondo blanco, esquinas redondeadas), usada
// tanto en la sección de proyectos del Home como en el catálogo /proyectos.
export default function ProjectCardLight({ project, index = 0 }: Props) {
  return (
    <div className={`group reveal ${delayClasses[index % delayClasses.length]}`}>
      <div className="relative aspect-[4/3]">
        <img
          src={project.images[0]}
          alt={project.name}
          className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
        <Link
          to={`/proyectos/${project.slug}`}
          aria-label={`Ver ${project.name}`}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-900 shadow-sm hover:bg-white transition-colors"
        >
          <ArrowUpRight size={18} />
        </Link>
        <span className="absolute -bottom-3 left-5 bg-brand-600 text-white text-xs font-body font-medium px-3 py-1.5 rounded-full shadow-sm">
          {project.location}
        </span>
      </div>

      <div className="pt-6 px-1">
        {project.logo && (
          <img
            src={`${import.meta.env.BASE_URL}${project.logo}`}
            alt={`Logo ${project.name}`}
            className="h-14 w-auto max-w-[160px] object-contain mx-auto mb-4"
            loading="lazy"
          />
        )}
        <h3 className="font-display text-lg text-brand-800 font-bold mb-1 text-center">{project.name}</h3>
        <p className="text-sm text-gray-400 font-body text-center mb-5 pb-5 border-b border-gray-100">{project.location}</p>
        <div className="space-y-1.5 mb-5">
          {project.minHouseSize && (
            <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
              <Home size={14} className="text-brand-500 shrink-0" />
              Casas desde {project.minHouseSize} m²
            </div>
          )}
          {project.minApartmentSize && (
            <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
              <Building2 size={14} className="text-brand-500 shrink-0" />
              Departamentos desde {project.minApartmentSize} m²
            </div>
          )}
        </div>
        <Link
          to={`/proyectos/${project.slug}`}
          className="inline-flex items-center justify-center bg-brand-800 text-white text-xs font-body font-semibold tracking-wide uppercase px-5 py-2.5 rounded-full hover:bg-brand-900 transition-colors"
        >
          Más información
        </Link>
      </div>
    </div>
  )
}
