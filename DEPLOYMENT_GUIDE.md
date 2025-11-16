# 🚀 Panduan Deployment Portal Berita

Panduan lengkap untuk deploy aplikasi Portal Berita ke production.

## 📋 Daftar Isi

1. [Persiapan](#1-persiapan)
2. [Backend Deployment](#2-backend-deployment)
3. [Frontend Admin Deployment](#3-frontend-admin-deployment)
4. [Frontend User Deployment](#4-frontend-user-deployment)
5. [Database Setup](#5-database-setup)
6. [Environment Variables](#6-environment-variables)
7. [Platform Deployment](#7-platform-deployment)

---

## 1. Persiapan

### 1.1 Checklist Sebelum Deploy

- [ ] Semua test sudah pass
- [ ] Environment variables sudah disiapkan
- [ ] Database production sudah dibuat
- [ ] Cloudinary account sudah setup (untuk upload gambar)
- [ ] Domain sudah disiapkan (opsional)

### 1.2 Build Production

Pastikan semua aplikasi bisa di-build:

```bash
# Backend - tidak perlu build, langsung deploy
cd backend
npm install --production

# Frontend Admin
cd frontend
npm install
npm run build

# Frontend User
cd frontend-user
npm install
npm run build
```

---

## 2. Backend Deployment

### 2.1 Environment Variables Backend

Buat file `.env` di folder `backend/` dengan konfigurasi berikut:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS (sesuaikan dengan domain frontend)
CORS_ORIGIN=https://your-frontend-admin-domain.com,https://your-frontend-user-domain.com
```

### 2.2 Platform Options untuk Backend

#### Option 1: Railway (Recommended)

1. **Buat Akun Railway**
   - Kunjungi https://railway.app
   - Sign up dengan GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Deploy
   cd backend
   railway init
   railway up
   ```

3. **Setup Environment Variables**
   - Masuk ke Railway Dashboard
   - Pilih project backend
   - Masuk ke tab "Variables"
   - Tambahkan semua environment variables dari `.env`

4. **Setup Database**
   - Di Railway Dashboard, klik "New" → "Database" → "PostgreSQL"
   - Railway akan otomatis membuat database dan memberikan connection string
   - Copy connection string ke environment variable `DATABASE_URL` (jika menggunakan) atau update `DB_HOST`, `DB_NAME`, dll

5. **Setup Start Command**
   - Di Railway Dashboard, masuk ke "Settings"
   - Set "Start Command" ke: `npm start`

#### Option 2: Render

1. **Buat Akun Render**
   - Kunjungi https://render.com
   - Sign up dengan GitHub

2. **Deploy Backend**
   - Klik "New" → "Web Service"
   - Connect repository GitHub
   - Set:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Setup Environment Variables**
   - Masuk ke "Environment" tab
   - Tambahkan semua environment variables

4. **Setup Database**
   - Klik "New" → "PostgreSQL"
   - Render akan membuat database
   - Update environment variables dengan database credentials

#### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Deploy**
   ```bash
   cd backend
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

3. **Setup Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   # ... tambahkan semua env vars
   ```

---

## 3. Frontend Admin Deployment

### 3.1 Environment Variables Frontend Admin

Buat file `.env.production` di folder `frontend/`:

```env
VITE_API_URL=https://your-backend-api-url.com
```

Update `vite.config.js` jika perlu untuk handle environment variables.

### 3.2 Build Frontend Admin

```bash
cd frontend
npm install
npm run build
```

Build akan menghasilkan folder `dist/` yang berisi file production.

### 3.3 Platform Options untuk Frontend Admin

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

   Atau melalui GitHub:
   - Import project di https://vercel.com
   - Set Root Directory: `frontend`
   - Set Build Command: `npm run build`
   - Set Output Directory: `dist`
   - Add Environment Variable: `VITE_API_URL`

#### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

   Atau melalui GitHub:
   - Import project di https://netlify.com
   - Set Base directory: `frontend`
   - Set Build command: `npm run build`
   - Set Publish directory: `frontend/dist`
   - Add Environment Variable: `VITE_API_URL`

#### Option 3: GitHub Pages

1. **Update `vite.config.js`**
   ```js
   export default {
     base: '/your-repo-name/',
     // ... config lainnya
   }
   ```

2. **Deploy**
   ```bash
   cd frontend
   npm run build
   # Setup GitHub Actions untuk auto-deploy
   ```

---

## 4. Frontend User Deployment

### 4.1 Environment Variables Frontend User

Buat file `.env.production` di folder `frontend-user/`:

```env
VITE_API_URL=https://your-backend-api-url.com
```

### 4.2 Build Frontend User

```bash
cd frontend-user
npm install
npm run build
```

### 4.3 Platform Options untuk Frontend User

Sama seperti Frontend Admin, bisa menggunakan:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**

---

## 5. Database Setup

### 5.1 Setup Database Production

1. **Buat Database**
   ```sql
   CREATE DATABASE portal_berita_prod;
   ```

2. **Run Migrations** (jika menggunakan Sequelize migrations)
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   ```

3. **Seed Initial Data** (opsional)
   ```bash
   npx sequelize-cli db:seed:all
   ```

### 5.2 Database Options

- **Railway PostgreSQL** (Recommended untuk Railway)
- **Render PostgreSQL** (Recommended untuk Render)
- **Supabase** (Free tier available)
- **Neon** (Serverless PostgreSQL)
- **AWS RDS** (Untuk production besar)

---

## 6. Environment Variables

### 6.1 Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `DB_HOST` | Database host | `localhost` atau database URL |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `portal_berita_prod` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your-password` |
| `JWT_SECRET` | JWT secret key | `min-32-characters-secret-key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |
| `CORS_ORIGIN` | Allowed CORS origins | `https://admin.example.com,https://user.example.com` |

### 6.2 Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.example.com` |

**Note**: Di Vite, environment variables harus diawali dengan `VITE_` untuk bisa diakses di client-side.

---

## 7. Platform Deployment

### 7.1 Recommended Stack

**Backend:**
- Railway atau Render (mudah setup, free tier available)

**Frontend Admin:**
- Vercel (automatic deployments, free tier)

**Frontend User:**
- Vercel atau Netlify (free tier)

**Database:**
- PostgreSQL di platform yang sama dengan backend (Railway/Render) atau Supabase

### 7.2 Step-by-Step Deployment (Railway + Vercel)

#### Step 1: Deploy Backend ke Railway

1. Buat akun Railway
2. New Project → Deploy from GitHub
3. Pilih repository
4. Set Root Directory: `backend`
5. Add Environment Variables
6. Add PostgreSQL Database
7. Deploy

#### Step 2: Deploy Frontend Admin ke Vercel

1. Buat akun Vercel
2. Import Project → GitHub
3. Set Root Directory: `frontend`
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Add Environment Variable: `VITE_API_URL` = Railway backend URL
7. Deploy

#### Step 3: Deploy Frontend User ke Vercel

1. Import Project → GitHub
2. Set Root Directory: `frontend-user`
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Add Environment Variable: `VITE_API_URL` = Railway backend URL
6. Deploy

#### Step 4: Update CORS di Backend

Update `CORS_ORIGIN` di Railway environment variables dengan URL frontend:
```
https://your-admin.vercel.app,https://your-user.vercel.app
```

---

## 8. Post-Deployment Checklist

- [ ] Backend API bisa diakses
- [ ] Frontend Admin bisa login
- [ ] Frontend User bisa melihat berita
- [ ] Upload gambar berfungsi (Cloudinary)
- [ ] Database connection berfungsi
- [ ] CORS sudah dikonfigurasi dengan benar
- [ ] Environment variables sudah benar
- [ ] SSL/HTTPS sudah aktif
- [ ] Error handling sudah bekerja
- [ ] Logging sudah setup

---

## 9. Troubleshooting

### 9.1 Backend tidak bisa connect ke database

- Pastikan database credentials benar
- Pastikan database sudah dibuat
- Pastikan firewall/network settings mengizinkan connection

### 9.2 CORS Error

- Pastikan `CORS_ORIGIN` di backend sudah include semua frontend URLs
- Pastikan frontend menggunakan HTTPS jika backend menggunakan HTTPS

### 9.3 Environment Variables tidak terbaca

- Pastikan format benar (tidak ada spasi, quotes, dll)
- Restart aplikasi setelah update environment variables
- Untuk Vite, pastikan variable diawali dengan `VITE_`

### 9.4 Build Error

- Pastikan semua dependencies terinstall
- Pastikan Node.js version sesuai
- Check build logs untuk detail error

---

## 10. Monitoring & Maintenance

### 10.1 Monitoring

- Setup error tracking (Sentry, LogRocket)
- Setup uptime monitoring (UptimeRobot, Pingdom)
- Monitor database performance

### 10.2 Backup

- Setup automatic database backup
- Backup environment variables
- Document deployment process

### 10.3 Updates

- Setup CI/CD untuk automatic deployment
- Test di staging environment sebelum production
- Keep dependencies updated

---

## 11. Security Checklist

- [ ] JWT_SECRET menggunakan random string yang kuat
- [ ] Database password kuat
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation enabled
- [ ] SQL injection protection (Sequelize ORM)
- [ ] XSS protection
- [ ] Environment variables tidak di-commit ke git

---

## 12. Cost Estimation

### Free Tier Options:

**Railway:**
- $5 credit/month (cukup untuk small app)

**Vercel:**
- Free tier: unlimited deployments, 100GB bandwidth

**Render:**
- Free tier: 750 hours/month

**Supabase:**
- Free tier: 500MB database, 2GB storage

### Recommended for Production:

- Railway: $20/month (backend + database)
- Vercel: Free (frontend)
- Total: ~$20/month

---

## 13. Quick Start Commands

```bash
# Backend - Railway
cd backend
railway login
railway init
railway up

# Frontend Admin - Vercel
cd frontend
vercel

# Frontend User - Vercel
cd frontend-user
vercel
```

---

## 14. Support

Jika ada masalah saat deployment, check:
1. Platform documentation
2. Error logs di platform dashboard
3. Environment variables configuration
4. Network/CORS settings

---

**Selamat Deploy! 🚀**

