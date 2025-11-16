# 🎨 Vitest UI Testing Guide

## 📋 Cara Menggunakan Vitest UI

Vitest UI adalah interface grafis yang memudahkan Anda melihat dan menjalankan test dengan visual yang lebih baik.

## 🚀 Quick Start

### 1. Jalankan Test dengan UI

```bash
npm run test:ui
```

Atau:

```bash
npm test -- --ui
```

### 2. Buka Browser

Setelah command dijalankan, Vitest akan otomatis membuka browser di:
```
http://localhost:51204/__vitest__/
```

Atau buka manual di browser dengan URL yang ditampilkan di terminal.

## 🎯 Fitur Vitest UI

### 1. **Test Dashboard**
- Overview semua test files
- Status test (passed, failed, skipped)
- Test coverage summary
- Execution time

### 2. **Test File View**
- Lihat semua test dalam satu file
- Filter test berdasarkan status
- Search test by name
- Run individual test

### 3. **Test Details**
- Lihat error messages dengan detail
- Stack trace untuk debugging
- Console output
- Snapshot comparison (jika ada)

### 4. **Watch Mode**
- Auto-run test saat file berubah
- Filter files yang di-watch
- Toggle watch mode on/off

### 5. **Coverage Report**
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

## 📝 Contoh Penggunaan

### Run Specific Test File

1. Buka Vitest UI
2. Klik pada test file yang ingin dijalankan
3. Klik tombol "Run" atau tekan `Ctrl+R`

### Filter Tests

1. Gunakan search box di atas
2. Filter berdasarkan:
   - Status (passed, failed, skipped)
   - File name
   - Test name

### Debug Failed Test

1. Klik pada test yang failed (warna merah)
2. Lihat error message di panel bawah
3. Lihat stack trace untuk mengetahui baris yang error
4. Perbaiki code dan test akan auto-reload

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

## 🔧 Configuration

Vitest UI sudah dikonfigurasi di `vitest.config.js`:

```javascript
export default defineConfig({
  test: {
    // ... other config
  },
});
```

## 💡 Tips

1. **Gunakan Watch Mode** untuk development
   ```bash
   npm test -- --watch
   ```

2. **Run Specific Test** dengan filter
   ```bash
   npm test -- --ui --grep "ThemeToggle"
   ```

3. **Debug dengan Console**
   - Gunakan `console.log` di test
   - Lihat output di Console tab di UI

4. **Compare Snapshots**
   - Jika menggunakan snapshot testing
   - UI akan menampilkan diff visual

## 🐛 Troubleshooting

### UI tidak terbuka otomatis
- Buka browser manual dengan URL yang ditampilkan di terminal
- Biasanya: `http://localhost:51204/__vitest__/`

### Port sudah digunakan
- Vitest akan otomatis mencari port lain
- Cek terminal untuk URL yang benar

### Test tidak update
- Refresh browser
- Atau restart Vitest UI

## 📚 Resources

- [Vitest UI Documentation](https://vitest.dev/guide/ui.html)
- [Vitest Configuration](https://vitest.dev/config/)

---

**Selamat Testing dengan UI! 🎉**

