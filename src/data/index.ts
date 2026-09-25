import type { Project, NavLink, PanoramaArea } from '../types'

// Todas las fotos/renders reales viven en public/images (descargadas de
// condescorporacion.com y convertidas a WebP ~1920px máx, calidad 82 con
// sharp/libvips — antes se cargaban directo desde ahí y pesaban varios MB
// cada una, lo que hacía la carga muy lenta). El render principal de cada
// proyecto además tiene una miniatura -thumb aparte (ver `thumbnail` en
// Project) para la tarjeta de /proyectos y el Home. Este helper arma la
// ruta completa respetando el `base` de Vite (necesario porque en
// producción el sitio vive bajo /PaginaCondes/).
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const navLinks: NavLink[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Proyectos', to: '/proyectos' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
]

// ============================================================================
// BASE DE DATOS DE PROYECTOS (LOCAL)
// ============================================================================
// No se usan bases de datos ni archivos JSON externos: toda la información
// vive aquí, tipada por la interfaz `Project` (ver src/types/index.ts).
//
// Para agregar un NUEVO PROYECTO:
//   1. Copia un bloque { ... } existente y pégalo al final del array.
//   2. Rellena los datos correspondientes (ver comentarios en el primer
//      proyecto, que documentan cada campo por sección).
//   3. La tarjeta en /proyectos y la página de detalle en /proyectos/:slug
//      se generan automáticamente a partir de este array.
//
// Campos opcionales:
//   - tag, gallery, typologies, minHouseSize, minApartmentSize, amenities.
//   - `gallery` es opcional a nivel de tipo, pero TODOS los proyectos la
//     definen para mostrar las pestañas Renders / Planimetría / Avance de
//     obra en el detalle. Si un proyecto aún no tiene fotos reales de
//     avance de obra, usa PLACEHOLDER_AVANCE_IMAGE como valor temporal
//     (ver debajo).
//   - `typologies` solo es necesaria si el proyecto tiene modelos de
//     vivienda con plano y/o características propias que mostrar.
//
// Campo obligatorio `areas360`:
//   - TODO proyecto debe tener UN ÚNICO recorrido 360° caminable (no uno por
//     tipología): una lista de ambientes conectados por hotspots en las
//     puertas, para alimentar el visor nativo Three.js (Panorama360Viewer,
//     ver src/components/ui/Panorama360Viewer.tsx).
//   - Mientras un proyecto no tenga sus fotos 360 reales por ambiente, usa
//     buildAreas360() definida abajo — así TypeScript sigue exigiendo el
//     campo en cada objeto, pero no bloquea el desarrollo por falta de
//     material fotográfico real.
// ============================================================================

// Placeholder para la pestaña "Avance de obra" de la galería categorizada,
// usado en los proyectos que aún no tienen fotos reales de avance físico de
// obra. Reemplazar por las fotos reales del proyecto en cuanto estén
// disponibles.
const PLACEHOLDER_AVANCE_IMAGE = 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=1200&q=80'

// Placeholder para proyectos nuevos que todavía no tienen sus fotos/renders
// reales subidos a public/images. Reemplazar images/thumbnail/gallery por los
// archivos reales en cuanto lleguen, y quitar `hidden` para publicarlo.
const PLACEHOLDER_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80'

// Placeholders del recorrido 360° caminable, uno por ambiente. Deben ser
// visualmente distintos entre sí para que "caminar" de un ambiente a otro se
// note (una foto real por ambiente, exportada de D5, es lo que va aquí
// cuando esté disponible — de momento se reutilizan 3 fotos de interiores
// genéricas para dar la sensación de recorrido).
const PLACEHOLDER_AREA_SALA = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=2000&h=1000&fit=crop&q=80'
const PLACEHOLDER_AREA_COCINA = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&h=1000&fit=crop&q=80'
const PLACEHOLDER_AREA_DORMITORIO = 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=2000&h=1000&fit=crop&q=80'

// Recorrido 360° caminable de ejemplo (UN solo recorrido por proyecto):
// Sala → Cocina → Dormitorio, conectados por hotspots ubicados en las puertas
// de cada ambiente. La puerta "hacia adelante" se coloca a poca distancia del
// centro (yaw bajo) para que sea visible apenas se entra al ambiente, sin
// tener que arrastrar demasiado; la puerta "de regreso" queda detrás
// (yaw 180°), como en un recorrido real. Reemplazar cada `imagen360Url` por
// el export real de D5 cuando esté listo (los `id` de cada área deben
// mantenerse para no romper los hotspots).
function buildAreas360(): PanoramaArea[] {
  return [
    {
      id: 'sala',
      name: 'Sala principal',
      imagen360Url: PLACEHOLDER_AREA_SALA,
      hotspots: [
        { targetAreaId: 'cocina', label: 'Ir a la cocina', yaw: 25, pitch: -10 },
      ],
    },
    {
      id: 'cocina',
      name: 'Cocina',
      imagen360Url: PLACEHOLDER_AREA_COCINA,
      hotspots: [
        { targetAreaId: 'sala', label: 'Volver a la sala', yaw: 180, pitch: -10 },
        { targetAreaId: 'dormitorio', label: 'Ir al dormitorio principal', yaw: 25, pitch: -10 },
      ],
    },
    {
      id: 'dormitorio',
      name: 'Dormitorio principal',
      imagen360Url: PLACEHOLDER_AREA_DORMITORIO,
      hotspots: [
        { targetAreaId: 'cocina', label: 'Volver a la cocina', yaw: 180, pitch: -10 },
      ],
    },
  ]
}

