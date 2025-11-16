# 🎨 Cara Menggunakan Vitest UI - Test Satu Per Satu dengan Keterangan

## 🚀 Quick Start

### 1. Jalankan Test dengan UI

```bash
npm run test:ui
```

### 2. Buka Browser

Vitest UI akan otomatis membuka browser di:
```
http://localhost:51204/__vitest__/
```

## 📋 Cara Melihat Test Satu Per Satu dengan Keterangan

### Di Vitest UI, Anda Akan Melihat:

#### 1. **Test File List (Sidebar Kiri)**
```
📁 utils/__tests__/time.test.js
📁 utils/__tests__/imageTransform.test.js
📁 src/components/__tests__/NewsCardSmall.test.jsx
📁 src/components/__tests__/Header.test.jsx
...
```

#### 2. **Klik Test File untuk Melihat Detail**

Ketika Anda klik pada test file, UI akan menampilkan:

```
📄 NewsCardSmall.test.jsx
  ├─ ✅ TEST 1: Harus render news data dengan benar (title, category, date, image)
  ├─ ✅ TEST 2: Harus memiliki link yang benar ke news detail (/news/{slug})
  ├─ ✅ TEST 3: Harus handle missing news data gracefully (null/undefined tidak crash)
  └─ ✅ TEST 4: Harus handle missing slug dengan fallback (link ke /news/#)
```

#### 3. **Klik Individual Test untuk Melihat Keterangan Lengkap**

Ketika Anda klik pada test individual (misal: TEST 1), UI akan menampilkan:

**Panel Detail:**
- **Test Name**: TEST 1: Harus render news data dengan benar (title, category, date, image)
- **Status**: ✅ Passed / ❌ Failed
- **Duration**: 45ms
- **Description**: 
  ```
  SKENARIO:
  - Komponen menerima data news yang valid
  
  YANG DITEST:
  - Title harus ditampilkan
  - Category dan date harus ditampilkan
  - Image harus ditampilkan dengan src dan alt yang benar
  
  EXPECTED RESULT:
  - Semua data news ditampilkan dengan benar di card
  ```
- **Assertions**: Semua expect() yang dijalankan
- **Console Output**: Log dari test (jika ada)

## 🎯 Format Test yang Sudah Diupdate

Semua test sekarang menggunakan format yang lebih informatif:

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
it('✅ TEST 1: [Deskripsi singkat] ([Detail tambahan])', () => {
  // test code
});
```

## 📊 Contoh di UI

### Test File View
Ketika Anda klik `NewsCardSmall.test.jsx`:

```
✅ TEST 1: Harus render news data dengan benar (title, category, date, image)
✅ TEST 2: Harus memiliki link yang benar ke news detail (/news/{slug})
✅ TEST 3: Harus handle missing news data gracefully (null/undefined tidak crash)
✅ TEST 4: Harus handle missing slug dengan fallback (link ke /news/#)
```

### Test Detail View
Ketika Anda klik `TEST 1`:

**Left Panel:**
- Test name dengan deskripsi lengkap
- Status (passed/failed)
- Duration

**Right Panel:**
- Full description dari komentar
- All assertions
- Console output
- Error details (jika failed)

## 🔍 Tips untuk Development

### 1. **Run Test Satu Per Satu**
- Klik pada test individual
- Klik tombol **"Run"** (atau tekan `Ctrl+R`)
- Lihat hasil secara detail
- Perbaiki jika ada error
- Lanjut ke test berikutnya

### 2. **Baca Keterangan Test**
- Setiap test punya komentar lengkap
- Baca **SKENARIO** untuk memahami context
- Baca **YANG DITEST** untuk tahu apa yang divalidasi
- Baca **EXPECTED RESULT** untuk tahu hasil yang diharapkan

### 3. **Filter Test**
- Gunakan search box untuk mencari test tertentu
- Filter berdasarkan status (passed/failed)
- Filter berdasarkan file atau name

### 4. **Watch Mode**
- Aktifkan watch mode di UI
- Test akan auto-run saat file berubah
- Lihat hasil real-time

## 🎨 UI Features

### Color Coding
- 🟢 **Green** - Test passed
- 🔴 **Red** - Test failed
- ⚪ **Gray** - Test skipped
- ⚫ **Black** - Test not run

### Keyboard Shortcuts
- `Ctrl+R` - Run all tests
- `Ctrl+F` - Focus search box
- `Ctrl+W` - Toggle watch mode

### Test Execution
- **Sequential Mode**: Test dijalankan satu per satu (sudah dikonfigurasi)
- **Verbose Reporter**: Output lebih detail dengan deskripsi lengkap

## 📝 Test Naming Convention

Semua test menggunakan format:
```
✅ TEST [NUMBER]: [Deskripsi singkat] ([Detail tambahan])
```

Contoh:
- `✅ TEST 1: Harus render news data dengan benar (title, category, date, image)`
- `✅ TEST 2: Harus memiliki link yang benar ke news detail (/news/{slug})`
- `✅ TEST 3: Harus handle missing news data gracefully (null/undefined tidak crash)`

## 💡 Best Practice

1. **Baca Deskripsi Test**
   - Setiap test punya komentar lengkap
   - Baca sebelum run test untuk memahami apa yang diuji

2. **Run Test Satu Per Satu**
   - Lebih mudah untuk debugging
   - Bisa fokus pada satu test saja

3. **Gunakan Watch Mode**
   - Auto-run saat file berubah
   - Lihat hasil real-time

4. **Lihat Error Details**
   - Klik pada failed test
   - Lihat error message dan stack trace
   - Perbaiki berdasarkan error detail

---

**Selamat Testing dengan UI! 🎉**

*Semua test sudah diupdate dengan format yang lebih informatif untuk UI.*

