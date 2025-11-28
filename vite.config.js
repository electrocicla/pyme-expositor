import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
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
    },
    preview: {
        port: 5173,
        host: '0.0.0.0',
    },
});
