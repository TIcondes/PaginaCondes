# Condes Corporación

Sitio web de Condes Corporación — proyectos inmobiliarios en Arequipa, Perú.

## Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Three.js](https://threejs.org/) — visor de recorridos 360° nativo
- [React Router](https://reactrouter.com/)

## Desarrollo

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # build de producción en dist/
npm run preview   # sirve el build de producción localmente
```

## Estructura

- `src/data/index.ts` — toda la información de proyectos, contacto y banners vive acá (sin base de datos externa). Ver los comentarios en el archivo para agregar un proyecto nuevo.
- `src/types/index.ts` — tipos de TypeScript para `Project`, `Typology`, `PanoramaArea`, etc.
- `src/pages/` — una página por ruta (Home, Projects, ProjectDetail, About, Contact).
- `src/components/` — componentes reutilizables (`layout/` para navbar/footer, `ui/` para tarjetas, formularios, el visor 360°, etc.).
