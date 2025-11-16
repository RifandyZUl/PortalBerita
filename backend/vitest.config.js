import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true, // Agar beforeAll, afterAll, describe, it, expect tersedia secara global
    environment: 'node',
    // setupFiles: Tidak digunakan karena setiap test file melakukan setup sendiri
    // setupFiles: ['./tests/setupTestDB.js'],
    // Pastikan semua test files ditemukan
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    // Reporter untuk output yang lebih informatif di UI
    reporters: ['verbose'],
    // Sequential execution untuk menghindari konflik database
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Sequential execution (satu per satu)
      },
    },
    sequence: {
      concurrent: false, // Pastikan test berjalan sequential
      shuffle: false, // Jangan shuffle test order
    },
    fileParallelism: false, // JANGAN jalankan multiple test files secara parallel
    // Test timeout (default 5s mungkin terlalu pendek untuk database operations)
    testTimeout: 60000, // 60 detik (lebih lama untuk database cleanup)
    hookTimeout: 60000, // 60 detik untuk beforeAll/afterAll (lebih lama untuk cleanup)
    // Isolate setiap test file untuk memastikan database benar-benar terisolasi
    isolate: true, // Setiap test file berjalan di isolate context
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.json'],
  },
  esbuild: {
    target: 'node18',
  },
});
