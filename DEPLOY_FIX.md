# 🚀 Deploy Fix - Auto-detect Production URL

## Perubahan yang Sudah Dibuat

Kode sudah di-update untuk **auto-detect production** dan langsung pakai Railway URL jika:
- Environment variable `VITE_API_URL` sudah di-set, ATAU
- Running di Vercel (hostname contains `vercel.app`)

## Langkah Deploy

### 1. Commit dan Push Perubahan

```bash
# Pastikan di root project
cd C:\Magang\PortalBerita

# Add perubahan
git add frontend/src/api/auth.js

# Commit
git commit -m "Fix: Auto-detect production URL for API calls"

# Push ke GitHub
git push origin main
```

### 2. Tunggu Vercel Auto-deploy

Vercel akan otomatis detect push dan deploy. Atau:

1. Buka **Vercel Dashboard** → Project **frontend-admin**
2. Buka tab **"Deployments"**
3. Tunggu deployment baru muncul (atau trigger manual)

### 3. Verify Setelah Deploy

Setelah deploy selesai:

1. **Buka frontend admin di browser**
2. **Buka Browser Console** (F12)
3. **Cari log**:
   ```
   🔗 API Base URL: https://portalberitaa.up.railway.app
   🔗 Hostname: portal-berita-admin.vercel.app
   ```

**Harus muncul Railway URL**, bukan localhost!

### 4. Test Login

Coba login dengan:
- Username/Email: `admins`
- Password: `admins12345`

**Harus tidak ada error `ERR_CONNECTION_REFUSED`!**

## Jika Masih Error

### Cek Browser Console

Setelah deploy, buka console dan cek:
- `🔗 API Base URL:` harus `https://portalberitaa.up.railway.app`
- `🔗 Hostname:` harus mengandung `vercel.app`

Jika masih `localhost:5000`:
- Build cache masih pakai kode lama
- Redeploy dengan **clear cache**

### Clear Build Cache di Vercel

1. Buka **Deployments** tab
2. Klik **"..."** pada deployment terbaru
3. Pilih **"Redeploy"**
4. **JANGAN centang** "Use existing Build Cache"
5. Klik **"Redeploy"**

## Alternatif: Set Environment Variable

Jika auto-detect tidak bekerja, tetap set environment variable:

1. **Vercel Dashboard** → Project **frontend-admin**
2. **Settings** → **Environment Variables**
3. Tambahkan:
   - Key: `VITE_API_URL`
   - Value: `https://portalberitaa.up.railway.app`
4. **Save** dan **Redeploy**

## Quick Test

Setelah deploy, test di browser console:
```javascript
// Harus muncul Railway URL
console.log('Base URL:', import.meta.env.VITE_API_URL || 'https://portalberitaa.up.railway.app');
```

