import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/discovery': {
        target: 'https://app.ticketmaster.com',
        changeOrigin: true,
      },
      '/eventbrite': {
        target: 'https://www.eventbriteapi.com/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/eventbrite/, ''),
      },
    },
  },
})
