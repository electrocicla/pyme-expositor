import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
      }
    },
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('swiper') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            return 'vendor-other';
          }
          // Application chunks
          if (id.includes('src/components/Editor')) {
            return 'editor';
          }
          if (id.includes('src/components/Landing')) {
            return 'landing';
          }
          if (id.includes('src/components/ReactBits')) {
            return 'reactbits';
          }
        },
      },
    },
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
  },
})
