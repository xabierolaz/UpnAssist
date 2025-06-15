import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import analyzer from 'rollup-plugin-analyzer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      plugins: [
        // Analizador de bundle en builds de producción
        process.env.ANALYZE === 'true' && analyzer({
          summaryOnly: true,
          limit: 20
        })
      ].filter(Boolean),
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['@heroicons/react'],
          utils: ['zustand', 'uuid']
        }
      }
    }
  },
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,
    // Security headers for development
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },
  preview: {
    port: 4173,
    host: true
  }
})
