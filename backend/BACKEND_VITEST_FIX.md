# 🔧 Backend Vitest Migration - Troubleshooting

## ⚠️ Masalah yang Ditemukan

Saat migrasi dari Jest ke Vitest, ada beberapa test files yang failed. Ini adalah masalah umum saat migrasi.

## 🔍 Kemungkinan Penyebab

1. **Import Issues**: Beberapa test files mungkin menggunakan import yang tidak kompatibel
2. **Module Resolution**: ES modules resolution mungkin berbeda
3. **Setup File**: `beforeAll` perlu di-import dari Vitest

## ✅ Perbaikan yang Sudah Dilakukan

### 1. Setup File (`tests/setupTestDB.js`)
- ✅ Menambahkan `import { beforeAll } from 'vitest'`
- ✅ Memastikan kompatibel dengan Vitest

### 2. Vitest Config (`vitest.config.js`)
- ✅ Menambahkan `globals: true` untuk `beforeAll`, `describe`, `it`, `expect`
- ✅ Menambahkan `esbuild.target: 'node18'` untuk ES modules support
- ✅ Sequential execution untuk database

## 🚀 Solusi Alternatif

Jika masih ada masalah, ada 2 opsi:

### Opsi 1: Tetap Pakai Jest dengan HTML Reporter (Lebih Stabil)

Jest sudah terbukti bekerja dengan baik. Kita bisa tambahkan HTML reporter:

```bash
npm install --save-dev jest-html-reporter
```

Lalu update `jest.config.js`:
```javascript
export default {
  // ... existing config
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Backend Test Report',
      outputPath: './test-results.html',
    }],
  ],
};
```

### Opsi 2: Perbaiki Vitest (Recommended untuk UI yang Lebih Bagus)

Jika ingin tetap pakai Vitest untuk UI yang lebih bagus:

1. **Cek Error Detail**: Jalankan `npm test -- --run` dan lihat error spesifik
2. **Fix Import Issues**: Pastikan semua import menggunakan ES modules syntax
3. **Fix Module Resolution**: Pastikan `resolve.alias` benar

## 📝 Checklist

- [x] Setup file diperbaiki
- [x] Vitest config diperbaiki
- [ ] Test files yang failed diperbaiki
- [ ] Semua test passing

## 💡 Rekomendasi

**Untuk sekarang**: Tetap pakai Jest dengan `npm run test:jest` karena sudah terbukti bekerja.

**Untuk UI**: Bisa setup HTML reporter untuk Jest, atau perbaiki error Vitest satu per satu.

---

**Status**: Work in Progress 🔧