export const projects: Project[] = [
  {
    // ---------------------------------------------------
    // 1. INFORMACIÓN BÁSICA
    // ---------------------------------------------------
    id: '1',
    name: 'Florencia Residencial',
    slug: 'florencia',
    location: 'Cerro Colorado · Arequipa',
    district: 'Cerro Colorado',
    city: 'Arequipa',
    tag: 'Disponible',
    status: 'disponible',
    type: ['casas', 'departamentos'],
    zone: 'ciudad',
    // Imágenes principales que se ven en la tarjeta de presentación
    images: [
      asset('images/proyectos/florencia/FOTO-FLORENCIA-PRINCIPAL-scaled.webp'),
    ],
    thumbnail: asset('images/proyectos/florencia/FOTO-FLORENCIA-PRINCIPAL-scaled-thumb.webp'),
    coordinates: { lat: -16.3705107, lng: -71.5575201 },
    logo: 'logos/proyectos/florencia.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente

    // ---------------------------------------------------
    // 2. DESCRIPCIÓN Y ÁREAS
    // ---------------------------------------------------
    minHouseSize: 103,
    minApartmentSize: 54,
    features: ['Casas desde 103 m²', 'Departamentos desde 54 m²', 'Servicios completos'],
    description: 'Florencia Residencial es un proyecto diseñado para familias que buscan calidad y confort en una de las zonas de mayor crecimiento de Arequipa. Con amplias áreas verdes y acabados de primera, es la opción ideal para tu hogar.',
    amenities: ['Áreas verdes', 'Seguridad 24h', 'Estacionamiento', 'Sala comunal'],

    // Galería categorizada: aparece en pestañas (Renders / Planimetría / Avance) en la vista de detalle
    gallery: {
      renders: [
        asset('images/proyectos/florencia/FOTO-FLORENCIA-PRINCIPAL-scaled.webp'),
        asset('images/proyectos/florencia/GALERIA-1.webp'),
        asset('images/proyectos/florencia/GALERIA-2.webp'),
        asset('images/proyectos/florencia/GALERIA-3.webp'),
        asset('images/proyectos/florencia/GALERIA-4.webp'),
        asset('images/proyectos/florencia/GALERIA-6.webp'),
      ],
      planimetria: [asset('images/proyectos/florencia/PLANIMETRIA.webp')],
      // Fotos reales de avance de obra (no renders), tomadas en la propia
      // construcción — vienen numeradas por vivienda/etapa en el servidor.
      avance: [
        asset('images/proyectos/florencia/AVANCE-1-PRIMERA.webp'),
        asset('images/proyectos/florencia/AVANCE-2-SEGUNDA.webp'),
        asset('images/proyectos/florencia/AVANCE-3-TERCERA.webp'),
        asset('images/proyectos/florencia/AVANCE-4-CUARTA.webp'),
        asset('images/proyectos/florencia/AVANCE-5-QUINTA.webp'),
        asset('images/proyectos/florencia/AVANCE-6-SEXTA.webp'),
      ],
    },

    // ---------------------------------------------------
    // 4. TIPOLOGÍAS
    // ---------------------------------------------------
    typologies: [
      {
        name: 'Casa — 103 m²',
        area: 103,
        bedrooms: 3,
        bathrooms: 3,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Distribuida en 3 niveles', 'Estudio independiente', 'Patio interior', 'Garaje'],
      },
      {
        name: 'Departamento — 104 m²',
        area: 104,
        bedrooms: 3,
        bathrooms: 3,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Balcón', '3 dormitorios', 'Cocina abierta'],
      },
      {
        name: 'Departamento — 57 m²',
        area: 57,
        bedrooms: 1,
        bathrooms: 1,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Balcón', 'Cocina americana', 'Lavandería'],
      },
      {
        name: 'Departamento — 54 m²',
        area: 54,
        bedrooms: 1,
        bathrooms: 1,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Balcón', 'Cocina americana', 'Lavandería'],
      },
    ],
  },
  {
    id: '2',
    name: 'Residencias Monserrat',
    slug: 'monserrat',
    location: 'Cercado · Arequipa',
    district: 'Cercado',
    city: 'Arequipa',
    status: 'disponible',
    type: ['casas', 'departamentos'],
    zone: 'ciudad',
    images: [
      asset('images/proyectos/monserrat/FOTO-MONTSERRAT-PRINCIPAL-scaled.webp'),
    ],
    thumbnail: asset('images/proyectos/monserrat/FOTO-MONTSERRAT-PRINCIPAL-scaled-thumb.webp'),
    coordinates: { lat: -16.427353, lng: -71.557948 },
    logo: 'logos/proyectos/monserrat.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 142,
    minApartmentSize: 115,
    features: ['Casas desde 142 m²', 'Departamentos desde 115 m²', 'Servicios completos'],
    description: 'Residencias Monserrat combina diseño contemporáneo con ubicación privilegiada en el Cercado de Arequipa. Perfecta para quienes buscan vivir cerca de los principales centros comerciales, educativos y de salud.',
    amenities: ['Áreas verdes', 'Seguridad 24h', 'Estacionamiento', 'Gimnasio'],
    gallery: {
      renders: [
        asset('images/proyectos/monserrat/FOTO-MONTSERRAT-PRINCIPAL-scaled.webp'),
        asset('images/proyectos/monserrat/GALERIA-3.webp'),
        asset('images/proyectos/monserrat/GALERIA-4.webp'),
        asset('images/proyectos/monserrat/GALERIA-5.webp'),
        asset('images/proyectos/monserrat/GALERIA-6.webp'),
        asset('images/proyectos/monserrat/MONSE-1.webp'),
        asset('images/proyectos/monserrat/MONSE-2.webp'),
        asset('images/proyectos/monserrat/MONSE-3.webp'),
      ],
      planimetria: [asset('images/proyectos/monserrat/PLANIMETRIA.webp')],
      // Fotos reales de avance de obra (no renders), tomadas en la propia construcción.
      avance: [
        asset('images/proyectos/monserrat/AVANCE-FOTO-1-FB.webp'),
        asset('images/proyectos/monserrat/AVANCE-FOTO-2-FB.webp'),
        asset('images/proyectos/monserrat/AVANCE-FOTO-3-FB.webp'),
      ],
    },
    typologies: [
      {
        name: 'Casa — 142 m²',
        area: 142,
        bedrooms: 4,
        bathrooms: 3,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Estudio independiente', 'Terraza', 'Cochera doble'],
      },
      {
        name: 'Departamento — 115 m² (Torre A y B)',
        area: 115,
        bedrooms: 3,
        bathrooms: 3,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Balcón', 'Zona de expansión', '3 baños privados'],
      },
      {
        name: 'Departamento — 128 m² (Torre C)',
        area: 128,
        bedrooms: 3,
        bathrooms: 3,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Balcón', 'Zona de expansión', '3 baños privados'],
      },
    ],
  },
  {
    id: '3',
    name: 'Condes Residencial',
    slug: 'condes',
    // Oculto a pedido: ya no aparece en condescorporacion.com. Se conservan
    // todos sus datos por si se retoma más adelante — para volver a
    // publicarlo, borra esta línea (o ponla en `false`).
    hidden: true,
    location: 'Cerro Colorado · Arequipa',
    district: 'Cerro Colorado',
    city: 'Arequipa',
    tag: 'Premium',
    status: 'disponible',
    type: ['casas', 'departamentos'],
    zone: 'ciudad',
    images: [
      asset('images/proyectos/condes-residencial/FOTO-CONDES-R-PRINCIPAL-scaled.webp'),
    ],
    thumbnail: asset('images/proyectos/condes-residencial/FOTO-CONDES-R-PRINCIPAL-scaled-thumb.webp'),
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 187,
    minApartmentSize: 131,
    features: ['Casas desde 187 m²', 'Departamentos desde 131 m²', 'Servicios completos'],
    description: 'Nuestro proyecto insignia. Condes Residencial eleva los estándares de vida en Arequipa con amplios ambientes, acabados premium y una ubicación inmejorable. El lujo que mereces a un precio accesible.',
    amenities: ['Áreas verdes', 'Seguridad 24h', 'Estacionamiento doble', 'Piscina', 'Salón de eventos'],

    // ---------------------------------------------------
    // 3. MULTIMEDIA (FOTOS Y RENDERS)
    // ---------------------------------------------------
    // Galería categorizada: aparece en pestañas (Renders / Planimetría / Avance) en la vista de detalle
    gallery: {
      renders: [
        asset('images/proyectos/condes-residencial/FOTO-CONDES-R-PRINCIPAL-scaled.webp'),
      ],
      planimetria: [asset('images/proyectos/condes-residencial/PLANIMETRIA.webp')],
      avance: [PLACEHOLDER_AVANCE_IMAGE],            // Pendiente: reemplazar por fotos reales de avance de obra
    },

    // ---------------------------------------------------
    // 4. TIPOLOGÍAS
    // ---------------------------------------------------
    // Cada tipología es un modelo de vivienda con su propio plano y
    // características. El recorrido 360° NO es por tipología: hay un único
    // recorrido caminable por proyecto (`areas360`, más arriba) que aplica
    // independientemente de cuántas tipologías tenga.
    typologies: [
      {
        name: 'Tipología A — 3 dormitorios',
        area: 187,
        bedrooms: 3,
        bathrooms: 2,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Cocina abierta integrada', 'Walk-in closet en dormitorio principal', 'Balcón con vista', 'Piso porcelanato'],
      },
      {
        name: 'Tipología B — 2 dormitorios',
        area: 131,
        bedrooms: 2,
        bathrooms: 2,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Cocina semi-abierta', 'Terraza privada', 'Piso laminado'],
      },
    ],
  },
  {
    id: '4',
    name: 'Jardines del Sol Residencial',
    slug: 'jardines-del-sol',
    location: 'Yanahuara · Arequipa',
    district: 'Yanahuara',
    city: 'Arequipa',
    status: 'disponible',
    type: ['casas', 'departamentos'],
    zone: 'ciudad',
    images: [
      asset('images/proyectos/jardines-del-sol/FOTO-JARDINES-S-PRINCIPAL-scaled.webp'),
    ],
    thumbnail: asset('images/proyectos/jardines-del-sol/FOTO-JARDINES-S-PRINCIPAL-scaled-thumb.webp'),
    coordinates: { lat: -16.3923813, lng: -71.5451651 },
    logo: 'logos/proyectos/jardines-del-sol.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 369,
    minApartmentSize: 115,
    features: ['Casas desde 369 m²', 'Departamentos desde 115 m²', 'Servicios completos'],
    description: 'Ubicado en el exclusivo distrito de Yanahuara, Jardines del Sol te ofrece un entorno tranquilo con vistas privilegiadas al volcán Misti y acceso rápido al centro histórico de Arequipa.',
    amenities: ['Jardines privados', 'Seguridad 24h', 'Estacionamiento', 'Zona de juegos'],
    gallery: {
      renders: [
        asset('images/proyectos/jardines-del-sol/FOTO-JARDINES-S-PRINCIPAL-scaled.webp'),
        asset('images/proyectos/jardines-del-sol/MESA-DE-TRABAJO-3.webp'),
        asset('images/proyectos/jardines-del-sol/MESA-DE-TRABAJO-4.webp'),
        asset('images/proyectos/jardines-del-sol/MESA-DE-TRABAJO-5.webp'),
        asset('images/proyectos/jardines-del-sol/MESA-DE-TRABAJO-7.webp'),
        asset('images/proyectos/jardines-del-sol/MESA-DE-TRABAJO-8.webp'),
      ],
      planimetria: [asset('images/proyectos/jardines-del-sol/PLANIMETRIA.webp')],
      avance: [PLACEHOLDER_AVANCE_IMAGE],            // Pendiente: reemplazar por fotos reales de avance de obra
    },
    typologies: [
      {
        name: 'Departamento — 115 m²',
        area: 115,
        bedrooms: 2,
        bathrooms: 3,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Balcón con vista', 'Cocina abierta', 'Lavandería'],
      },
      {
        name: 'Departamento — 129 m²',
        area: 129,
        bedrooms: 3,
        bathrooms: 3,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Balcón con vista', 'Cocina abierta', 'Lavandería'],
      },
      {
        name: 'Triplex — 334 m²',
        area: 334,
        bedrooms: 3,
        bathrooms: 4,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Distribuido en 3 niveles + sótano', 'Cochera', 'Elevador'],
      },
      {
        name: 'Casa — 369 m²',
        area: 369,
        bedrooms: 3,
        bathrooms: 4,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Distribuida en 3 niveles', 'Cochera doble', 'Elevador'],
      },
      {
        name: 'Casa — 479 m²',
        area: 479,
        bedrooms: 5,
        bathrooms: 4,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Distribuida en 3 niveles', 'Cochera doble', 'Elevador'],
      },
    ],
  },
  {
    id: '5',
    name: 'Residencial Parque Central',
    slug: 'parquecentral',
    // Oculto: proyecto pausado. Se conservan todos sus datos por si se
    // retoma más adelante — para volver a publicarlo, borra esta línea
    // (o ponla en `false`).
    hidden: true,
    location: 'Cercado · Arequipa',
    district: 'Cercado',
    city: 'Arequipa',
    tag: 'Nuevo',
    status: 'preventa',
    type: ['casas', 'departamentos'],
    zone: 'ciudad',
    images: [
      asset('images/proyectos/parquecentral/PARQUE-CENTRAL-EDIFICIO.webp'),
    ],
    thumbnail: asset('images/proyectos/parquecentral/PARQUE-CENTRAL-EDIFICIO-thumb.webp'),
    logo: 'logos/proyectos/parquecentral.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 113,
    minApartmentSize: 82,
    features: ['Casas desde 113 m²', 'Departamentos desde 82.39 m²', 'Servicios completos'],
    description: 'Residencial Parque Central es nuestra propuesta más reciente en el Cercado. Con una arquitectura moderna y funcional, este proyecto está pensado para quienes valoran la conectividad y la vida urbana.',
    amenities: ['Terraza comunal', 'Seguridad 24h', 'Estacionamiento', 'Sala de coworking'],
    gallery: {
      renders: [
        asset('images/proyectos/parquecentral/PARQUE-CENTRAL-EDIFICIO.webp'),
      ],
      planimetria: [asset('images/proyectos/parquecentral/PLANIMETRIA.webp')],
      avance: [PLACEHOLDER_AVANCE_IMAGE],            // Pendiente: reemplazar por fotos reales de avance de obra
    },
    typologies: [
      {
        name: 'Casa — 113 m²',
        area: 113,
        bedrooms: 3,
        bathrooms: 2,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Cocina abierta', 'Terraza comunal cercana', 'Cochera'],
      },
      {
        name: 'Departamento — 82 m²',
        area: 82,
        bedrooms: 2,
        bathrooms: 2,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Balcón', 'Sala de coworking cercana', 'Depósito'],
      },
    ],
  },
  {
    id: '6',
    name: 'Costa Real Residencial',
    slug: 'costa-real',
    location: 'Mollendo · Arequipa',
    district: 'Mollendo',
    city: 'Arequipa',
    tag: 'Playa',
    status: 'disponible',
    type: ['casas'],
    zone: 'playa',
    images: [
      asset('images/proyectos/costa-real/FOTO-COSTA-REAL-PRINCIPAL.webp'),
    ],
    thumbnail: asset('images/proyectos/costa-real/FOTO-COSTA-REAL-PRINCIPAL-thumb.webp'),
    coordinates: { lat: -17.0296153, lng: -72.0122546 },
    logo: 'logos/proyectos/costa-real.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 110,
    features: ['Casas desde 110 m²', 'Frente a playa', 'Servicios completos'],
    description: 'A solo metros de la playa de Mollendo, Costa Real Residencial es tu segunda vivienda ideal. Disfruta del mar, el sol y la tranquilidad con la misma calidad y respaldo legal de todos nuestros proyectos.',
    amenities: ['Piscina propia', 'Acceso directo a playa', 'Estacionamiento', 'Área de parrillas', 'Financiamiento directo hasta 12 meses'],
    gallery: {
      renders: [
        asset('images/proyectos/costa-real/FOTO-COSTA-REAL-PRINCIPAL.webp'),
        asset('images/proyectos/costa-real/GALERIA-1.webp'),
        asset('images/proyectos/costa-real/GALERIA-2.webp'),
        asset('images/proyectos/costa-real/GALERIA-3.webp'),
        asset('images/proyectos/costa-real/GALERIA-4.webp'),
        asset('images/proyectos/costa-real/GALERIA-5.webp'),
      ],
      planimetria: [asset('images/proyectos/costa-real/PLANIMETRIA.webp')],
      avance: [PLACEHOLDER_AVANCE_IMAGE],            // Pendiente: reemplazar por fotos reales de avance de obra
    },
    typologies: [
      {
        name: 'Casa de playa — 110 m²',
        area: 110,
        bedrooms: 3,
        bathrooms: 3,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Piscina privada', 'Zona de parrillas', 'Doble cochera'],
      },
      {
        name: 'Casa de playa — 256 m² (vista al mar)',
        area: 256,
        bedrooms: 4,
        bathrooms: 5,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Vista al mar', 'Triple cochera', 'Piscina interior'],
      },
    ],
  },
  {
    id: '7',
    name: 'Torre Mónaco',
    slug: 'monaco',
    location: 'J.L.B. y R. · Arequipa',
    district: 'José Luis Bustamante y Rivero',
    city: 'Arequipa',
    tag: 'Nuevo',
    status: 'preventa',
    // Proyecto mixto (departamentos + espacios comerciales); el sistema de
    // filtros solo distingue casas/departamentos, así que se clasifica como
    // "departamentos" y el detalle comercial queda en features/tipologías.
    type: ['departamentos'],
    zone: 'ciudad',
    images: [
      asset('images/proyectos/monaco/RENDER-PRINCIPAL.webp'),
    ],
    thumbnail: asset('images/proyectos/monaco/RENDER-PRINCIPAL-thumb.webp'),
    coordinates: { lat: -16.414104, lng: -71.519797 },
    logo: 'logos/proyectos/monaco.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minApartmentSize: 103,
    features: ['Departamentos desde 103.24 m²', 'Espacios comerciales desde 52.98 m²', 'Penthouse desde 114.38 m²'],
    description: 'Torre Mónaco combina arquitectura moderna, ambientes funcionales y detalles que priorizan el confort y la seguridad, sobre la Av. Lambramani en José Luis Bustamante y Rivero — una ubicación estratégica con conexiones subterráneas y acabados de calidad.',
    amenities: ['Ubicación estratégica', 'Estacionamiento techado', 'Seguridad 24h', 'Conexiones subterráneas', 'Documentación certificada'],
    gallery: {
      renders: [
        asset('images/proyectos/monaco/RENDER-PRINCIPAL.webp'),
        asset('images/proyectos/monaco/ESCENA-16.webp'),
        asset('images/proyectos/monaco/RENDER-TIPO-3-ESCENA-10.webp'),
        asset('images/proyectos/monaco/RENDER-TIPO-3-ESCENA-11.webp'),
        asset('images/proyectos/monaco/TIPO2-SALA.webp'),
        asset('images/proyectos/monaco/TIPO2-TERRAZA-1.webp'),
        asset('images/proyectos/monaco/TIPO2-TERRAZA-3.webp'),
        asset('images/proyectos/monaco/VIVIENDA-TIPO-3.webp'),
        asset('images/proyectos/monaco/TERRAZA.webp'),
      ],
      planimetria: [asset('images/proyectos/monaco/PLANIMETRIA.webp')],
      avance: [PLACEHOLDER_AVANCE_IMAGE], // Pendiente: reemplazar por fotos reales de avance de obra
    },
    typologies: [
      {
        name: 'Departamento — 103 m²',
        area: 103,
        bedrooms: 2,
        bathrooms: 3,
        planImage: asset('images/proyectos/monaco/PLANIMETRIA.webp'),
        features: ['Terraza', 'Acabados de calidad', 'Estacionamiento techado'],
      },
      {
        name: 'Espacio comercial — 53 m²',
        area: 53,
        bathrooms: 2,
        planImage: asset('images/proyectos/monaco/PLANIMETRIA.webp'),
        features: ['Frente a Av. Lambramani', 'Ideal para negocio', 'Acceso independiente'],
      },
      {
        name: 'Penthouse — 114 m²',
        area: 114,
        bedrooms: 2,
        bathrooms: 3,
        planImage: asset('images/proyectos/monaco/PLANIMETRIA.webp'),
        features: ['Balcones', 'Último nivel', 'Vista panorámica'],
      },
    ],
  },
  {
    id: '8',
    name: 'Residencias Santa María',
    slug: 'santa-maria',
    location: 'Mejía · Arequipa',
    district: 'Mejía',
    city: 'Arequipa',
    tag: 'Nuevo',
    status: 'preventa',
    // Proyecto de casas y lotes de playa; el sistema de filtros solo distingue
    // casas/departamentos, así que se clasifica como "casas".
    type: ['casas'],
    zone: 'playa',
    images: [
      asset('images/proyectos/santa-maria/FOTO-09-1.webp'),
    ],
    thumbnail: asset('images/proyectos/santa-maria/FOTO-09-1-thumb.webp'),
    coordinates: { lat: -17.0518125, lng: -71.9680625 },
    logo: 'logos/proyectos/santa-maria.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 173,
    features: ['Casas desde 173 m²', 'Lotes desde 226 m²', 'Frente a playa'],
    description: 'Residencias Santa María es nuestro nuevo proyecto frente al mar en Mejía, a pocos minutos de la plaza principal. Pensado para despertar frente al océano, combina casas y lotes de playa con áreas comunes completas: club house, piscinas recreativas, canchas deportivas y amplias zonas verdes.',
    amenities: ['Club house', 'Dos piscinas recreativas', 'Canchas deportivas', 'Plazas y jardines', 'Conexiones subterráneas', 'Pet-friendly', 'Seguridad 24h'],
    gallery: {
      renders: [
        asset('images/proyectos/santa-maria/FOTO-09-1.webp'),
        asset('images/proyectos/santa-maria/FOTO-08.webp'),
        asset('images/proyectos/santa-maria/FOTO-04.webp'),
        asset('images/proyectos/santa-maria/FOTO-01.webp'),
        asset('images/proyectos/santa-maria/MED-04.webp'),
        asset('images/proyectos/santa-maria/MED-08.webp'),
        asset('images/proyectos/santa-maria/FOTO-03.webp'),
        asset('images/proyectos/santa-maria/FOTO-04-1.webp'),
      ],
      planimetria: [asset('images/proyectos/santa-maria/PLANIMETRIA.webp')],
      avance: [PLACEHOLDER_AVANCE_IMAGE], // Pendiente: reemplazar por fotos reales de avance de obra
    },
    typologies: [
      {
        name: 'Casa de playa — 173 m²',
        area: 173,
        bedrooms: 5,
        bathrooms: 5,
        planImage: asset('images/proyectos/santa-maria/PLANIMETRIA.webp'),
        features: ['Piscina privada', 'Doble altura', 'Ducha desarenador'],
      },
      {
        name: 'Casa de playa — 200 m²',
        area: 200,
        bedrooms: 6,
        bathrooms: 6,
        planImage: asset('images/proyectos/santa-maria/PLANIMETRIA.webp'),
        features: ['Piscina privada', '4 cocheras', 'Ducha desarenador'],
      },
      {
        name: 'Casa de playa — 248 m²',
        area: 248,
        bedrooms: 6,
        bathrooms: 6,
        planImage: asset('images/proyectos/santa-maria/PLANIMETRIA.webp'),
        features: ['Piscina privada', '4 cocheras', 'Ducha desarenador'],
      },
      {
        name: 'Lote — 226 m²',
        area: 226,
        planImage: asset('images/proyectos/santa-maria/PLANIMETRIA.webp'),
        features: ['Terreno independiente', 'Conexiones subterráneas', 'Zona de club house cercana'],
      },
    ],
  },
  {
    id: '9',
    name: 'Edificio Los Cedros',
    slug: 'los-cedros',
    // Oculto: todavía no tiene fotos/renders reales (pendiente de recibirlas).
    // Quitar esta línea para publicarlo en cuanto se reemplacen los
    // placeholders de `images`/`thumbnail`/`gallery` por los archivos reales.
    hidden: true,
    location: 'Yanahuara · Arequipa',
    district: 'Yanahuara',
    city: 'Arequipa',
    tag: 'Nuevo',
    status: 'preventa',
    type: ['departamentos'],
    zone: 'ciudad',
    images: [PLACEHOLDER_PROJECT_IMAGE],
    thumbnail: PLACEHOLDER_PROJECT_IMAGE,
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minApartmentSize: 52,
    features: ['Departamentos desde 52 m²', 'Frente al parque Los Cedros', 'Servicios completos'],
    description: 'Edificio Los Cedros está ubicado en la Urb. Los Cedros D-4, al frente del parque Los Cedros, en Yanahuara — a minutos de Mall Plaza Cayma, Real Plaza y el Parque del Avión. Departamentos de un dormitorio pensados para un estilo de vida dinámico, con cocheras, ascensor y zona social en la azotea.',
    amenities: ['Cocheras', 'Conexiones subterráneas', 'Ascensor', 'Frente al parque', 'Sismorresistente', 'Seguridad 24/7'],
    gallery: {
      renders: [PLACEHOLDER_PROJECT_IMAGE],
      planimetria: [PLACEHOLDER_PROJECT_IMAGE],
      avance: [PLACEHOLDER_AVANCE_IMAGE],
    },
    typologies: [
      {
        name: 'Departamento Tipo 1 — 77 m²',
        area: 77,
        bedrooms: 1,
        bathrooms: 1,
        planImage: PLACEHOLDER_PROJECT_IMAGE,
        features: ['Sala-comedor', 'Cocina', 'Lavandería'],
      },
      {
        name: 'Departamento Tipo 2 — 104.5 m²',
        area: 105,
        bedrooms: 2,
        bathrooms: 3,
        planImage: PLACEHOLDER_PROJECT_IMAGE,
        features: ['Cochera', 'Sala-comedor', 'Lavandería'],
      },
      {
        name: 'Departamento Tipo 3 — 52 m²',
        area: 52,
        bedrooms: 1,
        bathrooms: 1,
        planImage: PLACEHOLDER_PROJECT_IMAGE,
        features: ['Sala-comedor', 'Cocina', 'Lavandería'],
      },
      {
        name: 'Departamento Tipo 4 — 54 m²',
        area: 54,
        bedrooms: 1,
        bathrooms: 1,
        planImage: PLACEHOLDER_PROJECT_IMAGE,
        features: ['Sala-comedor', 'Cocina', 'Lavandería'],
      },
    ],
  },
  {
    id: '10',
    name: 'Marín 402',
    slug: 'marin-402',
    // Oculto: todavía no tiene fotos/renders reales (pendiente de recibirlas).
    // Quitar esta línea para publicarlo en cuanto se reemplacen los
    // placeholders de `images`/`thumbnail`/`gallery` por los archivos reales.
    hidden: true,
    location: 'Yanahuara · Arequipa',
    district: 'Yanahuara',
    city: 'Arequipa',
    tag: 'Nuevo',
    status: 'preventa',
    type: ['departamentos'],
    zone: 'ciudad',
    images: [PLACEHOLDER_PROJECT_IMAGE],
    thumbnail: PLACEHOLDER_PROJECT_IMAGE,
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minApartmentSize: 120,
    features: ['Departamentos desde 119.66 m²', 'A una cuadra del Mall Plaza Cayma', 'Áreas comerciales'],
    description: 'Marín 402 está ubicado en Tronchadero 402, Yanahuara, a solo 1 minuto de la Av. Ejército y el Mall Plaza Cayma. Departamentos de 3 dormitorios con amplitud y conexión inmediata a bancos, supermercados, centros comerciales y restaurantes.',
    amenities: ['Ingreso vehicular', 'Áreas comerciales', 'Cerca a bancos y supermercados', 'Cerca a clínicas'],
    gallery: {
      renders: [PLACEHOLDER_PROJECT_IMAGE],
      planimetria: [PLACEHOLDER_PROJECT_IMAGE],
      avance: [PLACEHOLDER_AVANCE_IMAGE],
    },
    typologies: [
      {
        name: 'Departamento 201 — 153.5 m²',
        area: 154,
        bedrooms: 3,
        bathrooms: 3,
        planImage: PLACEHOLDER_PROJECT_IMAGE,
        features: ['Sala', 'Comedor', 'Cocina', 'Patio', 'Balcón'],
      },
      {
        name: 'Departamento 202 — 179.6 m²',
        area: 180,
        bedrooms: 3,
        bathrooms: 3,
        planImage: PLACEHOLDER_PROJECT_IMAGE,
        features: ['Sala', 'Comedor', 'Cocina', 'Patio', 'Balcón'],
      },
      {
        name: 'Departamento Tipología 1 — 120 m²',
        area: 120,
        bedrooms: 3,
        bathrooms: 3,
        planImage: PLACEHOLDER_PROJECT_IMAGE,
        features: ['Sala', 'Comedor', 'Cocina', 'Lavandería', 'Balcón'],
      },
      {
        name: 'Departamento Tipología 2 — 133 m²',
        area: 133,
        bedrooms: 3,
        bathrooms: 3,
        planImage: PLACEHOLDER_PROJECT_IMAGE,
        features: ['Sala', 'Comedor', 'Cocina', 'Lavandería', 'Balcón'],
      },
    ],
  },
]

