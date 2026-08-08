import type { Project, NavLink, PanoramaArea } from '../types'

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
      'https://condescorporacion.com/wp-content/uploads/2025/12/FOTO-FLORENCIA-PRINCIPAL-scaled.png',
    ],
    logo: 'logos/proyectos/florencia.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente

    // ---------------------------------------------------
    // 2. DESCRIPCIÓN Y ÁREAS
    // ---------------------------------------------------
    minHouseSize: 102,
    minApartmentSize: 54,
    features: ['Casas desde 102 m²', 'Departamentos desde 54 m²', 'Servicios completos'],
    description: 'Florencia Residencial es un proyecto diseñado para familias que buscan calidad y confort en una de las zonas de mayor crecimiento de Arequipa. Con amplias áreas verdes y acabados de primera, es la opción ideal para tu hogar.',
    amenities: ['Áreas verdes', 'Seguridad 24h', 'Estacionamiento', 'Sala comunal'],

    // Galería categorizada: aparece en pestañas (Renders / Planimetría / Avance) en la vista de detalle
    gallery: {
      renders: [
        'https://condescorporacion.com/wp-content/uploads/2025/12/FOTO-FLORENCIA-PRINCIPAL-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-1-_FLORENCIA-_-GALERIA-1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-2-_FLORENCIA-_-GALERIA-1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-3-_FLORENCIA-_-GALERIA-1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-4-_FLORENCIA-_-GALERIA-1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-6-_FLORENCIA-_-GALERIA-1-scaled.png',
      ],
      planimetria: ['https://condescorporacion.com/wp-content/uploads/2026/01/PLANIMETRIA-FLORENCIA-02.png'],
      // Fotos reales de avance de obra (no renders), tomadas en la propia
      // construcción — vienen numeradas por vivienda/etapa en el servidor.
      avance: [
        'https://condescorporacion.com/wp-content/uploads/2026/06/1-PRIMERA.png',
        'https://condescorporacion.com/wp-content/uploads/2026/06/2-SEGUNDA.png',
        'https://condescorporacion.com/wp-content/uploads/2026/06/3-TERCERA.png',
        'https://condescorporacion.com/wp-content/uploads/2026/06/4-CUARTA.png',
        'https://condescorporacion.com/wp-content/uploads/2026/06/5-QUINTA.png',
        'https://condescorporacion.com/wp-content/uploads/2026/06/6-SEXTA.png',
      ],
    },

    // ---------------------------------------------------
    // 4. TIPOLOGÍAS
    // ---------------------------------------------------
    typologies: [
      {
        name: 'Casa — 102 m²',
        area: 102,
        bedrooms: 3,
        bathrooms: 2,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Sala-comedor integrado', 'Patio posterior', 'Cocina equipada'],
      },
      {
        name: 'Departamento — 54 m²',
        area: 54,
        bedrooms: 2,
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
      'https://condescorporacion.com/wp-content/uploads/2025/12/FOTO-MONTSERRAT-PRINCIPAL-scaled.png',
    ],
    logo: 'logos/proyectos/monserrat.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 142,
    minApartmentSize: 109,
    features: ['Casas desde 142 m²', 'Departamentos desde 109 m²', 'Servicios completos'],
    description: 'Residencias Monserrat combina diseño contemporáneo con ubicación privilegiada en el Cercado de Arequipa. Perfecta para quienes buscan vivir cerca de los principales centros comerciales, educativos y de salud.',
    amenities: ['Áreas verdes', 'Seguridad 24h', 'Estacionamiento', 'Gimnasio'],
    gallery: {
      renders: [
        'https://condescorporacion.com/wp-content/uploads/2025/12/FOTO-MONTSERRAT-PRINCIPAL-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-3-MONTSERRAT_-GALERIA-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-4-MONTSERRAT_-GALERIA-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-5-MONTSERRAT_-GALERIA-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-6-MONTSERRAT_-GALERIA-scaled.png',
      ],
      planimetria: ['https://condescorporacion.com/wp-content/uploads/2026/02/PLANIMETRIA-MONTSERRAT.png'],
      // Fotos reales de avance de obra (no renders), tomadas en la propia construcción.
      avance: [
        'https://condescorporacion.com/wp-content/uploads/2026/05/MONSE-1.png',
        'https://condescorporacion.com/wp-content/uploads/2026/05/MONSE-2.png',
        'https://condescorporacion.com/wp-content/uploads/2026/05/MONSE-3.png',
        'https://condescorporacion.com/wp-content/uploads/2026/05/2-FOTO-1-FB.png',
        'https://condescorporacion.com/wp-content/uploads/2026/05/3-FOTO-2-FB.png',
        'https://condescorporacion.com/wp-content/uploads/2026/05/4-FOTO-3-FB.png',
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
        name: 'Departamento — 109 m²',
        area: 109,
        bedrooms: 3,
        bathrooms: 2,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Walk-in closet', 'Balcón', 'Depósito'],
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
      'https://condescorporacion.com/wp-content/uploads/2025/12/FOTO-CONDES-R.-PRINCIPAL-scaled.png',
    ],
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
        'https://condescorporacion.com/wp-content/uploads/2025/12/FOTO-CONDES-R.-PRINCIPAL-scaled.png',
      ],
      planimetria: ['https://condescorporacion.com/wp-content/uploads/2026/02/PLANIMETRIA-CONDES-R.png'],
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
      'https://condescorporacion.com/wp-content/uploads/2026/01/FOTO-JARDINES-S-PRINCIPAL-scaled.jpg',
    ],
    logo: 'logos/proyectos/jardines-del-sol.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 121,
    minApartmentSize: 112,
    features: ['Casas desde 121 m²', 'Departamentos desde 112 m²', 'Servicios completos'],
    description: 'Ubicado en el exclusivo distrito de Yanahuara, Jardines del Sol te ofrece un entorno tranquilo con vistas privilegiadas al volcán Misti y acceso rápido al centro histórico de Arequipa.',
    amenities: ['Jardines privados', 'Seguridad 24h', 'Estacionamiento', 'Zona de juegos'],
    gallery: {
      renders: [
        'https://condescorporacion.com/wp-content/uploads/2026/01/FOTO-JARDINES-S-PRINCIPAL-scaled.jpg',
        'https://condescorporacion.com/wp-content/uploads/2026/05/3_Mesa-de-trabajo-1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/05/4_Mesa-de-trabajo-1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/05/5_Mesa-de-trabajo-1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/05/7_Mesa-de-trabajo-1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/05/8_Mesa-de-trabajo-1-scaled.png',
      ],
      planimetria: ['https://condescorporacion.com/wp-content/uploads/2026/06/PLANIMETRIA-JARDINES-DEL-SOL.png'],
      avance: [PLACEHOLDER_AVANCE_IMAGE],            // Pendiente: reemplazar por fotos reales de avance de obra
    },
    typologies: [
      {
        name: 'Casa — 121 m²',
        area: 121,
        bedrooms: 3,
        bathrooms: 2,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Jardín privado', 'Vista al Misti', 'Cocina equipada'],
      },
      {
        name: 'Departamento — 112 m²',
        area: 112,
        bedrooms: 3,
        bathrooms: 2,
        planImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        features: ['Balcón con vista', 'Depósito', 'Estacionamiento techado'],
      },
    ],
  },
  {
    id: '5',
    name: 'Residencial Parque Central',
    slug: 'parquecentral',
    location: 'Cercado · Arequipa',
    district: 'Cercado',
    city: 'Arequipa',
    tag: 'Nuevo',
    status: 'preventa',
    type: ['casas', 'departamentos'],
    zone: 'ciudad',
    images: [
      'https://condescorporacion.com/wp-content/uploads/2026/04/PARQUE-CENTRAL-EDIFICIO.png',
    ],
    logo: 'logos/proyectos/parquecentral.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 113,
    minApartmentSize: 82,
    features: ['Casas desde 113 m²', 'Departamentos desde 82.39 m²', 'Servicios completos'],
    description: 'Residencial Parque Central es nuestra propuesta más reciente en el Cercado. Con una arquitectura moderna y funcional, este proyecto está pensado para quienes valoran la conectividad y la vida urbana.',
    amenities: ['Terraza comunal', 'Seguridad 24h', 'Estacionamiento', 'Sala de coworking'],
    gallery: {
      renders: [
        'https://condescorporacion.com/wp-content/uploads/2026/04/PARQUE-CENTRAL-EDIFICIO.png',
      ],
      planimetria: ['https://condescorporacion.com/wp-content/uploads/2026/04/PLANIMETRIA-PARQUE-CENTRAL-01-scaled.png'],
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
      'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-COSTA-REAL-PRINCIPAL.png',
    ],
    logo: 'logos/proyectos/costa-real.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 110,
    features: ['Casas desde 110 m²', 'Frente a playa', 'Servicios completos'],
    description: 'A solo metros de la playa de Mollendo, Costa Real Residencial es tu segunda vivienda ideal. Disfruta del mar, el sol y la tranquilidad con la misma calidad y respaldo legal de todos nuestros proyectos.',
    amenities: ['Acceso directo a playa', 'Estacionamiento', 'Área de parrillas', 'Jardines'],
    gallery: {
      renders: [
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-COSTA-REAL-PRINCIPAL.png',
        'https://condescorporacion.com/wp-content/uploads/2026/03/FOTO-1_-COSTAS_GALERIA1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-2_-COSTAS_GALERIA1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-3_-COSTAS_GALERIA1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-4_-COSTAS_GALERIA1-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-5_-COSTAS_GALERIA1.png',
      ],
      planimetria: ['https://condescorporacion.com/wp-content/uploads/2026/05/PLANIMETRIA-COSTA-REAL-MAYO2026-scaled.png'],
      avance: [PLACEHOLDER_AVANCE_IMAGE],            // Pendiente: reemplazar por fotos reales de avance de obra
    },
    typologies: [
      {
        name: 'Casa de playa — 110 m²',
        area: 110,
        bedrooms: 3,
        bathrooms: 2,
        planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
        features: ['Vista al mar', 'Terraza', 'Área de parrillas'],
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
      'https://condescorporacion.com/wp-content/uploads/2026/08/RENDER-PRINCIPAL-edit-scaled.png',
    ],
    logo: 'logos/proyectos/monaco.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minApartmentSize: 103,
    features: ['Departamentos desde 103.24 m²', 'Espacios comerciales desde 52.98 m²', 'Servicios completos'],
    description: 'Torre Mónaco combina arquitectura moderna, ambientes funcionales y detalles que priorizan el confort y la seguridad, sobre la Av. Lambramani en José Luis Bustamante y Rivero — una ubicación estratégica con conexiones subterráneas y acabados de calidad.',
    amenities: ['Ubicación estratégica', 'Estacionamiento techado', 'Seguridad 24h', 'Conexiones subterráneas', 'Documentación certificada'],
    gallery: {
      renders: [
        'https://condescorporacion.com/wp-content/uploads/2026/08/RENDER-PRINCIPAL-edit-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/08/Escena-16-edit-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/08/MON_ARQ_RENDER_TIPO_3Escena-10-edit-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/08/MON_ARQ_RENDER_TIPO_3Escena-11-edit-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/08/TMO_TIP2_SALA-DET-2-edit-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/08/TMO_TIP2_TERRAZA-1-edit-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/08/TMO_TIP2_TERRAZA-3-edit-scaled.png',
        'https://condescorporacion.com/wp-content/uploads/2026/08/TMO_VIVIENDA_TIP_3_RENDER-edit.png',
        'https://condescorporacion.com/wp-content/uploads/2026/08/TERRAZA-scaled.jpeg',
      ],
      planimetria: ['https://condescorporacion.com/wp-content/uploads/2026/08/TORRE-MONACO_PLN_JUNIO2026_A3-01-scaled.png'],
      avance: [PLACEHOLDER_AVANCE_IMAGE], // Pendiente: reemplazar por fotos reales de avance de obra
    },
    typologies: [
      {
        name: 'Departamento — 103 m²',
        area: 103,
        bedrooms: 3,
        bathrooms: 2,
        planImage: 'https://condescorporacion.com/wp-content/uploads/2026/08/TORRE-MONACO_PLN_JUNIO2026_A3-01-scaled.png',
        features: ['Terraza', 'Acabados de calidad', 'Estacionamiento techado'],
      },
      {
        name: 'Espacio comercial — 53 m²',
        area: 53,
        planImage: 'https://condescorporacion.com/wp-content/uploads/2026/08/TORRE-MONACO_PLN_JUNIO2026_A3-01-scaled.png',
        features: ['Frente a Av. Lambramani', 'Ideal para negocio', 'Acceso independiente'],
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
      'https://condescorporacion.com/wp-content/uploads/2026/08/09-1-scaled.jpg',
    ],
    logo: 'logos/proyectos/santa-maria.png',
    areas360: buildAreas360(), // Pendiente: reemplazar por las imágenes 360 reales de cada ambiente
    minHouseSize: 215,
    features: ['Casas desde 215 m²', 'Lotes desde 300 m²', 'Frente a playa'],
    description: 'Residencias Santa María es nuestro nuevo proyecto frente al mar en Mejía, a pocos minutos de la plaza principal. Pensado para despertar frente al océano, combina casas y lotes de playa con áreas comunes completas: club house, piscinas recreativas, canchas deportivas y amplias zonas verdes.',
    amenities: ['Club house', 'Dos piscinas recreativas', 'Canchas deportivas', 'Plazas y jardines', 'Conexiones subterráneas', 'Pet-friendly', 'Seguridad 24h'],
    gallery: {
      renders: [
        'https://condescorporacion.com/wp-content/uploads/2026/08/09-1-scaled.jpg',
        'https://condescorporacion.com/wp-content/uploads/2026/08/08-scaled.jpg',
        'https://condescorporacion.com/wp-content/uploads/2026/08/04-scaled.jpg',
        'https://condescorporacion.com/wp-content/uploads/2026/08/01-scaled.jpg',
        'https://condescorporacion.com/wp-content/uploads/2026/08/MED-04-scaled.jpg',
        'https://condescorporacion.com/wp-content/uploads/2026/08/MED-08-scaled.jpg',
        'https://condescorporacion.com/wp-content/uploads/2026/08/03-scaled.jpg',
        'https://condescorporacion.com/wp-content/uploads/2026/08/04-1-scaled.jpg',
      ],
      planimetria: ['https://condescorporacion.com/wp-content/uploads/2026/08/SANTA-MARIA_PLANIMETRIA-MARZO-1-01-scaled.png'],
      avance: [PLACEHOLDER_AVANCE_IMAGE], // Pendiente: reemplazar por fotos reales de avance de obra
    },
    typologies: [
      {
        name: 'Casa de playa — 215 m²',
        area: 215,
        planImage: 'https://condescorporacion.com/wp-content/uploads/2026/08/SANTA-MARIA_PLANIMETRIA-MARZO-1-01-scaled.png',
        features: ['Diseño de casa de playa', 'Doble altura', 'Club house cercano'],
      },
      {
        name: 'Lote — 300 m²',
        area: 300,
        planImage: 'https://condescorporacion.com/wp-content/uploads/2026/08/SANTA-MARIA_PLANIMETRIA-MARZO-1-01-scaled.png',
        features: ['Terreno independiente', 'Conexiones subterráneas', 'Zona de club house cercana'],
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
  'https://condescorporacion.com/wp-content/uploads/2025/12/FOTO-FLORENCIA-PRINCIPAL-scaled.png',
  'https://condescorporacion.com/wp-content/uploads/2026/08/RENDER-PRINCIPAL-edit-scaled.png',
  'https://condescorporacion.com/wp-content/uploads/2025/12/FOTO-MONTSERRAT-PRINCIPAL-scaled.png',
  'https://condescorporacion.com/wp-content/uploads/2026/02/FOTO-COSTA-REAL-PRINCIPAL.png',
  'https://condescorporacion.com/wp-content/uploads/2026/04/PARQUE-CENTRAL-EDIFICIO.png',
  'https://condescorporacion.com/wp-content/uploads/2026/01/FOTO-JARDINES-S-PRINCIPAL-scaled.jpg',
]

export const teamImages: string[] = [
  'https://condescorporacion.com/wp-content/uploads/2026/04/Arquitectura-1-1.png',
  'https://condescorporacion.com/wp-content/uploads/2026/04/Legal-1.png',
  'https://condescorporacion.com/wp-content/uploads/2026/04/Maqueteria-1.png',
  'https://condescorporacion.com/wp-content/uploads/2026/04/CONTABLE.png',
  'https://condescorporacion.com/wp-content/uploads/2026/04/arquitectura-2.png',
]

export const CONTACT = {
  email: 'callcenter@condescorporacion.com',
  phone: '+51 958 295 181',
  address: 'C. Parque Las Condes 123, Arequipa',
  sales: 'Auxiliar Lambramani',
  instagram: 'https://www.instagram.com/condes_corp',
  facebook: 'https://www.facebook.com/share/17gaUMEzSG/',
  tiktok: 'https://www.tiktok.com/@condes.corporacion',
  whatsapp: 'https://wa.me/51958295181',
}
