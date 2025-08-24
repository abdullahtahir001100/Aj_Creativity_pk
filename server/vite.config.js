import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // required for deployment subpath
  build: {
    rollupOptions: {
      // no need to externalize react-leaflet
      external: []
    }
  },
  server: {
    historyApiFallback: true // handles react-router-dom routing
  }
})
