import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { prerenderHome } from './vite-plugins/prerender-home'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prerenderHome()],
})
