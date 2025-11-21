# 🔧 Fix 404 Error - API Not Found

## Masalah
Error 404 saat memanggil `/api/news/public/list` dari frontend yang di-deploy di Vercel.

## Penyebab
1. **VITE_API_URL tidak di-set** di Vercel
2. **VITE_API_URL salah format** (tanpa `https://` atau URL salah)
3. **Backend tidak running** di Railway
4. **CORS tidak allow** frontend URL

## Solusi

### 1. ✅ Set Environment Variable di Vercel (Frontend User)

1. Buka **Vercel Dashboard** → Pilih project **frontend-user**
2. Buka **Settings** → **Environment Variables**
3. Tambahkan:
   ```
   VITE_API_URL=https://portalberitaa.up.railway.app
   ```
   ⚠️ **PENTING**: 
   - Harus pakai `https://` (bukan `http://`)
   - Jangan ada trailing slash (`/`) di akhir
   - Pastikan URL Railway backend Anda benar

4. **Redeploy** setelah set environment variable:
   - Klik **Deployments** → **Redeploy** (atau push commit baru)

### 2. ✅ Cek Backend Running di Railway

1. Buka **Railway Dashboard** → Pilih project backend
2. Cek **Deployments** → Pastikan status **Active** (hijau)
3. Cek **Logs** → Pastikan tidak ada error
4. Test endpoint manual:
   ```bash
   curl https://portalberitaa.up.railway.app/api/news/public/list
   ```
   Atau buka di browser: `https://portalberitaa.up.railway.app/api/news/public/list`

### 3. ✅ Cek CORS Configuration di Backend

Pastikan `CORS_ORIGIN` di Railway sudah include frontend URL:

1. Buka **Railway Dashboard** → Backend service → **Variables**
2. Cek `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
   ```
   (Ganti dengan URL Vercel Anda yang sebenarnya)

3. Jika belum ada, tambahkan:
   - **Key**: `CORS_ORIGIN`
   - **Value**: `https://your-frontend.vercel.app,https://your-admin.vercel.app`

4. **Redeploy** backend setelah set CORS

### 4. ✅ Test API Endpoint Langsung

Test apakah endpoint bisa diakses:

```bash
# Test endpoint public list
curl https://portalberitaa.up.railway.app/api/news/public/list

# Test dengan limit
curl https://portalberitaa.up.railway.app/api/news/public/list?limit=10

# Test dengan category
curl https://portalberitaa.up.railway.app/api/news/public/list?category=Nasional&limit=10
```

**Expected Response** (200 OK):
```json
{
  "message": "Berhasil mengambil berita untuk user.",
  "data": [...]
}
```

Jika dapat 404, berarti:
- Route tidak terdaftar
- Backend tidak running
- URL salah

### 5. ✅ Debug di Browser Console

Setelah set `VITE_API_URL`, cek di browser console:

```javascript
// Di browser console, jalankan:
console.log('API URL:', import.meta.env.VITE_API_URL);
```

Harus muncul: `https://portalberitaa.up.railway.app`

Jika muncul `undefined`, berarti:
- Environment variable belum di-set
- Perlu redeploy setelah set env var

## Checklist

- [ ] `VITE_API_URL` sudah di-set di Vercel (frontend-user)
- [ ] Format URL benar: `https://portalberitaa.up.railway.app` (dengan https, tanpa trailing slash)
- [ ] Sudah redeploy frontend setelah set env var
- [ ] Backend running di Railway (status Active)
- [ ] `CORS_ORIGIN` di Railway sudah include frontend URL
- [ ] Test endpoint langsung di browser/curl berhasil (200 OK)

## Troubleshooting

### Error: "Failed to load resource: 404"
→ **Kemungkinan**: 
- `VITE_API_URL` tidak di-set atau salah
- Backend tidak running
- Route tidak terdaftar

**Solusi**:
1. Cek `VITE_API_URL` di Vercel
2. Cek backend logs di Railway
3. Test endpoint langsung

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
→ **Kemungkinan**: CORS tidak allow frontend URL

**Solusi**:
1. Set `CORS_ORIGIN` di Railway dengan frontend URL
2. Redeploy backend

### Error: "Network Error" atau "ERR_CONNECTION_REFUSED"
→ **Kemungkinan**: Backend tidak running atau URL salah

**Solusi**:
1. Cek Railway dashboard → Pastikan backend Active
2. Cek Railway logs untuk error
3. Pastikan URL benar (dengan https)

## Quick Fix

1. **Set VITE_API_URL di Vercel**:
   ```
   VITE_API_URL=https://portalberitaa.up.railway.app
   ```

2. **Set CORS_ORIGIN di Railway**:
   ```
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

3. **Redeploy kedua-duanya**

4. **Test**: Buka frontend di browser, cek Network tab

