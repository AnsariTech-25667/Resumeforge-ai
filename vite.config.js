import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) return 'vendor_react_dom';
            if (id.includes('react-router-dom')) return 'vendor_router';
            if (id.includes('@reduxjs') || id.includes('react-redux')) return 'vendor_redux';
            if (id.includes('react')) return 'vendor_react';
            if (id.includes('lucide-react')) return 'vendor_icons';
            return 'vendor_misc';
          }
        }
      }
    }
  }
})