// Vista pública de `projects`: excluye los marcados como `hidden`. Úsala en
// vez de `projects` en cualquier página/componente que liste o busque
// proyectos para mostrar al usuario (Home, /proyectos, ProjectDetail).
export const visibleProjects: Project[] = projects.filter((p) => !p.hidden)

// Banner formal para promociones o novedades de temporada, mostrado en el
// Home antes de la sección de equipo. Edita estos 4 campos cuando cambie la
// promoción vigente; si no hay ninguna activa, deja `title` con un mensaje
// institucional genérico (no se recomienda quitar la sección por completo,
// ya que sostiene el ritmo visual de la página).
export const seasonalBanner = {
  tag: 'Promoción vigente',
  title: 'Conoce las condiciones especiales de financiamiento disponibles este mes.',
  cta: 'Más información',
  href: '/contacto',
}

// Carrusel del hero de Inicio: renders principales de varios proyectos en
// venta. Actualizar esta lista si se agrega/retira un proyecto destacado.
export const heroImages: string[] = [
  asset('images/proyectos/florencia/FOTO-FLORENCIA-PRINCIPAL-scaled.webp'),
  asset('images/proyectos/monaco/RENDER-PRINCIPAL.webp'),
  asset('images/proyectos/monserrat/FOTO-MONTSERRAT-PRINCIPAL-scaled.webp'),
  asset('images/proyectos/costa-real/FOTO-COSTA-REAL-PRINCIPAL.webp'),
  asset('images/proyectos/jardines-del-sol/FOTO-JARDINES-S-PRINCIPAL-scaled.webp'),
]

