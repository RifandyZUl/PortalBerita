// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // <- bedakan port dari frontend-admin
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // untuk import '@/components/...' dll
    },
  },
});
