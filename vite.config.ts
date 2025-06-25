import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/plan': 'http://127.0.0.1:8000',
      '/status': 'http://127.0.0.1:8000',
    },
  },
});