export const teamImages: string[] = [
  asset('images/equipo/Arquitectura-1.webp'),
  asset('images/equipo/Legal.webp'),
  asset('images/equipo/Maqueteria.webp'),
  asset('images/equipo/Contabilidad.webp'),
  asset('images/equipo/Arquitectura-2.webp'),
]

// Oficinas de atención (sección "Visítanos en nuestras oficinas" del detalle
// de cada proyecto). La primera es la oficina central; el resto, sucursales.
export const OFFICES = [
  {
    kind: 'Oficina central',
    district: 'Cercado, Arequipa',
    address: 'Calle Parque Las Condes 123.',
    reference: 'Paralela a la Av. Independencia cuadra 9.',
  },
  {
    kind: 'Sucursal',
    district: 'José Luis Bustamante y Rivero, Arequipa',
    address: 'Auxiliar Lambramani.',
    reference: 'Al frente de Opera Cafetería.',
  },
  {
    kind: 'Sucursal',
    district: 'Cerro Colorado, Arequipa',
    address: 'Av. Villa Hermosa 520.',
    reference: 'Al costado de Toyota Mitsui Automotriz.',
  },
  {
    kind: 'Sucursal',
    district: 'Cercado, Arequipa',
    address: 'Av. Alfonso Ugarte 512.',
    reference: 'Al frente de Grupo Gloria.',
  },
]

export const OFFICE_HOURS = [
  { days: 'De lunes a viernes', hours: '9:00 a.m. a 6:00 p.m.' },
  { days: 'Sábados', hours: '9:00 a.m. a 1:00 p.m.' },
]

export const CONTACT = {
  email: 'callcenter@condescorporacion.com',
  phone: '+51 958 295 181',
  address: 'C. Parque Las Condes 123, Arequipa',
  sales: 'Auxiliar Lambramani',
  // Qué busca el mapa del footer. Buscar la dirección como texto hace que
  // Google ubique el pin unas cuadras corrido; el nombre del negocio cae en su
  // ficha de Maps. Lo más preciso es poner aquí "lat,lng" del local.
  mapQuery: 'Condes Corporación, Arequipa, Perú',
  instagram: 'https://www.instagram.com/condes_corp',
  facebook: 'https://www.facebook.com/share/17gaUMEzSG/',
  tiktok: 'https://www.tiktok.com/@condes.corporacion',
  whatsapp: 'https://wa.me/51958295181',
}
