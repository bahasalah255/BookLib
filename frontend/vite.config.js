import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':    { target: 'http://localhost:3001', changeOrigin: true },
      '/books':   { target: 'http://localhost:3002', changeOrigin: true },
      '/borrows': { target: 'http://localhost:3003', changeOrigin: true },
    },
  },
})
