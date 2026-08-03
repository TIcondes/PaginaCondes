import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
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
  const [filter, setFilter] = useState('all')
  const filtered = applyFilter(visibleProjects, filter)
  const ref = useScrollReveal([filter])

  return (
    <div>
      {/* Page header — llega hasta el tope real de la página para quedar detrás del navbar transparente */}
      <section className="bg-gray-900 pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-brand-400 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Portafolio</p>
          <h1 className="font-display text-5xl text-white">
            Todos nuestros <span className="italic text-brand-300">proyectos</span>
          </h1>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <FilterBar options={filterOptions} active={filter} onChange={setFilter} />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-body">
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
