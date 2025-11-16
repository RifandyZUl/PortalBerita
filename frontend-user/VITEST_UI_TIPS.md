# 🎨 Tips Menggunakan Vitest UI dengan Test Satu Per Satu

## 📋 Cara Melihat Test Satu Per Satu di UI

### 1. Jalankan Test dengan UI

```bash
npm run test:ui
```

### 2. Di Vitest UI, Anda Bisa:

#### A. Lihat Test Detail Satu Per Satu
1. Klik pada **test file** di sidebar kiri
2. UI akan menampilkan semua test dalam file tersebut
3. Setiap test akan menampilkan:
   - ✅ Nama test (dengan deskripsi lengkap)
   - ✅ Status (passed/failed/skipped)
   - ✅ Duration (waktu eksekusi)
   - ✅ Error message (jika failed)

#### B. Run Test Satu Per Satu
1. Klik pada **individual test** (bukan test file)
2. Klik tombol **"Run"** di kanan atas
3. Test akan dijalankan dan hasilnya ditampilkan secara detail

#### C. Lihat Deskripsi Test
- Setiap test sudah memiliki deskripsi lengkap di komentar
- Di UI, hover pada test name untuk melihat detail
- Klik test untuk melihat full description

## 🎯 Format Test yang Sudah Diupdate

Semua test sekarang menggunakan format:

```javascript
/**
 * TEST 1: [Nama Test]
 * 
 * SKENARIO:
 * - [Apa yang sedang diuji]
 * 
 * YANG DITEST:
 * - [Apa yang divalidasi]
 * 
 * EXPECTED RESULT:
 * - [Hasil yang diharapkan]
 */
it('✅ TEST 1: [Deskripsi singkat test]', () => {
  // test code
});
```

## 📊 Contoh di UI

### Test File View
```
📁 NewsCardSmall.test.jsx
  ├─ ✅ TEST 1: Harus render news data dengan benar
  ├─ ✅ TEST 2: Harus memiliki link yang benar ke news detail
  ├─ ✅ TEST 3: Harus handle missing news data gracefully
  └─ ✅ TEST 4: Harus handle missing slug dengan fallback
```

### Test Detail View
Ketika klik pada test, Anda akan melihat:
- **Test Name**: TEST 1: Harus render news data dengan benar
- **Description**: Semua komentar dari test
- **Status**: ✅ Passed / ❌ Failed
- **Duration**: 45ms
- **Assertions**: Semua expect() yang dijalankan

## 🔍 Tips untuk Development

### 1. Run Test Satu Per Satu
- Klik test individual → Run
- Lihat hasil secara detail
- Perbaiki jika ada error
- Lanjut ke test berikutnya

### 2. Filter Test
- Gunakan search box untuk mencari test tertentu
- Filter berdasarkan status (passed/failed)
- Filter berdasarkan file

### 3. Watch Mode
- Aktifkan watch mode di UI
- Test akan auto-run saat file berubah
- Lihat hasil real-time

### 4. Debug Failed Test
- Klik pada test yang failed (warna merah)
- Lihat error message di panel bawah
- Lihat stack trace untuk mengetahui baris yang error
- Perbaiki code dan test akan auto-reload

## 📝 Test Naming Convention

Semua test menggunakan format:
```
✅ TEST [NUMBER]: [Deskripsi singkat] ([Detail tambahan])
```

Contoh:
- `✅ TEST 1: Harus render news data dengan benar (title, category, date, image)`
- `✅ TEST 2: Harus memiliki link yang benar ke news detail (/news/{slug})`
- `✅ TEST 3: Harus handle missing news data gracefully (null/undefined tidak crash)`

## 🎨 UI Features yang Berguna

### 1. Test Explorer
- Sidebar kiri menampilkan semua test files
- Expand/collapse untuk melihat test dalam file
- Color coding: 🟢 Green (passed), 🔴 Red (failed)

### 2. Test Details Panel
- Klik test untuk melihat detail
- Lihat semua assertions
- Lihat console output
- Lihat error stack trace

### 3. Search & Filter
- Search box di atas untuk mencari test
- Filter by status, file, atau name
- Quick navigation

### 4. Run Controls
- Run all tests
- Run failed tests only
- Run specific test file
- Run individual test

## 💡 Best Practice

1. **Lihat Test Satu Per Satu**
   - Klik test file → Lihat semua test
   - Klik individual test → Lihat detail
   - Run test satu per satu untuk debugging

2. **Gunakan Watch Mode**
   - Aktifkan watch mode
   - Test akan auto-run saat save file
   - Lihat hasil real-time

3. **Baca Deskripsi Test**
   - Setiap test punya komentar lengkap
   - Baca SKENARIO untuk memahami context
   - Baca EXPECTED RESULT untuk tahu hasil yang diharapkan

---

**Selamat Testing dengan UI! 🎉**

*Semua test sudah diupdate dengan format yang lebih informatif untuk UI.*

