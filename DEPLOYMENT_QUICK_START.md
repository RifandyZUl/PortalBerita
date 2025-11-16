# 🚀 Quick Start Deployment Guide

Panduan cepat untuk deploy Portal Berita dalam 15 menit.

## Prerequisites

- GitHub account
- Railway account (untuk backend) - https://railway.app
- Vercel account (untuk frontend) - https://vercel.com
- Cloudinary account (untuk upload gambar) - https://cloudinary.com

---

## Step 1: Deploy Backend ke Railway (5 menit)

### 1.1 Setup Railway

1. Buka https://railway.app
2. Login dengan GitHub
3. Klik "New Project" → "Deploy from GitHub repo"
4. Pilih repository Portal Berita

### 1.2 Configure Backend

1. Set **Root Directory**: `backend`
2. Railway akan otomatis detect Node.js

### 1.3 Add PostgreSQL Database

1. Di Railway dashboard, klik "New" → "Database" → "PostgreSQL"
2. Railway akan otomatis membuat database
3. Copy **Postgres Connection URL** dari database settings

### 1.4 Setup Environment Variables

Di Railway project settings → Variables, tambahkan:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<paste-connection-url-dari-railway>
JWT_SECRET=<generate-random-32-char-string>
CLOUDINARY_CLOUD_NAME=<dari-cloudinary>
CLOUDINARY_API_KEY=<dari-cloudinary>
CLOUDINARY_API_SECRET=<dari-cloudinary>
CORS_ORIGIN=https://your-admin.vercel.app,https://your-user.vercel.app
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.5 Deploy

Railway akan otomatis deploy. Tunggu sampai selesai, lalu copy **Domain URL** (contoh: `your-app.railway.app`)

---

## Step 2: Deploy Frontend Admin ke Vercel (5 menit)

### 2.1 Setup Vercel

1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik "Add New" → "Project"
4. Import repository Portal Berita

### 2.2 Configure Frontend Admin

1. Set **Root Directory**: `frontend`
2. Set **Framework Preset**: Vite
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`

### 2.3 Add Environment Variable

Di Environment Variables, tambahkan:

```env
VITE_API_URL=https://your-backend.railway.app
```

(Ganti dengan Railway backend URL dari Step 1.5)

### 2.4 Deploy

Klik "Deploy". Vercel akan otomatis build dan deploy.

Copy **Deployment URL** (contoh: `your-admin.vercel.app`)

---

## Step 3: Deploy Frontend User ke Vercel (5 menit)

### 3.1 Create New Project

1. Di Vercel dashboard, klik "Add New" → "Project"
2. Import repository yang sama (Portal Berita)

### 3.2 Configure Frontend User

1. Set **Root Directory**: `frontend-user`
2. Set **Framework Preset**: Vite
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`

### 3.3 Add Environment Variable

```env
VITE_API_URL=https://your-backend.railway.app
```

(Sama dengan backend URL)

### 3.4 Deploy

Klik "Deploy". Copy **Deployment URL** (contoh: `your-user.vercel.app`)

---

## Step 4: Update CORS di Backend

1. Kembali ke Railway dashboard
2. Update environment variable `CORS_ORIGIN`:

```env
CORS_ORIGIN=https://your-admin.vercel.app,https://your-user.vercel.app
```

(Ganti dengan URL Vercel dari Step 2.4 dan 3.4)

3. Railway akan otomatis restart dengan config baru

---

## Step 5: Setup Database

### 5.1 Connect ke Database

Gunakan Railway database connection string atau connect via psql:

```bash
psql <DATABASE_URL>
```

### 5.2 Run Migrations (jika ada)

```bash
cd backend
npx sequelize-cli db:migrate
```

Atau jika menggunakan auto-sync (sudah ada di index.js), aplikasi akan otomatis sync tables saat pertama kali start.

### 5.3 Create Admin User (opsional)

Jika perlu create admin user pertama kali, bisa via database atau buat script seed.

---

## ✅ Testing

1. **Test Backend API:**
   ```
   https://your-backend.railway.app/api/dashboard
   ```

2. **Test Frontend Admin:**
   ```
   https://your-admin.vercel.app
   ```
   - Coba login
   - Coba create article

3. **Test Frontend User:**
   ```
   https://your-user.vercel.app
   ```
   - Coba lihat berita
   - Coba search

---

## 🔧 Troubleshooting

### Backend tidak bisa connect database
- Pastikan `DATABASE_URL` benar
- Pastikan database sudah dibuat di Railway

### CORS Error
- Pastikan `CORS_ORIGIN` di Railway sudah include semua frontend URLs
- Pastikan tidak ada typo di URL

### Frontend tidak bisa call API
- Pastikan `VITE_API_URL` benar
- Pastikan backend sudah running
- Check browser console untuk error detail

### Build Error
- Check build logs di Vercel
- Pastikan semua dependencies terinstall
- Pastikan Node.js version sesuai

---

## 📝 Environment Variables Summary

### Backend (Railway):
- `NODE_ENV=production`
- `PORT=5000`
- `DATABASE_URL=<railway-postgres-url>`
- `JWT_SECRET=<random-32-char>`
- `CLOUDINARY_CLOUD_NAME=<your-cloud-name>`
- `CLOUDINARY_API_KEY=<your-api-key>`
- `CLOUDINARY_API_SECRET=<your-api-secret>`
- `CORS_ORIGIN=<admin-url>,<user-url>`

### Frontend Admin (Vercel):
- `VITE_API_URL=<railway-backend-url>`

### Frontend User (Vercel):
- `VITE_API_URL=<railway-backend-url>`

---

## 🎉 Done!

Aplikasi sudah live! 

- Backend: `https://your-backend.railway.app`
- Admin: `https://your-admin.vercel.app`
- User: `https://your-user.vercel.app`

---

## 🔄 Auto Deploy

Setelah setup pertama kali:
- **Railway**: Auto deploy setiap push ke main branch
- **Vercel**: Auto deploy setiap push ke main branch

Tidak perlu manual deploy lagi! 🚀

