// Un hotspot es un botón de navegación colocado en la posición (yaw/pitch) de
// una puerta u otro punto de paso dentro de un recorrido 360°. Al hacer clic,
// el visor "camina" hacia la siguiente área (targetAreaId), simulando
// movimiento entre ambientes del proyecto.
export interface PanoramaHotspot {
  targetAreaId: string   // id del PanoramaArea al que se navega
  label: string          // texto accesible/tooltip, ej. "Ir a la cocina"
  yaw: number             // posición horizontal del botón sobre la esfera (grados)
  pitch: number           // posición vertical del botón sobre la esfera (grados)
  entryYaw?: number       // hacia dónde mira la cámara al llegar a la nueva área (grados)
}

// Una escena/ambiente dentro del recorrido 360° caminable de un proyecto
// (ej. "Sala", "Cocina", "Dormitorio principal"). Cada área tiene su propia
// imagen equirectangular y, opcionalmente, hotspots hacia áreas contiguas.
export interface PanoramaArea {
  id: string
  name: string
  imagen360Url: string    // Imagen equirectangular (360°, exportada de D5 Render) de esta área
  hotspots?: PanoramaHotspot[]
}

// Una tipología es un modelo de vivienda dentro de un proyecto (ej. "Casa 3 dormitorios").
export interface Typology {
  name: string
  area: number                // m2 de esta tipología
  bedrooms?: number
  bathrooms?: number
  planImage: string           // Imagen del plano de esta tipología
  features?: string[]         // Características específicas de esta tipología (ej. "Cocina equipada", "Balcón")
}

// Galería categorizada por pestañas en la vista de detalle del proyecto.
export interface ProjectGallery {
  renders?: string[]          // Renders finales del proyecto
  planimetria?: string[]      // Planos de loteo / masterplan
  avance?: string[]           // Fotos reales del avance de obra
}

// Estructura completa de un proyecto inmobiliario.
// Cada objeto de `projects` (en src/data/index.ts) debe cumplir esta interfaz.
export interface Project {
  id: string                                // Identificador único
  name: string                              // Título principal (ej. "Florencia Residencial")
  slug: string                              // URL amigable, sin espacios. Ruta: /proyectos/:slug
  location: string                          // Ubicación visible en tarjetas (ej. "Distrito · Ciudad")
  district: string                          // Distrito, usado en filtros/metadata
  city: string                              // Ciudad
  tag?: string                              // Etiqueta destacada en UI (ej. "Premium", "Playa", "Preventa")
  status: 'disponible' | 'preventa' | 'entregado'
  type: ('casas' | 'departamentos')[]       // Tipos de inmuebles ofrecidos (para filtrado)
  zone: 'ciudad' | 'playa'                  // Zona geográfica (para filtrado)
  images: string[]                          // Imágenes principales para la tarjeta de presentación
  logo?: string                             // Isotipo/logo a color del proyecto (public/logos/proyectos), mostrado en la tarjeta y en el detalle
  gallery?: ProjectGallery                  // Galería categorizada (renders, planimetría, avance)
  // Recorrido 360° caminable del proyecto: un único recorrido por proyecto
  // (no por tipología), con nodos/ambientes conectados por hotspots en las
  // puertas. El primer elemento del array es el punto de entrada. Obligatorio
  // para que TODO proyecto tenga su Recorrido Virtual 360° nativo (Three.js,
  // ver Panorama360Viewer). Si aún no hay fotos 360 reales, usar
  // buildAreas360() (src/data/index.ts) como valor temporal.
  areas360: PanoramaArea[]
  typologies?: Typology[]                   // Modelos de vivienda disponibles del proyecto
  minHouseSize?: number                     // Área mínima en m2 para casas (si aplica)
  minApartmentSize?: number                 // Área mínima en m2 para departamentos (si aplica)
  features: string[]                        // Viñetas principales para el resumen del proyecto
  description: string                       // Descripción completa para la vista de detalle
  amenities?: string[]                      // Áreas comunes y servicios
  // Oculta el proyecto de todas las vistas públicas (Home, catálogo /proyectos
  // y su propia página de detalle) sin borrar sus datos. Útil para pausar la
  // publicación de un proyecto (ej. vendido, en revisión) y poder reactivarlo
  // después con solo quitar este campo. Ver `visibleProjects` en data/index.ts.
  hidden?: boolean
}

export interface NavLink {
  label: string
  to: string
}

export interface ContactFormData {
  fullName: string
  project: string
  email: string
  phone: string
  contactMethod: 'phone' | 'email'
}
