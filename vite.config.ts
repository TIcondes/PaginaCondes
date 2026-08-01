import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sirve este proyecto bajo https://ticondes.github.io/PaginaCondes/,
// así que el build necesita ese prefijo. En desarrollo (`vite`/`npm run dev`)
// se mantiene en la raíz para no cambiar el flujo local de siempre.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/PaginaCondes/' : '/',
  server: { port: 3000 }
}))
