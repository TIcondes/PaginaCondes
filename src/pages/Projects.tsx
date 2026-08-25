import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { visibleProjects } from '../data'
import ProjectCardLight from '../components/ui/ProjectCardLight'
import FilterBar from '../components/ui/FilterBar'
import type { Project } from '../types'

const filterOptions = [
  { label: 'Todos',          value: 'all' },
  { label: 'Arequipa ciudad', value: 'ciudad' },
  { label: 'Playa',          value: 'playa' },
  { label: 'Casas',          value: 'casas' },
  { label: 'Departamentos',  value: 'departamentos' },
]

function applyFilter(projects: Project[], filter: string): Project[] {
  if (filter === 'all') return projects
  if (filter === 'ciudad' || filter === 'playa') return projects.filter((p) => p.zone === filter)
  return projects.filter((p) => p.type.includes(filter as 'casas' | 'departamentos'))
}

export default function Projects() {
  usePageMeta(
    'Proyectos — Condes Corporación',
    'Conoce todos nuestros proyectos inmobiliarios en Arequipa: casas y departamentos en venta y preventa.'
  )

  const [filter, setFilter] = useState('all')
  const filtered = applyFilter(visibleProjects, filter)
  const headerRef = useScrollReveal()
  const ref = useScrollReveal([filter])

  return (
    <div>
      {/* Page header — imagen a pantalla completa (render), texto abajo. Llega
          hasta el tope real de la página para quedar detrás del navbar transparente. */}
      <section className="relative min-h-[60vh] flex items-end pb-16 overflow-hidden" ref={headerRef}>
        <div className="absolute inset-0 reveal">
          <img
            src={`${import.meta.env.BASE_URL}images/proyectos/monaco/RENDER-PRINCIPAL.webp`}
            alt="Proyectos Condes Corporación"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-gray-950/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <p className="reveal text-brand-300 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Portafolio</p>
          <h1 className="reveal reveal-delay-1 font-display text-4xl md:text-5xl text-white">
            Todos nuestros <span className="italic text-brand-300">proyectos</span>
          </h1>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14 reveal">
            <FilterBar options={filterOptions} active={filter} onChange={setFilter} />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-body reveal reveal-delay-1">
              No hay proyectos con ese filtro.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {filtered.map((project, i) => (
                <ProjectCardLight key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
