# 🚨 Fix Railway Crash - Environment Variables Error

## ❌ Masalah yang Ditemukan

Dari screenshot, service **PortalBerita** status: **"Crashed"** karena environment variables format salah.

---

## 🔴 Error di Environment Variables

### Masalah Utama:

1. **Pakai Quotes (`"`) - SALAH!**
   ```env
   ❌ NODE_ENV="production"
   ❌ PORT="5000"
   ❌ DATABASE_URL="postgresql://..."
   ```

2. **DATABASE_URL salah host**
   ```env
   ❌ DATABASE_URL="postgresql://...@postgres.railway.internal:5432/railway"
   ```
   `postgres.railway.internal` hanya untuk internal Railway, tidak bisa diakses dari service lain!

3. **CORS_ORIGIN format salah**
   ```env
   ❌ CORS_ORIGIN="https://portal-berita-9p4n.vercel.app/, https://portal-berita-t9ye.vercel.app/"
   ```
   - Pakai quotes ❌
   - Ada spasi setelah comma ❌
   - Ada trailing slash (`/`) ❌

---

## ✅ Format yang BENAR

### Step 1: Copy DATABASE_URL yang Benar

1. Klik service **Postgres** di sidebar kiri
2. Klik tab **"Variables"**
3. Klik icon **mata (eye)** di `DATABASE_URL` untuk reveal value
4. Copy **PUBLIC URL** (bukan internal URL)

**Format yang benar:**
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

**BUKAN:**
```
postgresql://postgres:password@postgres.railway.internal:5432/railway
```

### Step 2: Update Environment Variables (Tanpa Quotes!)

Di Railway Raw Editor, ganti dengan format ini (TANPA QUOTES):

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:fOPQfrVqNnxReTxLmREB1d1hUzuvuQyk@containers-us-west-xxx.railway.app:5432/railway
JWT_SECRET=cd3d09db0da2f3e60a19323fae877b12a62a66d560968798a7a005798faf7b0e
CLOUDINARY_CLOUD_NAME=dm8wehn4a
CLOUDINARY_API_KEY=165127524344634
CLOUDINARY_API_SECRET=p8TF5hs-XrwHV1jhxu0g8Y0VYXg
CORS_ORIGIN=https://portal-berita-9p4n.vercel.app,https://portal-berita-t9ye.vercel.app
```

**Perubahan:**
- ❌ Hapus semua quotes (`"`)
- ❌ Hapus trailing slash (`/`) di CORS_ORIGIN
- ❌ Hapus spasi setelah comma di CORS_ORIGIN
- ✅ Ganti `postgres.railway.internal` dengan public URL dari Postgres service

---

## 🔧 Step-by-Step Fix

### Step 1: Dapatkan DATABASE_URL yang Benar

1. Di Railway dashboard, klik **Postgres** service
2. Klik tab **"Variables"**
3. Cari `DATABASE_URL`
4. Klik icon **mata (👁️)** untuk reveal value
5. Copy value yang menggunakan **public domain** (bukan `.internal`)

**Contoh format yang benar:**
```
postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway
```

### Step 2: Update Variables di PortalBerita Service

1. Klik service **PortalBerita**
2. Klik tab **"Variables"**
3. Klik **"{ } Raw Editor"**
4. Hapus semua quotes dan update format:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:fOPQfrVqNnxReTxLmREB1d1hUzuvuQyk@containers-us-west-xxx.railway.app:5432/railway
JWT_SECRET=cd3d09db0da2f3e60a19323fae877b12a62a66d560968798a7a005798faf7b0e
CLOUDINARY_CLOUD_NAME=dm8wehn4a
CLOUDINARY_API_KEY=165127524344634
CLOUDINARY_API_SECRET=p8TF5hs-XrwHV1jhxu0g8Y0VYXg
CORS_ORIGIN=https://portal-berita-9p4n.vercel.app,https://portal-berita-t9ye.vercel.app
```

5. Klik **"Update Variables"**

### Step 3: Restart Service

1. Klik tab **"Deployments"**
2. Klik tombol **"Restart"** di deployment yang crashed
3. Atau Railway akan otomatis restart setelah update variables

---

## ✅ Checklist Perbaikan

- [ ] Semua variables TANPA quotes
- [ ] DATABASE_URL menggunakan public URL (bukan `.internal`)
- [ ] CORS_ORIGIN tanpa quotes, tanpa spasi, tanpa trailing slash
- [ ] Klik "Update Variables"
- [ ] Service restart otomatis atau manual restart

---

## 🔍 Verifikasi Setelah Fix

1. **Check Logs:**
   - Klik tab **"Logs"**
   - Harus muncul: `✅ PostgreSQL connected`
   - Harus muncul: `✅ Server running`

2. **Check Status:**
   - Status harus berubah dari "Crashed" menjadi "Active"

3. **Test API:**
   - Buka Domain URL di browser
   - Test: `https://your-domain.railway.app/api/dashboard`

---

## 🚨 Masalah Utama yang Harus Diperbaiki

### 1. Quotes di Semua Variables ❌
```env
# SALAH:
NODE_ENV="production"

# BENAR:
NODE_ENV=production
```

### 2. DATABASE_URL Internal ❌
```env
# SALAH:
DATABASE_URL="postgresql://...@postgres.railway.internal:5432/railway"

# BENAR:
DATABASE_URL=postgresql://...@containers-us-west-xxx.railway.app:5432/railway
```

### 3. CORS_ORIGIN Format ❌
```env
# SALAH:
CORS_ORIGIN="https://portal-berita-9p4n.vercel.app/, https://portal-berita-t9ye.vercel.app/"

# BENAR:
CORS_ORIGIN=https://portal-berita-9p4n.vercel.app,https://portal-berita-t9ye.vercel.app
```

---

## 📝 Copy-Paste Ready (Setelah dapat DATABASE_URL yang benar)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_PUBLIC_HOST.railway.app:5432/railway
JWT_SECRET=cd3d09db0da2f3e60a19323fae877b12a62a66d560968798a7a005798faf7b0e
CLOUDINARY_CLOUD_NAME=dm8wehn4a
CLOUDINARY_API_KEY=165127524634
CLOUDINARY_API_SECRET=p8TF5hs-XrwHV1jhxu0g8Y0VYXg
CORS_ORIGIN=https://portal-berita-9p4n.vercel.app,https://portal-berita-t9ye.vercel.app
```

**Ganti `DATABASE_URL` dengan public URL dari Postgres service!**

---

**Setelah fix, service akan otomatis restart dan status berubah menjadi Active! ✅**

