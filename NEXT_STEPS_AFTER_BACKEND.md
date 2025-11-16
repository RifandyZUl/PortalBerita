# 🚀 Langkah Selanjutnya Setelah Backend Berhasil

Setelah backend berhasil di Railway, ikuti langkah-langkah berikut:

---

## ✅ Step 1: Verifikasi Backend (2 menit)

### 1.1 Check Backend Status

1. Buka Railway dashboard
2. Klik service **PortalBerita**
3. Pastikan status: **"Active"** ✅
4. Klik tab **"Settings"** → **"Generate Domain"** (jika belum ada)
5. Copy **Domain URL** (contoh: `portal-berita-production.up.railway.app`)

### 1.2 Test API Endpoint

Buka di browser atau Postman:
```
https://your-backend-domain.railway.app/api/dashboard
```

**Expected Response:**
```json
{
  "totalNews": 0,
  "totalCategories": 0,
  "totalComments": 0,
  "totalAuthors": 0
}
```

Jika berhasil, backend sudah siap! ✅

---

## 🎨 Step 2: Deploy Frontend Admin ke Vercel (5 menit)

### 2.1 Setup Vercel Project

1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik **"Add New"** → **"Project"**
4. Import repository **PortalBerita**
5. Klik **"Import"**

### 2.2 Configure Project

Di halaman **"Configure Project"**:

1. **Project Name:** `portal-berita-admin` (atau sesuai keinginan)
2. **Root Directory:** Klik **"Edit"** → ketik: `frontend`
3. **Framework Preset:** Vite (otomatis terdeteksi)
4. **Build Command:** `npm run build` (default)
5. **Output Directory:** `dist` (default)
6. **Install Command:** `npm install` (default)

### 2.3 Add Environment Variable

Scroll ke bawah, di bagian **"Environment Variables"**:

1. Klik **"Add"**
2. **Name:** `VITE_API_URL`
3. **Value:** `https://your-backend-domain.railway.app`
   - Ganti dengan Domain URL dari Step 1.1
   - Contoh: `https://portal-berita-production.up.railway.app`
4. Klik **"Save"**

### 2.4 Deploy

1. Klik **"Deploy"**
2. Tunggu build selesai (sekitar 2-3 menit)
3. Setelah selesai, copy **Deployment URL**
   - Contoh: `portal-berita-admin.vercel.app`
   - Atau custom domain jika sudah setup

---

## 👥 Step 3: Deploy Frontend User ke Vercel (5 menit)

### 3.1 Create New Project

1. Di Vercel dashboard, klik **"Add New"** → **"Project"**
2. Import repository yang sama (**PortalBerita**)
3. Klik **"Import"**

### 3.2 Configure Project

1. **Project Name:** `portal-berita-user` (atau sesuai keinginan)
2. **Root Directory:** Klik **"Edit"** → ketik: `frontend-user`
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`

### 3.3 Add Environment Variable

1. **Name:** `VITE_API_URL`
2. **Value:** `https://your-backend-domain.railway.app`
   - Sama dengan backend URL dari Step 1.1
3. Klik **"Save"**

### 3.4 Deploy

1. Klik **"Deploy"**
2. Tunggu build selesai
3. Copy **Deployment URL**
   - Contoh: `portal-berita-user.vercel.app`

---

## 🔗 Step 4: Update CORS di Backend (2 menit)

### 4.1 Update CORS_ORIGIN

1. Kembali ke **Railway dashboard**
2. Klik service **PortalBerita**
3. Klik tab **"Variables"**
4. Klik **"{ } Raw Editor"**
5. Update `CORS_ORIGIN` dengan URL Vercel:

```env
CORS_ORIGIN=https://portal-berita-admin.vercel.app,https://portal-berita-user.vercel.app
```

**PENTING:**
- ❌ TANPA quotes
- ❌ TANPA spasi setelah comma
- ❌ TANPA trailing slash (`/`)
- ✅ Ganti dengan URL Vercel yang sebenarnya

6. Klik **"Update Variables"**
7. Railway akan otomatis restart

---

## 🧪 Step 5: Testing (5 menit)

### 5.1 Test Backend API

Buka di browser:
```
https://your-backend.railway.app/api/dashboard
```

Harus return JSON dengan data.

### 5.2 Test Frontend Admin

1. Buka: `https://your-admin.vercel.app`
2. Coba **Login** dengan credentials admin
3. Coba **Create Article**
4. Coba **Upload Image** (harus connect ke Cloudinary)

**Jika ada error:**
- Check browser console (F12)
- Pastikan `VITE_API_URL` sudah benar
- Pastikan backend sudah running

### 5.3 Test Frontend User

1. Buka: `https://your-user.vercel.app`
2. Coba **Lihat Berita**
3. Coba **Search**
4. Coba **Baca Artikel Detail**

**Jika ada CORS error:**
- Pastikan `CORS_ORIGIN` di Railway sudah include URL Vercel
- Pastikan format benar (tanpa quotes, tanpa spasi)

---

## 📋 Checklist Final

- [ ] Backend status: **Active** ✅
- [ ] Backend API bisa diakses
- [ ] Frontend Admin sudah deploy
- [ ] Frontend User sudah deploy
- [ ] `CORS_ORIGIN` sudah di-update
- [ ] Admin bisa login
- [ ] Admin bisa create article
- [ ] User bisa lihat berita
- [ ] Upload gambar berfungsi

---

## 🎉 Selesai!

Aplikasi sudah live dan siap digunakan!

**URLs:**
- **Backend:** `https://your-backend.railway.app`
- **Admin:** `https://your-admin.vercel.app`
- **User:** `https://your-user.vercel.app`

---

## 🔄 Auto Deploy

Setelah setup pertama kali:
- **Railway:** Auto deploy setiap push ke main branch
- **Vercel:** Auto deploy setiap push ke main branch

Tidak perlu manual deploy lagi! 🚀

---

## 🆘 Troubleshooting

### Frontend tidak bisa call API

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solusi:**
1. Pastikan `CORS_ORIGIN` di Railway sudah include URL Vercel
2. Format: `https://admin.vercel.app,https://user.vercel.app` (tanpa spasi)
3. Restart service di Railway

### Frontend build error

**Error:** `VITE_API_URL is not defined`

**Solusi:**
1. Pastikan environment variable `VITE_API_URL` sudah di-set di Vercel
2. Pastikan value benar (dengan `https://`)
3. Redeploy project

### Admin tidak bisa login

**Error:** `401 Unauthorized` atau `Network Error`

**Solusi:**
1. Check `VITE_API_URL` di Vercel
2. Pastikan backend sudah running
3. Test API endpoint langsung di browser
4. Check browser console untuk error detail

---

**Selamat! Aplikasi sudah live! 🎊**

