import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/auth': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/movies': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/theatres': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/screens': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/seats': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/shows': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/bookings': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/payments': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/test': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/admin': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/user': { target: 'http://localhost:8080', bypass: serveSpaRoute },
      '/mixed': { target: 'http://localhost:8080', bypass: serveSpaRoute },
    },
  },
})

function serveSpaRoute(req) {
  return req.headers.accept?.includes('text/html') ? req.url : undefined;
}
