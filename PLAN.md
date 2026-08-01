# Plan de Implementación: Sección de "Proyectos"

## 1. Contexto de la UI Actual
Tras analizar la arquitectura del proyecto `condes-corporacion` (basado en React, Vite, TypeScript, y TailwindCSS), la implementación se integrará perfectamente en la estructura de carpetas existente. Las vistas y la lógica residirán en los siguientes componentes clave:

- **Datos (El "Backend" en Código):** `src/data/index.ts`. Aquí se alojará el array centralizado con toda la información de los proyectos. 
- **Tipos/Interfaces:** `src/types/index.ts`. Definirá la estructura estricta (TypeScript) de cada proyecto para evitar errores (ej. tipologías, galerías, URL 3D).
- **Vista de Galería/Lista:** `src/pages/Projects.tsx`. Renderizará la lista de todos los proyectos filtrables usando el componente `src/components/ui/ProjectCard.tsx`.
- **Vista de Detalle:** `src/pages/ProjectDetail.tsx`. Mostrará la galería de fotos optimizada, la información técnica detallada y el visor de Recorridos 3D mediante un `iframe`.
- **Navegación:** El menú principal se actualizará para enlazar a `/proyectos` desde la configuración global de navegación (`navLinks` en `src/data/index.ts` y `src/components/layout/Navbar.tsx`).

---

## 2. Estructura del Array en Código
Cumpliendo el requisito estricto de arquitectura, no usaremos bases de datos ni archivos JSON externos. Todo se manejará en el archivo `src/data/index.ts` exportando la constante `projects`. A continuación se muestra cómo quedará estructurado el código con comentarios explícitos para facilitar la mantenibilidad por cualquier desarrollador en el futuro:

```typescript
// ============================================================================
// 🏗️ BASE DE DATOS DE PROYECTOS (LOCAL)
// ============================================================================
// Para agregar un NUEVO PROYECTO, simplemente copia un bloque de objeto { ... } 
// existente, pégalo al final de este array y rellena los datos correspondientes.
// La página de detalle y la tarjeta en la galería se generarán AUTOMÁTICAMENTE.
// ============================================================================

export const projects: Project[] = [
  {
    // ---------------------------------------------------
    // 1. INFORMACIÓN BÁSICA
    // ---------------------------------------------------
    id: '1',                             // Identificador único (número o string)
    name: 'Nombre del Proyecto',         // Título principal (Ej. "Florencia Residencial")
    slug: 'nombre-del-proyecto',         // URL amigable (Sin espacios, ej. "florencia". Ruta: /proyectos/florencia)
    location: 'Distrito · Ciudad',       // Ubicación visible en tarjetas
    district: 'Nombre del distrito',     // Para filtros o metadata
    city: 'Arequipa',                    // Ciudad
    tag: 'Disponible',                   // Etiqueta destacada en UI (Ej. "Premium", "Playa", "Preventa")
    status: 'disponible',                // Estado técnico: 'disponible' | 'preventa' | 'entregado'
    type: ['casas', 'departamentos'],    // Tipos de inmuebles ofrecidos (para filtrado)
    zone: 'ciudad',                      // Zona geográfica: 'ciudad' | 'playa'
    
    // ---------------------------------------------------
    // 2. DESCRIPCIÓN Y ÁREAS
    // ---------------------------------------------------
    description: 'Descripción completa del proyecto para la vista de detalles...',
    minHouseSize: 100,                   // Área mínima en m2 para casas (opcional si no hay casas)
    minApartmentSize: 50,                // Área mínima en m2 para departamentos (opcional)
    features: [                          // Viñetas principales para resumen
      'Casas desde 100 m²', 
      'Acabados premium'
    ],
    amenities: [                         // Lista de áreas comunes y servicios
      'Áreas verdes', 
      'Seguridad 24h', 
      'Piscina'
    ],

    // ---------------------------------------------------
    // 3. MULTIMEDIA (FOTOS Y RENDERS)
    // ---------------------------------------------------
    // Las imágenes principales que se ven en la tarjeta de presentación
    images: [
      'https://url-de-tu-imagen-principal.jpg'
    ],
    // Galería categorizada (Aparecerá en pestañas en la vista de detalle)
    gallery: {
      renders: ['https://url-render-1.jpg', 'https://url-render-2.jpg'], // Renders finales
      planimetria: ['https://url-plano-1.jpg'],                          // Planos de loteo
      avance: ['https://url-foto-obra-1.jpg']                            // Fotos reales de la obra
    },

    // ---------------------------------------------------
    // 4. TIPOLOGÍAS Y RECORRIDOS 3D
    // ---------------------------------------------------
    typologies: [
      {
        name: 'Tipología A — 3 dormitorios',
        area: 120,                       // m2 de esta tipología
        bedrooms: 3,
        bathrooms: 2,
        planImage: 'https://url-del-plano.jpg',
        // URL DEL VISOR 3D (Matterport, Sketchfab, etc.). Se incrustará vía iframe automáticamente.
        model3dUrl: 'https://my.matterport.com/show/?m=ejemplo123' 
      }
    ]
  },
  // ⬇️ PEGA AQUÍ EL SIGUIENTE PROYECTO ⬇️
];
```

---

## 3. Plan de Acción Paso a Paso

1. **Paso 1: Estructurar Tipos y Constantes Centrales**
   - Asegurar que la interfaz `Project` (en `src/types/index.ts`) soporte todas las propiedades definidas (incluyendo `gallery` categorizada y `model3dUrl` en las tipologías).
   - Documentar con comentarios exhaustivos el archivo `src/data/index.ts` y estructurar el array `projects` añadiendo bloques con los datos de cada proyecto.

2. **Paso 2: Crear/Adaptar la Galería Visual (`Projects.tsx`)**
   - Verificar y enlazar la vista principal en `src/pages/Projects.tsx` y el componente `ProjectCard.tsx` para que consuman el array importado de `src/data/index.ts`.
   - Implementar o validar los filtros de renderizado por zona (`ciudad`, `playa`) y tipo de inmueble.

3. **Paso 3: Construir la Vista de Detalle (`ProjectDetail.tsx`)**
   - Implementar un sistema de pestañas (Tabs) para mostrar la propiedad `gallery` segmentada (Renders, Planimetría, Avance de Obra).
   - Mapear las tipologías e integrar un componente condicional interactivo que renderice el plano (imagen) o incruste el visualizador 3D mediante un `iframe` si existe la propiedad `model3dUrl`.

4. **Paso 4: Integración y Navegación**
   - Confirmar y probar el enrutamiento dinámico en `App.tsx` (`<Route path="/proyectos/:slug" element={<ProjectDetail />} />`).
   - Validar que el enlace de "Proyectos" en el menú de navegación (`Navbar.tsx`) dirija correctamente hacia el nuevo módulo implementado.
