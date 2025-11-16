# 🔧 Railway Troubleshooting Guide

Panduan untuk troubleshoot masalah deployment di Railway.

## ✅ Status Deployment

Dari screenshot, deployment terbaru sudah **ACTIVE** dan **successful**. Tapi jika ada masalah, ikuti langkah berikut:

---

## 🔍 Step 1: Check Logs

### Cara Check Logs di Railway:

1. Di Railway dashboard, klik service **PortalBerita**
2. Klik tab **"Logs"** di bagian atas
3. Scroll ke bawah untuk melihat log terbaru

### Log yang Harus Muncul (Jika Berhasil):

```
✅ PostgreSQL connected
✅ Semua tabel disinkronisasi dengan database
✅ Server running at http://localhost:5000
```

### Jika Ada Error:

**Error: "Unable to connect to PostgreSQL"**
- ❌ **Masalah**: Database connection gagal
- ✅ **Solusi**: 
  1. Pastikan `DATABASE_URL` sudah di-set di Variables
  2. Pastikan database PostgreSQL sudah dibuat
  3. Copy connection string dari database service (bukan template)

**Error: "JWT_SECRET must be set"**
- ❌ **Masalah**: JWT_SECRET belum di-set
- ✅ **Solusi**: Tambahkan `JWT_SECRET` di Variables dengan value yang sudah di-generate

**Error: "Not allowed by CORS"**
- ❌ **Masalah**: CORS_ORIGIN belum di-set atau salah
- ✅ **Solusi**: Set `CORS_ORIGIN` dengan URL frontend yang benar

---

## 🔍 Step 2: Verify Environment Variables

### Checklist Environment Variables:

1. Klik tab **"Variables"** di service PortalBerita
2. Pastikan semua variables berikut ada:

```
✅ NODE_ENV=production
✅ PORT=5000
✅ DATABASE_URL=postgresql://... (connection string lengkap)
✅ JWT_SECRET=... (32+ karakter)
✅ CLOUDINARY_CLOUD_NAME=dm8wehn4a
✅ CLOUDINARY_API_KEY=165127524344634
✅ CLOUDINARY_API_SECRET=p8TF5hs-XrwHVljhxuOg8Y0VYXg
✅ CORS_ORIGIN=https://admin.vercel.app,https://user.vercel.app
```

### Cara Copy DATABASE_URL dari Railway:

1. Klik service **Postgres** di sidebar kiri
2. Klik tab **"Variables"**
3. Copy value dari **`DATABASE_URL`** atau **`POSTGRES_URL`**
4. Paste ke Variables service PortalBerita

---

## 🔍 Step 3: Test API Endpoint

### Test Backend API:

1. Di Railway dashboard, klik service **PortalBerita**
2. Di bagian atas, ada **Domain URL** (contoh: `portalberita-production.up.railway.app`)
3. Copy URL tersebut
4. Test di browser atau Postman:

```
GET https://your-domain.railway.app/api/dashboard
```

### Expected Response:

**Jika berhasil:**
```json
{
  "status": "success",
  "data": {
    "totalNews": 0,
    "totalViews": 0,
    ...
  }
}
```

**Jika error:**
- Check logs untuk detail error
- Pastikan environment variables sudah benar

---

## 🔍 Step 4: Check Database Connection

### Verify Database:

1. Klik service **Postgres** di sidebar
2. Klik tab **"Connect"** atau **"Data"**
3. Railway akan memberikan connection info

### Test Connection via Railway CLI (Optional):

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Connect to database
railway connect postgres
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Deployment Failed (2 hours ago)

**Kemungkinan Penyebab:**
- Environment variables belum di-set
- Database belum dibuat
- Build error

**Solusi:**
- Deployment terbaru sudah successful, jadi masalah sudah teratasi
- Pastikan semua environment variables sudah di-set

### Issue 2: Deployment Successful tapi API tidak bisa diakses

**Kemungkinan Penyebab:**
- Port tidak exposed
- Environment variables salah
- Database connection gagal

**Solusi:**
1. Check logs untuk error detail
2. Pastikan `PORT=5000` sudah di-set
3. Pastikan `DATABASE_URL` benar
4. Test API endpoint

### Issue 3: CORS Error

**Kemungkinan Penyebab:**
- `CORS_ORIGIN` belum di-set atau salah format

**Solusi:**
1. Set `CORS_ORIGIN` dengan URL frontend yang benar
2. Format: `https://admin.vercel.app,https://user.vercel.app` (tanpa spasi)
3. Railway akan auto-restart setelah update variables

### Issue 4: Database Connection Error

**Kemungkinan Penyebab:**
- `DATABASE_URL` salah atau belum di-set
- Database belum dibuat

**Solusi:**
1. Pastikan database PostgreSQL sudah dibuat di Railway
2. Copy `DATABASE_URL` dari database service (bukan template)
3. Paste ke Variables service PortalBerita

---

## ✅ Quick Health Check

### Checklist:

- [ ] Deployment status: **ACTIVE** ✅
- [ ] Logs menunjukkan: "✅ PostgreSQL connected"
- [ ] Logs menunjukkan: "✅ Server running"
- [ ] Environment variables sudah lengkap
- [ ] API endpoint bisa diakses: `https://your-domain.railway.app/api/dashboard`
- [ ] Database connection berhasil

---

## 📝 Next Steps

Setelah backend berhasil:

1. **Copy Backend URL** dari Railway (Domain URL)
2. **Deploy Frontend Admin** ke Vercel dengan `VITE_API_URL` = backend URL
3. **Deploy Frontend User** ke Vercel dengan `VITE_API_URL` = backend URL
4. **Update CORS_ORIGIN** di Railway dengan URL Vercel

---

## 🆘 Still Having Issues?

1. **Check Logs** - Railway dashboard → PortalBerita → Logs
2. **Check Variables** - Pastikan semua environment variables sudah benar
3. **Test API** - Coba akses endpoint langsung
4. **Check Database** - Pastikan database sudah dibuat dan connected

---

**Jika masih ada masalah, share error message dari logs!** 🔍

