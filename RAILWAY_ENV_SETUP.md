# 🚂 Railway Environment Variables Setup

Format yang benar untuk environment variables di Railway.

## ✅ Format yang Benar

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:password@hostname:5432/dbname
JWT_SECRET=your-actual-32-character-secret-key-here
CLOUDINARY_CLOUD_NAME=dm8wehn4a
CLOUDINARY_API_KEY=165127524344634
CLOUDINARY_API_SECRET=p8TF5hs-XrwHVljhxuOg8Y0VYXg
CORS_ORIGIN=https://your-admin.vercel.app,https://your-user.vercel.app
```

## 📝 Penjelasan Setiap Variable

### 1. NODE_ENV
```env
NODE_ENV=production
```
- **TIDAK pakai quotes** (`"production"` ❌)
- Langsung: `production` ✅

### 2. PORT
```env
PORT=5000
```
- Railway biasanya auto-set, tapi bisa manual set

### 3. DATABASE_URL
```env
DATABASE_URL=postgresql://postgres:password@hostname:5432/dbname
```

**Cara mendapatkan DATABASE_URL di Railway:**

1. Di Railway dashboard, klik database PostgreSQL yang sudah dibuat
2. Masuk ke tab **"Variables"**
3. Copy value dari **`DATABASE_URL`** atau **`POSTGRES_URL`**
4. Format akan seperti: `postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway`

**ATAU** Railway otomatis inject sebagai `${{ Postgres.DATABASE_URL }}`, tapi lebih baik copy langsung connection string-nya.

### 4. JWT_SECRET
```env
JWT_SECRET=your-actual-32-character-secret-key-here
```

**Generate JWT_SECRET:**

**Option 1: Via Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Via Online Generator**
- Kunjungi: https://randomkeygen.com/
- Pilih "CodeIgniter Encryption Keys"
- Copy salah satu key (minimal 32 karakter)

**Contoh hasil:**
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### 5. Cloudinary Variables
```env
CLOUDINARY_CLOUD_NAME=dm8wehn4a
CLOUDINARY_API_KEY=165127524344634
CLOUDINARY_API_SECRET=p8TF5hs-XrwHVljhxuOg8Y0VYXg
```
✅ Sudah benar, langsung paste values-nya

### 6. CORS_ORIGIN
```env
CORS_ORIGIN=https://your-admin.vercel.app,https://your-user.vercel.app
```

**Ganti dengan URL Vercel yang sebenarnya:**
- Setelah deploy frontend admin di Vercel, copy URL-nya
- Setelah deploy frontend user di Vercel, copy URL-nya
- Gabungkan dengan comma (tanpa spasi)

**Contoh:**
```env
CORS_ORIGIN=https://portal-berita-admin.vercel.app,https://portal-berita-user.vercel.app
```

---

## 🚨 Common Mistakes

### ❌ SALAH:
```env
NODE_ENV="production"          # Jangan pakai quotes
DATABASE_URL=<${{ Postgres.DATABASE_URL }}>  # Jangan pakai < >
JWT_SECRET=<generate-random-32-char-string>  # Harus actual value
CORS_ORIGIN=https://your-admin.vercel.app, https://your-user.vercel.app  # Jangan ada spasi setelah comma
```

### ✅ BENAR:
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:pass@host:5432/db
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
CORS_ORIGIN=https://admin.vercel.app,https://user.vercel.app
```

---

## 📋 Step-by-Step Setup di Railway

### Step 1: Buka Railway Dashboard
1. Login ke https://railway.app
2. Pilih project backend

### Step 2: Buka Variables Tab
1. Klik tab **"Variables"** di sidebar
2. Klik **"New Variable"**

### Step 3: Tambahkan Variables Satu per Satu

**Variable 1:**
- Key: `NODE_ENV`
- Value: `production`
- Klik "Add"

**Variable 2:**
- Key: `PORT`
- Value: `5000`
- Klik "Add"

**Variable 3: DATABASE_URL**
- Klik database PostgreSQL di sidebar
- Masuk ke tab "Variables"
- Copy value dari `DATABASE_URL` atau `POSTGRES_URL`
- Kembali ke service backend
- Key: `DATABASE_URL`
- Value: `paste-connection-string-di-sini`
- Klik "Add"

**Variable 4: JWT_SECRET**
- Generate dulu dengan command:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Key: `JWT_SECRET`
- Value: `paste-generated-secret-di-sini`
- Klik "Add"

**Variable 5-7: Cloudinary**
- Key: `CLOUDINARY_CLOUD_NAME`
- Value: `dm8wehn4a`
- Klik "Add"

- Key: `CLOUDINARY_API_KEY`
- Value: `165127524344634`
- Klik "Add"

- Key: `CLOUDINARY_API_SECRET`
- Value: `p8TF5hs-XrwHVljhxuOg8Y0VYXg`
- Klik "Add"

**Variable 8: CORS_ORIGIN**
- Setelah deploy frontend, update dengan URL sebenarnya
- Key: `CORS_ORIGIN`
- Value: `https://admin-url.vercel.app,https://user-url.vercel.app`
- Klik "Add"

---

## ✅ Checklist

- [ ] NODE_ENV = production (tanpa quotes)
- [ ] PORT = 5000
- [ ] DATABASE_URL = connection string lengkap dari Railway database
- [ ] JWT_SECRET = random 32+ character string (sudah di-generate)
- [ ] CLOUDINARY_CLOUD_NAME = dm8wehn4a
- [ ] CLOUDINARY_API_KEY = 165127524344634
- [ ] CLOUDINARY_API_SECRET = p8TF5hs-XrwHVljhxuOg8Y0VYXg
- [ ] CORS_ORIGIN = URL Vercel admin dan user (dipisah comma, tanpa spasi)

---

## 🔄 Setelah Setup

1. Railway akan otomatis restart service
2. Check logs untuk memastikan tidak ada error
3. Test API endpoint: `https://your-backend.railway.app/api/dashboard`

---

## 🆘 Troubleshooting

### Error: "Unable to connect to PostgreSQL"
- Pastikan `DATABASE_URL` benar (copy langsung dari Railway database variables)
- Pastikan format: `postgresql://user:pass@host:port/dbname`

### Error: "Not allowed by CORS"
- Pastikan `CORS_ORIGIN` sudah diisi dengan URL Vercel yang benar
- Pastikan tidak ada spasi setelah comma
- Pastikan URL menggunakan `https://` (bukan `http://`)

### Error: "JWT_SECRET must be set"
- Pastikan `JWT_SECRET` sudah diisi dengan actual value (bukan placeholder)
- Pastikan minimal 32 karakter

---

**Selamat Setup! 🚀**

