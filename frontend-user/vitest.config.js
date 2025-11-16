import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    // Pattern sederhana - Vitest akan mencari semua test files dari root
    // Pastikan root directory adalah frontend-user (bukan src)
    root: '.',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    // Reporter untuk output yang lebih informatif di UI
    reporters: ['verbose'],
    // Gunakan single thread untuk sequential execution dan menghindari timeout
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Sequential execution (satu per satu)
      },
    },
    // Sequential execution untuk melihat test satu per satu
    sequence: {
      concurrent: false, // Pastikan test berjalan sequential
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
