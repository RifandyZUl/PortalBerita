# 🔍 Debug Login Error - "Login gagal. Silakan coba lagi."

## Langkah Debug

### 1. Cek Browser Console

Buka **Browser Console** (F12 atau Right Click → Inspect → Console tab) dan cari:
- Error message detail
- Log `🔗 API Base URL:` - harus muncul URL Railway
- Log `🔗 Login URL:` - harus muncul full URL
- Error response dari server

### 2. Cek Network Tab

1. Buka **Network tab** (F12 → Network)
2. Coba login lagi
3. Cari request ke `/api/auth/login`
4. Klik request tersebut
5. Cek:
   - **Status Code**: 200, 401, 404, 500?
   - **Request URL**: Harus ke Railway, bukan localhost
   - **Response**: Apa pesan error dari server?

### 3. Kemungkinan Error

#### Error 401 - Unauthorized
**Penyebab**: 
- Username/email tidak ditemukan
- Password salah

**Solusi**:
- Pastikan username/email benar (cek di database)
- Pastikan password benar (sudah verify hash)

#### Error 404 - Not Found
**Penyebab**: 
- Route tidak ditemukan
- URL salah

**Solusi**:
- Pastikan backend running di Railway
- Test endpoint langsung: `https://portalberitaa.up.railway.app/api/auth/login`

#### Error 500 - Internal Server Error
**Penyebab**: 
- Error di backend
- Database connection issue

**Solusi**:
- Cek Railway logs untuk error detail
- Pastikan database connected

#### Error CORS
**Penyebab**: 
- CORS_ORIGIN tidak include frontend URL

**Solusi**:
- Set `CORS_ORIGIN` di Railway dengan frontend URL

#### Network Error / Connection Refused
**Penyebab**: 
- Backend tidak running
- URL salah

**Solusi**:
- Cek Railway dashboard - pastikan backend Active
- Test endpoint langsung di browser

## Test Endpoint Langsung

Buka di browser atau curl:
```
https://portalberitaa.up.railway.app/api/auth/login
```

**Expected**: 
- Jika GET: Error method not allowed (normal)
- Jika POST dengan body: Response dengan token atau error message

## Cek Database

Pastikan admin ada di database dengan:
- Username: `admins` (atau email yang digunakan)
- Password hash: `$2b$10$1YoJF8g..RcWGz1ekt4Xye114g5vcgNHbzFWErxiNW8KaN/JQhb8i`
- Password plain: `admins12345`

## Cek Railway Logs

1. Buka Railway Dashboard
2. Pilih Backend service
3. Buka **Logs** tab
4. Coba login lagi
5. Lihat error di logs

## Quick Test

Jalankan di terminal untuk test endpoint:
```bash
curl -X POST https://portalberitaa.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"admins","password":"admins12345"}'
```

**Expected Response** (200 OK):
```json
{
  "message": "Login berhasil.",
  "data": {
    "token": "..."
  }
}
```

**Error Response** (401):
```json
{
  "message": "Email atau username tidak ditemukan.",
  "data": null
}
```
atau
```json
{
  "message": "Password salah.",
  "data": null
}
```

