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
    // Reporter untuk output yang lebih informatif
    reporters: ['verbose'],
    // Gunakan threads untuk performa yang lebih baik (multiple threads, tapi lebih konservatif)
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 2, // Gunakan 2 threads untuk balance antara speed dan stability
      },
    },
    // Test dalam file berjalan sequential untuk menghindari race conditions
    sequence: {
      concurrent: false, // Test dalam file sequential untuk stability
      shuffle: false,
    },
    fileParallelism: true, // Multiple test files bisa berjalan parallel
    // Increase timeout untuk test yang kompleks
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
