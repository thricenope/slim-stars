import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/slim-stars/',
  plugins: [react()],
  server: { port: 5189, host: true },
})
