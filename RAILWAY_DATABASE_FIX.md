# 🔧 Fix Railway Database Connection Error

## ❌ Error yang Terjadi

```
[ENV] production | DB: undefined
✅ PostgreSQL connected
❌ Failed to start server: ConnectionRefusedError [SequelizeConnectionRefusedError]
code: 'ECONNREFUSED'
```

## 🔍 Root Cause

1. **DATABASE_URL tidak terbaca** - `DB: undefined` menunjukkan `DB_NAME` tidak ada
2. **DATABASE_URL menggunakan internal URL** - `postgres.railway.internal` tidak bisa diakses dari service lain
3. **Ada dua instance Sequelize** - `config/db.js` dan `models/index.js` membuat instance berbeda

---

## ✅ Solusi

### Step 1: Dapatkan DATABASE_URL yang Benar dari Railway

1. **Klik service Postgres** di sidebar kiri Railway
2. **Klik tab "Variables"**
3. **Cari `DATABASE_URL`**
4. **Klik icon mata (👁️)** untuk reveal value
5. **Copy PUBLIC URL** (bukan internal URL)

**Format yang BENAR:**
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

**Format yang SALAH (jangan pakai ini):**
```
postgresql://postgres:password@postgres.railway.internal:5432/railway
```

### Step 2: Update Environment Variables di Railway

1. **Klik service PortalBerita**
2. **Klik tab "Variables"**
3. **Klik "{ } Raw Editor"**
4. **Update format (TANPA QUOTES):**

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@containers-us-west-xxx.railway.app:5432/railway
JWT_SECRET=cd3d09db0da2f3e60a19323fae877b12a62a66d560968798a7a005798faf7b0e
CLOUDINARY_CLOUD_NAME=dm8wehn4a
CLOUDINARY_API_KEY=165127524344634
CLOUDINARY_API_SECRET=p8TF5hs-XrwHV1jhxu0g8Y0VYXg
CORS_ORIGIN=https://portal-berita-9p4n.vercel.app,https://portal-berita-t9ye.vercel.app
```

**PENTING:**
- ❌ Jangan pakai quotes
- ❌ Jangan pakai `postgres.railway.internal`
- ✅ Pakai public URL dari Postgres service
- ✅ Ganti `YOUR_PASSWORD` dengan password dari DATABASE_URL yang di-copy

### Step 3: Update Code (Sudah dilakukan)

Code sudah di-update untuk:
- ✅ Support DATABASE_URL di `models/index.js`
- ✅ Menggunakan satu instance Sequelize
- ✅ Support SSL untuk production

### Step 4: Deploy Ulang

1. **Commit dan push perubahan code** (jika ada)
2. **Railway akan otomatis redeploy**
3. **Atau klik "Restart"** di tab Deployments

---

## 🔍 Verifikasi

### Check Logs:

Setelah restart, logs harus menunjukkan:

```
[ENV] production | DB: railway
✅ PostgreSQL connected
✅ Semua tabel disinkronisasi dengan database
✅ Server running at http://localhost:5000
```

**TIDAK boleh ada:**
- ❌ `DB: undefined`
- ❌ `ECONNREFUSED`
- ❌ `ConnectionRefusedError`

### Test API:

Buka Domain URL di browser:
```
https://your-domain.railway.app/api/dashboard
```

Harus return JSON response (bukan error).

---

## 🚨 Masalah Umum

### 1. DATABASE_URL masih undefined

**Penyebab:**
- Variable belum di-set di Railway
- Format salah (pakai quotes)
- Copy dari template bukan actual value

**Solusi:**
- Pastikan `DATABASE_URL` sudah di-set di Variables
- Copy langsung dari Postgres service (bukan template)
- Tanpa quotes

### 2. ECONNREFUSED Error

**Penyebab:**
- DATABASE_URL menggunakan internal URL (`.internal`)
- Database belum ready
- Password salah

**Solusi:**
- Gunakan public URL dari Postgres service
- Pastikan database sudah running (green checkmark)
- Copy DATABASE_URL lengkap dari Postgres Variables

### 3. DB: undefined di Logs

**Penyebab:**
- `DB_NAME` tidak di-set (tidak masalah jika pakai DATABASE_URL)
- DATABASE_URL tidak terbaca

**Solusi:**
- Pastikan `DATABASE_URL` sudah di-set
- Code sudah di-update untuk handle DATABASE_URL
- Log akan show database name dari DATABASE_URL

---

## 📝 Checklist Final

- [ ] DATABASE_URL di-set di Railway Variables (tanpa quotes)
- [ ] DATABASE_URL menggunakan public URL (bukan `.internal`)
- [ ] Semua variables tanpa quotes
- [ ] Code sudah di-update (commit & push)
- [ ] Service restart
- [ ] Logs menunjukkan `✅ PostgreSQL connected`
- [ ] API endpoint bisa diakses

---

**Setelah fix, service akan berjalan dengan baik! ✅**

