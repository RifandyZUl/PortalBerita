# 🔧 Fix Environment Variable di Vercel - Masih Pakai Localhost

## Masalah
Frontend masih menggunakan `localhost:5000` meskipun sudah di-deploy di Vercel.

## Penyebab
Environment variable `VITE_API_URL` tidak terbaca saat build karena:
1. Belum di-set di Vercel
2. Sudah di-set tapi belum redeploy
3. Build cache masih menggunakan kode lama

## Solusi Step-by-Step

### Step 1: Set Environment Variable di Vercel

1. **Buka Vercel Dashboard**
   - Login ke https://vercel.com
   - Pilih project **frontend-admin** (bukan frontend-user!)

2. **Buka Settings → Environment Variables**
   - Klik tab **"Settings"**
   - Scroll ke **"Environment Variables"** di sidebar kiri
   - Atau langsung: https://vercel.com/[your-username]/[project-name]/settings/environment-variables

3. **Tambahkan Environment Variable**
   - Klik **"Add New"** atau **"Add Another"**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://portalberitaa.up.railway.app`
   - ⚠️ **PENTING**: 
     - Harus pakai `https://` (bukan `http://`)
     - Jangan ada trailing slash `/` di akhir
     - Jangan ada spasi di awal/akhir
   
4. **Pilih Environment**
   - Centang: **Production**, **Preview**, **Development**
   - Atau minimal centang **Production**

5. **Klik "Save"**

### Step 2: Redeploy (PENTING!)

**Environment variable hanya terbaca saat build**, jadi harus redeploy:

#### Opsi A: Via Dashboard (Paling Mudah)
1. Buka tab **"Deployments"**
2. Cari deployment terbaru
3. Klik **"..."** (three dots) di kanan
4. Pilih **"Redeploy"**
5. Pastikan **"Use existing Build Cache"** **TIDAK** dicentang (atau centang untuk build lebih cepat, tapi pastikan env var sudah di-set)
6. Klik **"Redeploy"**

#### Opsi B: Via Git Push
```bash
# Buat commit kosong untuk trigger redeploy
git commit --allow-empty -m "Redeploy: Set VITE_API_URL"
git push origin main
```

### Step 3: Verify Environment Variable

Setelah redeploy selesai:

1. **Buka frontend admin di browser**
2. **Buka Browser Console** (F12)
3. **Cari log**:
   ```
   🔗 API Base URL: https://portalberitaa.up.railway.app
   🔗 VITE_API_URL env: https://portalberitaa.up.railway.app
   ```

**Jika masih muncul `localhost:5000`**:
- Environment variable belum di-set
- Belum redeploy
- Build cache masih pakai kode lama

**Solusi**: 
- Pastikan env var sudah di-set
- Redeploy lagi dengan **"Use existing Build Cache"** **TIDAK** dicentang

## Troubleshooting

### Masih Error `ERR_CONNECTION_REFUSED` ke localhost

**Kemungkinan**:
1. Environment variable belum di-set
2. Belum redeploy setelah set env var
3. Set di project yang salah (frontend-user bukan frontend-admin)

**Solusi**:
1. Double-check env var di Vercel dashboard
2. Pastikan set di project **frontend-admin**
3. Redeploy dengan clear cache

### Environment Variable `undefined` di Console

**Kemungkinan**:
- Env var belum di-set
- Belum redeploy
- Salah project

**Solusi**:
1. Cek env var di Vercel
2. Redeploy
3. Clear browser cache (Ctrl+Shift+R)

### Build Error

**Kemungkinan**:
- Format env var salah
- Ada karakter khusus

**Solusi**:
- Pastikan value: `https://portalberitaa.up.railway.app` (tanpa quote, tanpa trailing slash)

## Checklist

- [ ] Environment variable `VITE_API_URL` sudah di-set di Vercel (project frontend-admin)
- [ ] Value: `https://portalberitaa.up.railway.app` (tanpa trailing slash)
- [ ] Sudah centang Production, Preview, Development
- [ ] Sudah klik Save
- [ ] Sudah redeploy (dengan clear cache)
- [ ] Browser console menunjukkan URL Railway (bukan localhost)

## Quick Test

Setelah semua langkah, test login:
1. Buka frontend admin di Vercel
2. Buka Browser Console (F12)
3. Cek log `🔗 API Base URL:` - harus Railway URL
4. Coba login
5. Harus tidak ada error `ERR_CONNECTION_REFUSED`

