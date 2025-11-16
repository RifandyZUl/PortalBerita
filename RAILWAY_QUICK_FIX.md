# 🚀 Quick Fix Railway - DATABASE_URL Error

## ❌ Masalah Saat Ini

Log menunjukkan:
```
[ENV] production | DB: undefined
❌ Failed to start server: ConnectionRefusedError
```

Ini berarti `DATABASE_URL` **tidak terbaca** atau **salah format**.

---

## ✅ Solusi: Copy DATABASE_PUBLIC_URL ke DATABASE_URL

### Step 1: Copy Value dari DATABASE_PUBLIC_URL

Dari screenshot, Anda punya:
- ✅ **DATABASE_PUBLIC_URL** (BENAR - pakai ini!)
  ```
  postgresql://postgres:FOPQfrVqNnxReTxLmREBldlhUzuvuQyk@interchange.proxy.rlwy.net:14549/railway
  ```

- ❌ **DATABASE_URL** (SALAH - jangan pakai ini!)
  ```
  postgresql://postgres:FOPQfrVqNnxReTxLmREB1d1hUzuvuQyk@postgres.railway.internal:5432/railway
  ```

### Step 2: Update DATABASE_URL di Service PortalBerita

1. **Klik service "PortalBerita"** (bukan Postgres)
2. **Klik tab "Variables"**
3. **Klik "{ } Raw Editor"**
4. **Copy value dari DATABASE_PUBLIC_URL** dan paste ke DATABASE_URL:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:FOPQfrVqNnxReTxLmREBldlhUzuvuQyk@interchange.proxy.rlwy.net:14549/railway
JWT_SECRET=cd3d09db0da2f3e60a19323fae877b12a62a66d560968798a7a005798faf7b0e
CLOUDINARY_CLOUD_NAME=dm8wehn4a
CLOUDINARY_API_KEY=165127524344634
CLOUDINARY_API_SECRET=p8TF5hs-XrwHVljhxuOg8Y0VYXg
CORS_ORIGIN=https://portal-berita-9p4n.vercel.app,https://portal-berita-t9ye.vercel.app
```

**PENTING:**
- ❌ **TANPA quotes** (`"`)
- ❌ **TANPA spasi** setelah `=`
- ✅ **Copy exact value** dari `DATABASE_PUBLIC_URL`

### Step 3: Save & Restart

1. Klik **"Update Variables"**
2. Railway akan otomatis restart
3. Check logs - harus muncul:
   ```
   [ENV] production | DB: railway
   [DEBUG] DATABASE_URL exists: true
   ✅ PostgreSQL connected
   ✅ Server running at http://localhost:5000
   ```

---

## 🔍 Verifikasi

Setelah update, check logs:

**✅ BENAR:**
```
[ENV] production | DB: railway
[DEBUG] DATABASE_URL exists: true
✅ PostgreSQL connected
✅ Server running
```

**❌ MASIH SALAH:**
```
[ENV] production | DB: undefined
[DEBUG] DATABASE_URL exists: false
❌ Failed to start server
```

---

## 📝 Checklist

- [ ] Copy value dari `DATABASE_PUBLIC_URL` (dari Postgres service)
- [ ] Paste ke `DATABASE_URL` (di PortalBerita service)
- [ ] Pastikan TANPA quotes
- [ ] Pastikan TANPA spasi
- [ ] Klik "Update Variables"
- [ ] Check logs untuk verifikasi

---

**Setelah ini, service harusnya berjalan! ✅**

