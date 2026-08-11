import { useParams, Link, Navigate } from 'react-router-dom'
import { MapPin, Home, Building2, CheckCircle, ArrowLeft, ArrowRight, Bed, Bath, RotateCw, Phone, Clock } from 'lucide-react'
import { useState, lazy, Suspense } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { visibleProjects, CONTACT } from '../data'

// Three.js (usado por Panorama360Viewer) pesa varios cientos de KB: se carga
// como chunk aparte vía import() dinámico, y solo se descarga cuando el
// usuario efectivamente abre un recorrido 360°, no en cada carga de página.
const Panorama360Viewer = lazy(() => import('../components/ui/Panorama360Viewer'))

function Panorama360Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <p className="text-white/70 text-sm font-body">Cargando visor 360°…</p>
    </div>
  )
}

// La planimetría ya no va en este carrusel de pestañas: se muestra como
// imagen fija más abajo, junto a la información del proyecto.
type GalleryTab = 'renders' | 'avance'
const galleryLabels: Record<GalleryTab, string> = {
  renders: 'Renders',
  avance: 'Avance de obra',
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = visibleProjects.find((p) => p.slug === slug)
  const [activeImg, setActiveImg] = useState(0)
  const [galleryTab, setGalleryTab] = useState<GalleryTab>('renders')
  const [show360, setShow360] = useState(false)
  // Área activa dentro del recorrido 360° caminable del proyecto (uno solo
  // por proyecto, no por tipología), y la orientación con la que la cámara
  // debe entrar a esa área (viene del hotspot que se acaba de cruzar, para
  // simular que se sigue caminando hacia adelante).
  const [activeAreaId, setActiveAreaId] = useState<string | null>(null)
  const [entryYaw, setEntryYaw] = useState(0)
  // Tipología elegida en el selector de la sección "Tipología"
  const [selectedTypologyIndex, setSelectedTypologyIndex] = useState(0)

  const heroRef = useScrollReveal()
  const galleryRef = useScrollReveal()
  const virtualRef = useScrollReveal()
  const contentRef = useScrollReveal()
  const locationRef = useScrollReveal()

  if (!project) return <Navigate to="/proyectos" replace />

  const gallery = project.gallery ?? { renders: project.images }
  const availableTabs = (Object.keys(galleryLabels) as GalleryTab[]).filter(
    (k) => (gallery[k]?.length ?? 0) > 0
  )
  const activeTab: GalleryTab = availableTabs.includes(galleryTab) ? galleryTab : availableTabs[0]
  const tabImages = gallery[activeTab] ?? []

  const currentIdx = visibleProjects.findIndex((p) => p.slug === slug)
  const prev = visibleProjects[currentIdx - 1]
  const next = visibleProjects[currentIdx + 1]

  const selectedTypology = project.typologies?.[selectedTypologyIndex]

  // Único recorrido 360° caminable del proyecto: al hacer clic en un hotspot
  // (botón de puerta), se navega al área conectada y la cámara entra con la
  // orientación indicada por ese hotspot.
  const currentArea = project.areas360.find((a) => a.id === activeAreaId) ?? project.areas360[0]
  const handleHotspotSelect = (targetAreaId: string) => {
    const hotspot = currentArea.hotspots?.find((h) => h.targetAreaId === targetAreaId)
    setEntryYaw(hotspot?.entryYaw ?? 0)
    setActiveAreaId(targetAreaId)
  }

  return (
    <div>
      {/* Hero — llega hasta el tope real de la página para quedar detrás del navbar transparente */}
      <section className="relative h-[23rem] md:h-96 overflow-hidden" ref={heroRef}>
        <img
          src={project.images[0]}
          alt={project.name}
          className="w-full h-full object-cover transition-all duration-700 reveal"
        />
        {/* Degradado de abajo hacia arriba para el texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-gray-950/10" />
        {/* Degradado de izquierda a derecha para que el logo blanco se vea sobre la imagen */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto">
          <Link to="/proyectos" className="reveal inline-flex items-center gap-2 text-brand-300 text-xs font-body tracking-widest uppercase mb-4 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Todos los proyectos
          </Link>
          {project.logo && (
            <img
              src={`${import.meta.env.BASE_URL}${project.logo}`}
              alt={`Logo ${project.name}`}
              className="reveal reveal-delay-1 h-14 md:h-16 w-auto max-w-[200px] object-contain mb-4"
              style={{ filter: 'brightness(0) invert(1)' }}
              loading="lazy"
            />
          )}
          <h1 className="reveal reveal-delay-2 font-display text-4xl md:text-5xl text-white mb-2">{project.name}</h1>
          <div className="reveal reveal-delay-3 flex items-center gap-2 text-white/70">
            <MapPin size={14} className="text-brand-400" />
            <span className="font-body text-sm">{project.location}</span>
          </div>
        </div>
      </section>

      {/* Categorized gallery: Renders / Planimetría / Avance de obra */}
      <section className="bg-gray-50 border-y border-gray-100 py-10" ref={galleryRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="reveal flex flex-wrap gap-2 mb-6">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setGalleryTab(tab); setActiveImg(0) }}
                className={`px-4 py-2 text-sm font-body font-medium border transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600'
                }`}
              >
                {galleryLabels[tab]}
              </button>
            ))}
          </div>

          {tabImages.length > 0 && (
            <>
              <div className="reveal reveal-delay-1 relative overflow-hidden bg-gray-900 aspect-[16/9] mb-3">
                <img
                  src={tabImages[Math.min(activeImg, tabImages.length - 1)]}
                  alt={`${project.name} — ${galleryLabels[activeTab]}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {tabImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {tabImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-24 h-16 overflow-hidden shrink-0 transition-all ${
                        activeImg === i ? 'ring-2 ring-brand-500' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Recorrido Virtual 360° — visor nativo con Three.js, sin iframes externos */}
      <section className="bg-gray-950 py-10" ref={virtualRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="reveal text-brand-400 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Recorrido virtual</p>
          <h2 className="reveal reveal-delay-1 font-display text-2xl text-white mb-6">
            Explora en <span className="italic text-brand-300">360°</span>
          </h2>

          <div className="relative overflow-hidden bg-gray-900 aspect-[16/9]">
            {show360 ? (
              <>
                <Suspense fallback={<Panorama360Fallback />}>
                  <Panorama360Viewer
                    imageUrl={currentArea.imagen360Url}
                    hotspots={currentArea.hotspots}
                    onHotspotSelect={handleHotspotSelect}
                    initialYaw={entryYaw}
                  />
                </Suspense>
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-gray-950/70 backdrop-blur-sm text-white text-xs font-body tracking-wide pointer-events-none">
                  {currentArea.name}
                </div>
              </>
            ) : (
              <button
                onClick={() => setShow360(true)}
                className="group relative w-full h-full block"
                aria-label="Iniciar recorrido virtual 360°"
              >
                <img
                  src={project.images[0]}
                  alt={`Vista previa del recorrido 360° de ${project.name}`}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gray-950/40 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-body text-sm tracking-wide group-hover:bg-brand-600 group-hover:border-brand-600 transition-all duration-300">
                    <RotateCw size={16} />
                    Ver recorrido 360°
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white" ref={contentRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Left — details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div className="reveal">
                <h2 className="font-display text-2xl text-gray-900 mb-4">Descripción</h2>
                <p className="font-body text-gray-600 leading-relaxed">{project.description}</p>
              </div>

              {/* Specs */}
              <div className="reveal reveal-delay-1">
                <h2 className="font-display text-2xl text-gray-900 mb-6">Características</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.minHouseSize && (
                    <div className="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50">
                      <Home size={20} className="text-brand-600 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-body">Casas desde</p>
                        <p className="font-body font-semibold text-gray-900">{project.minHouseSize} m²</p>
                      </div>
                    </div>
                  )}
                  {project.minApartmentSize && (
                    <div className="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50">
                      <Building2 size={20} className="text-brand-600 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-body">Departamentos desde</p>
                        <p className="font-body font-semibold text-gray-900">{project.minApartmentSize} m²</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {project.amenities && (
                <div className="reveal reveal-delay-2">
                  <h2 className="font-display text-2xl text-gray-900 mb-6">Servicios y amenidades</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.amenities.map((item) => (
                      <div key={item} className="flex items-center gap-3 font-body text-gray-700">
                        <CheckCircle size={16} className="text-brand-500 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Planimetría — imagen fija, ya no forma parte del carrusel de pestañas de arriba */}
              {project.gallery?.planimetria?.[0] && (
                <div className="reveal reveal-delay-3">
                  <h2 className="font-display text-2xl text-gray-900 mb-4">Planimetría</h2>
                  <div className="border border-gray-100 bg-gray-50">
                    <img
                      src={project.gallery.planimetria[0]}
                      alt={`Planimetría de ${project.name}`}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right — CTA hacia contacto */}
            <div className="reveal reveal-delay-2">
              <div className="sticky top-28 bg-white border border-gray-100 p-8 shadow-sm text-center">
                <h3 className="font-display text-xl text-gray-900 mb-3">¿Te interesa este proyecto?</h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed mb-6">
                  Escríbenos y un asesor te contactará para resolver todas tus dudas sobre {project.name}.
                </p>
                <Link to="/contacto" className="btn-primary w-full justify-center">
                  Contáctanos <ArrowRight size={16} />
                </Link>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 text-xs text-brand-600 font-body hover:text-brand-700 transition-colors"
                >
                  O contáctanos por WhatsApp →
                </a>
              </div>
            </div>
          </div>

          {/* Tipología específica: área, dormitorios/baños, características propias y plano grande.
              Ocupa las 3 columnas del grid (de lado a lado) para que el plano se vea a buen tamaño. */}
          {project.typologies && project.typologies.length > 0 && selectedTypology && (
            <div className="lg:col-span-3 mt-16 pt-10 border-t border-gray-100">
              <p className="reveal text-brand-600 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Distribución</p>
              <h2 className="reveal reveal-delay-1 font-display text-3xl text-gray-900 mb-8">
                Tipologías <span className="italic text-brand-800">disponibles</span>
              </h2>

              {project.typologies.length > 1 && (
                <div className="reveal reveal-delay-2 flex flex-wrap gap-2 mb-8">
                  {project.typologies.map((t, i) => (
                    <button
                      key={t.name}
                      onClick={() => setSelectedTypologyIndex(i)}
                      className={`px-5 py-2.5 text-sm font-body font-medium border transition-all duration-200 ${
                        selectedTypologyIndex === i
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="reveal reveal-delay-3 border border-gray-100 bg-white">
                <div className="relative aspect-[21/9] bg-gray-50">
                  <img
                    src={selectedTypology.planImage}
                    alt={`Plano de ${selectedTypology.name}`}
                    className="w-full h-full object-contain p-8"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-gray-950/80 text-white text-xs font-body tracking-wide">
                    {selectedTypology.name}
                  </div>
                </div>

                <div className="p-8 border-t border-gray-100">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100">
                      <Home size={16} className="text-brand-500" />
                      <span className="text-sm font-body font-medium text-gray-700">{selectedTypology.area} m²</span>
                    </div>
                    {selectedTypology.bedrooms !== undefined && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100">
                        <Bed size={16} className="text-brand-500" />
                        <span className="text-sm font-body font-medium text-gray-700">{selectedTypology.bedrooms} dormitorios</span>
                      </div>
                    )}
                    {selectedTypology.bathrooms !== undefined && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100">
                        <Bath size={16} className="text-brand-500" />
                        <span className="text-sm font-body font-medium text-gray-700">{selectedTypology.bathrooms} baños</span>
                      </div>
                    )}
                  </div>

                  {selectedTypology.features && selectedTypology.features.length > 0 && (
                    <>
                      <p className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">Incluye</p>
                      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                        {selectedTypology.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-gray-700 font-body">
                            <CheckCircle size={14} className="text-brand-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="reveal mt-16 pt-10 border-t border-gray-100 flex justify-between">
            {prev ? (
              <Link to={`/proyectos/${prev.slug}`} className="group flex items-center gap-3 text-sm font-body text-gray-500 hover:text-brand-600 transition-colors">
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <div>
                  <p className="text-xs text-gray-400">Proyecto anterior</p>
                  <p className="font-medium text-gray-700 group-hover:text-brand-600 transition-colors">{prev.name}</p>
                </div>
              </Link>
            ) : <div />}
            {next ? (
              <Link to={`/proyectos/${next.slug}`} className="group flex items-center gap-3 text-sm font-body text-gray-500 hover:text-brand-600 transition-colors text-right">
                <div>
                  <p className="text-xs text-gray-400">Siguiente proyecto</p>
                  <p className="font-medium text-gray-700 group-hover:text-brand-600 transition-colors">{next.name}</p>
                </div>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      {/* Ubicación y Mapa CTA */}
      <section className="relative py-24 flex items-center justify-center overflow-hidden" ref={locationRef}>
        <div className="absolute inset-0">
          <img
            src={project.images[0]}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-950/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="reveal grid lg:grid-cols-2 items-stretch bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

            {/* Mapa (Iframe de Google Maps) */}
            <div className="h-72 lg:h-auto w-full bg-gray-800 relative">
              <iframe
                title={`Mapa de ${project.name}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(project.name + ' ' + project.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Texto y Contacto */}
            <div className="p-8 lg:p-12 text-white flex flex-col justify-center">
              <p className="text-brand-400 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">
                Ubicado en {project.district || project.city}
              </p>
              <h2 className="font-display text-3xl md:text-4xl mb-10">Conoce nuestro proyecto</h2>

              <div className="space-y-6 mb-10 font-body">
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-lg">{project.name}</p>
                    <p className="text-gray-300 mt-1">{project.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Phone size={24} className="text-brand-400 shrink-0" />
                  <p className="text-lg font-medium">{CONTACT.phone}</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock size={24} className="text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-300">Lun - Vie: 9:00 a.m. - 6:00 p.m.</p>
                    <p className="text-gray-300 mt-1">Sáb: 9:00 a.m. - 1:00 p.m.</p>
                  </div>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(project.name + ' ' + project.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Abrir en Google Maps <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Separador visual para dividir la sección oscura del CTA y el Footer */}
      <div className="h-8 md:h-12 bg-brand-600 w-full" />
    </div>
  )
}
