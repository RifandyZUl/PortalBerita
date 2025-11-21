# 🔧 Fix ERR_CONNECTION_REFUSED - Login Masih Pakai Localhost

## Masalah
Error `ERR_CONNECTION_REFUSED` ke `localhost:5000` saat login admin.

## Penyebab
Frontend admin masih menggunakan `localhost:5000` karena:
1. **Environment variable `VITE_API_URL` belum di-set** di Vercel
2. **Belum redeploy** setelah set environment variable
3. **Masih running di localhost** (bukan di Vercel)

## Solusi

### Jika Deploy di Vercel:

#### 1. Set Environment Variable di Vercel

1. Buka **Vercel Dashboard** → Project **frontend-admin** (bukan frontend-user)
2. Buka **Settings** → **Environment Variables**
3. Tambahkan/Edit:
   ```
   Key: VITE_API_URL
   Value: https://portalberitaa.up.railway.app
   ```
   ⚠️ **PENTING**: 
   - Harus pakai `https://` (bukan `http://`)
   - Jangan ada trailing slash `/` di akhir
   - Pastikan untuk **Production**, **Preview**, dan **Development**

4. **Klik Save**

#### 2. Redeploy Frontend Admin

**Opsi A: Via Dashboard**
- Buka **Deployments** tab
- Klik **"..."** (three dots) pada deployment terbaru
- Pilih **"Redeploy"**

**Opsi B: Via Git Push**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

#### 3. Verify Environment Variable

Setelah redeploy, buka browser console di frontend admin:
```javascript
// Di browser console, jalankan:
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
```

Harus muncul: `https://portalberitaa.up.railway.app`

Jika muncul `undefined`, berarti:
- Environment variable belum di-set
- Perlu redeploy lagi

### Jika Masih Running di Localhost:

#### Opsi 1: Set Environment Variable di Local

Buat file `.env` di folder `frontend`:
```env
VITE_API_URL=https://portalberitaa.up.railway.app
```

Lalu restart dev server:
```bash
cd frontend
npm run dev
```

#### Opsi 2: Jalankan Backend di Localhost

Jika ingin tetap pakai localhost:
```bash
cd backend
npm run dev
```

Pastikan backend running di `http://localhost:5000`

## Debug

Setelah update kode, cek browser console:
- Harus muncul: `🔗 API Base URL: https://portalberitaa.up.railway.app`
- Jika masih muncul `http://localhost:5000`, berarti env var belum di-set atau belum redeploy

## Checklist

- [ ] `VITE_API_URL` sudah di-set di Vercel (frontend-admin)
- [ ] Sudah redeploy setelah set env var
- [ ] Browser console menunjukkan URL yang benar (bukan localhost)
- [ ] Backend running di Railway (cek Railway dashboard)

## Troubleshooting

### Masih Error `ERR_CONNECTION_REFUSED`
→ **Kemungkinan**: 
- Environment variable belum di-set
- Belum redeploy
- Build cache masih pakai kode lama

**Solusi**:
1. Cek env var di Vercel dashboard
2. Redeploy ulang
3. Clear browser cache (Ctrl+Shift+R)

### Error "CORS policy"
→ **Kemungkinan**: CORS tidak allow frontend URL

**Solusi**:
1. Set `CORS_ORIGIN` di Railway dengan frontend URL
2. Redeploy backend

### Environment Variable `undefined` di Console
→ **Kemungkinan**: 
- Env var belum di-set
- Belum redeploy
- Salah project (set di frontend-user bukan frontend-admin)

**Solusi**:
1. Pastikan set di project yang benar (frontend-admin)
2. Redeploy
3. Cek lagi di console

