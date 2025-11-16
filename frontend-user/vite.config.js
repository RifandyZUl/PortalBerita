// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:5000'
    } 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // untuk import '@/components/...' dll
    },
  },
  // Vitest configuration dipindah ke vitest.config.js
});
