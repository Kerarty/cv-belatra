import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages публикует проект в подкаталог:
// https://kerarty.github.io/cv-belatra/
export default defineConfig({
  base: '/cv-belatra/',
  plugins: [react()],
})
