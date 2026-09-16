# 🗞️ Portal Berita - Full-Stack News Portal & CMS System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-v19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-v6.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D12.0-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-v7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-green.svg?style=for-the-badge)

**Platform Manajemen & Portal Berita Modern Berbasis Clean Layered Architecture & Microservices Docker**

[Quickstart Docker](#-cara-menjalankan-cepat-dengan-docker-recommended) • [Fitur Utama](#-fitur-utama) • [Redis Caching](#-redis-caching-layer) • [Arsitektur](#-arsitektur-sistem) • [Pengujian](#-pengujian--quality-assurance) • [Panduan Deployment](#-panduan-deployment)

</div>

---

## 📋 Daftar Isi

- [🐳 Cara Menjalankan Cepat dengan Docker (Recommended)](#-cara-menjalankan-cepat-dengan-docker-recommended)
- [📌 Ringkasan Proyek](#-ringkasan-proyek)
- [✨ Fitur Utama](#-fitur-utama)
  - [1. Backend REST API](#1-backend-rest-api)
  - [2. Admin CMS Dashboard (`/frontend`)](#2-admin-cms-dashboard-frontend)
  - [3. Public News Portal (`/frontend-user`)](#3-public-news-portal-frontend-user)
- [⚡ Redis Caching Layer](#-redis-caching-layer)
- [🛠 Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [🏗 Arsitektur Sistem](#-arsitektur-sistem)
  - [Prinsip Clean Architecture](#prinsip-clean-architecture)
  - [Diagram Alir Data](#diagram-alir-data)
  - [Penerapan Design Pattern](#penerapan-design-pattern)
- [📂 Struktur Direktori Proyek](#-struktur-direktori-proyek)
- [⚙️ Prasyarat Sistem](#️-prasyarat-sistem)
- [🚀 Panduan Instalasi & Konfigurasi](#-panduan-instalasi--konfigurasi)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Konfigurasi Environment Variables](#2-konfigurasi-environment-variables)
  - [3. Instalasi Dependensi](#3-instalasi-dependensi)
  - [4. Setup & Migrasi Database](#4-setup--migrasi-database)
  - [5. Menjalankan Aplikasi (Mode Development)](#5-menjalankan-aplikasi-mode-development)
- [📡 Ringkasan API Endpoints](#-ringkasan-api-endpoints)
- [🔒 Fitur Keamanan (Security Features)](#-fitur-keamanan-security-features)
- [🧪 Pengujian & Quality Assurance](#-pengujian--quality-assurance)
  - [Backend Testing (Jest + Supertest)](#backend-testing-jest--supertest)
  - [Frontend Testing (Vitest + React Testing Library)](#frontend-testing-vitest--react-testing-library)
  - [Black Box Testing & Postman Documentation](#black-box-testing--postman-documentation)
- [☁️ Panduan Deployment](#-panduan-deployment)
  - [Backend (Railway)](#backend-railway)
  - [Frontend (Vercel)](#frontend-vercel)
- [📄 Lisensi](#-lisensi)

---

## 🐳 Cara Menjalankan Cepat dengan Docker (Recommended)

Seluruh sistem (Database PostgreSQL, In-Memory Redis, Backend REST API, Frontend Admin CMS, dan Frontend Public User) telah terorkestrasi secara utuh menggunakan Docker Compose berstandar produksi:

```bash
# 1. Jalankan seluruh container di background
docker compose up -d

# 2. Cek status container (pastikan semua berstatus healthy)
docker compose ps
```

### Pemetaan Layanan & Port

| Layanan | Kontainer | Port Akses Lokal (Host) | Keterangan |
| :--- | :--- | :--- | :--- |
| **Frontend Public User** | `portalberita-frontend-user` | [http://localhost:5176](http://localhost:5176) | Portal pembaca berita untuk publik |
| **Frontend Admin CMS** | `portalberita-frontend-admin` | [http://localhost:5175](http://localhost:5175) | Panel dashboard CMS berita & komentar |
| **Backend Express API** | `portalberita-backend` | [http://localhost:5050](http://localhost:5050) | REST API server + Redis caching layer |
| **Redis Cache** | `portalberita-redis` | `localhost:6380` | High-speed in-memory caching |
| **PostgreSQL Database** | `portalberita-postgres` | `localhost:5435` | Database relasional persisten |

```bash
# Perintah Pemeliharaan Docker:
docker compose logs -f backend   # Melihat log aktivitas backend
docker compose down              # Menghentikan semua layanan
```

---

## 📌 Ringkasan Proyek

**Portal Berita** adalah sistem manajemen berita berkinerja tinggi yang dirancang untuk memisahkan secara tegas antara **Admin CMS (Content Management System)** dan **Public Reader Portal**. 

Aplikasi ini dikembangkan menggunakan pendekatan **Clean Layered Architecture** pada sisi backend untuk memastikan pemisahan tanggung jawab (*separation of concerns*), kemudahan pemeliharaan (*maintainability*), serta skalabilitas tinggi saat terjadi pertumbuhan data maupun traffic pengguna.

### Keunggulan Utama
- 🌟 **Dual Frontend Architecture**: Memisahkan aplikasi pembaca berita (`frontend-user`) dan panel manajemen admin (`frontend`) secara independen.
- 🏗 **Clean Architecture & Repository Pattern**: Abstraksi data layer yang memisahkan Controller, Service, Repository, dan Sequelize Model.
- ⚡ **Redis In-Memory Caching**: Caching pintar dengan auto-invalidation, response headers diagnostik, dan fail-safe graceful degradation.
- 🛡 **Enterprise Security Standard**: Dilengkapi dengan JWT Authentication, Helmet Security Headers, XSS Sanitization (`sanitize-html`), Input Validation (`express-validator`), dan Anti Brute-Force Rate Limiting.
- ✍️ **Rich Content Editing**: Integrasi editor wysiwyg modern Tiptap pada admin panel dan rendering konten aman sanitasi XSS pada public site.
- ☁️ **Cloud Storage Integration**: Manajemen file media gambar artikel otomatis terhubung ke Cloudinary via Multer.
- 🧪 **High QA Standard**: Dilengkapi dengan Unit & Integration Testing (Jest & Vitest) dengan 112+ automated test suites yang lulus 100%.

---

## ✨ Fitur Utama

### 1. Backend REST API
- 🔑 **Autentikasi & Otorisasi Admin**: Kredensial terenkripsi `bcrypt` dengan token JWT berjangka waktu.
- 📰 **Manajemen Berita (CRUD)**: Pembuatan, pembacaan, pembaruan, dan penghapusan berita dengan dukungan *slug auto-generation*, *featured image*, dan status publikasi (`draft` / `published`).
- 🏷 **Manajemen Kategori**: Pengelompokan berita berdasarkan kategori dinamis.
- 👤 **Manajemen Penulis (Authors)**: Manajemen profil penulis berita beserta deskripsi dan avatar.
- 💬 **Sistem Komentar & Moderasi**: Pengiriman komentar oleh pengguna umum, disertai fitur moderasi admin (`pending`, `approved`, `rejected`).
- 📊 **Dashboard Analytics API**: Metrik statistik total berita, total kategori, total penulis, total komentar, dan artikel terpopuler.
- 🔄 **Database Migration & Data Seeding**: Script otomatis pembuatan skema tabel PostgreSQL dan pengisian data *dummy*.

### 2. Admin CMS Dashboard (`/frontend`)
- 📈 **Interaktif Analytics Dashboard**: Ringkasan statistik performa portal berita secara real-time.
- 📝 **Rich Text Editor (TipTap)**: Pengalaman menulis artikel seperti pengolah kata modern dengan format tebal, miring, underline, heading, alignment, dan link.
- 🖼 **Media Upload & Preview**: Upload gambar sampul artikel langsung ke Cloudinary dengan preview visual.
- 📋 **Tabel Manajemen Berita**: Filter status berita, pencarian cepat, pagination, serta aksi edit & hapus.
- 🛡 **Panel Moderasi Komentar**: Sistem verifikasi komentar publik sebelum tampil di portal pembaca.
- 🔔 **Toast Notification System**: Umpan balik aksi pengguna melalui `react-hot-toast` & `react-toastify`.

### 3. Public News Portal (`/frontend-user`)
- 🏠 **Homepage Dynamic Layout**: Banner berita terkini, seksi artikel populer/trending, dan grid berita terbaru per kategori.
- 🔍 **Real-Time Debounced Search**: Pencarian artikel berdasarkan kata kunci judul/konten tanpa membebani server.
- 📂 **Category Filtering**: Halaman eksplorasi berita berdasarkan kategori khusus.
- 📖 **Detail Artikel Content Rendering**: Tampilan baca berita dengan desain tipografi nyaman, rendering HTML aman XSS via `dompurify`, dan seksi artikel terkait.
- 💬 **Seksi Komentar Pembaca**: Form kirim komentar mudah dengan notifikasi status moderasi.
- 📱 **Fully Responsive Layout**: Tampilan optimal di perangkat mobile, tablet, hingga desktop.

---

## ⚡ Redis Caching Layer

Backend Portal Berita dilengkapi lapisan **High-Performance In-Memory Cache** berbasis Redis (`ioredis`) dengan arsitektur **Cache-Aside Pattern**:

### 1. Fitur Utama Caching
* **Fail-Safe / Graceful Degradation**: Jika Redis mengalami kegagalan/mati, sistem secara otomatis beralih langsung ke database PostgreSQL tanpa melempar error 500 atau menyebabkan downtime.
* **Non-Blocking Key Invalidation**: Menggunakan teknik kursor `SCAN` (bukan perintah lambat `KEYS *`) untuk membersihkan *cache key* tanpa memblokir *event loop* server.
* **HTTP Cache Diagnostics Headers**:
  * `X-Cache: HIT` : Respon dilayani instan dari Redis RAM (1-2 ms).
  * `X-Cache: MISS` : Respon diambil dari database PostgreSQL dan disimpan ke Redis untuk request berikutnya.
  * `X-Cache-TTL: [detik]` : Sisa masa berlaku cache.

### 2. Endpoint yang Di-cache & Masa Berlaku (TTL)
| Endpoint | Method | TTL (Masa Berlaku) | Invalidation Trigger |
| :--- | :--- | :--- | :--- |
| `/api/categories` | `GET` | 30 Menit (`1800s`) | Saat kategori ditambah, diedit, atau dihapus |
| `/api/news/public/list` | `GET` | 5 Menit (`300s`) | Saat artikel berita dibuat, diedit, atau dihapus |
| `/api/news/public/detail/:slug` | `GET` | 10 Menit (`600s`) | Saat artikel terkait diperbarui atau dihapus |
| `/api/news/popular` | `GET` | 3 Menit (`180s`) | Ter-refresh berkala berdasarkan view count |
| `/api/news/search` | `GET` | 2 Menit (`120s`) | Saat ada pembaruan artikel berita |

---

## 🛠 Teknologi yang Digunakan

### Backend (Node.js REST API)
| Teknologi | Versi | Peran & Kegunaan |
| :--- | :--- | :--- |
| **Node.js** | `>=18.0.0` | Runtime environment JavaScript |
| **Express.js** | `v5.1.0` | Framework REST API server |
| **PostgreSQL** | `>=12.0` | Relational Database Management System |
| **Redis** | `v7.0` | In-Memory Database Caching |
| **Sequelize ORM** | `v6.37.7` | Object-Relational Mapping untuk PostgreSQL |
| **JWT (jsonwebtoken)** | `v9.0.2` | Autentikasi stateless berstandar industri |
| **Bcryptjs** | `v3.0.2` | Hashing kata sandi bertingkat tinggi |
| **Cloudinary & Multer** | `v1.41.3` / `v2.0.1` | Cloud media storage & multipart/form-data upload |
| **Winston & Morgan** | `v3.19.0` / `v1.10.1` | Logging aplikasi & HTTP request logger |
| **Helmet & Express Rate Limit** | `v8.1.0` / `v7.5.0` | Proteksi HTTP headers & anti-DDoS / Rate Limiting |
| **Sanitize HTML & Express Validator** | `v2.17.0` / `v7.2.1` | Sanitasi input XSS & validasi skema request |

### Frontend Admin Panel (`/frontend`) & Public User Site (`/frontend-user`)
| Teknologi | Versi | Peran & Kegunaan |
| :--- | :--- | :--- |
| **React** | `v19.1.0` | Library UI deklaratif berbasis komponen |
| **Vite** | `v6.3.5` | Next-generation frontend tooling & bundler |
| **React Router DOM** | `v7.6.1` | Client-side routing SPA |
| **Tailwind CSS** | `v3.4.1` | Utility-first CSS framework |
| **TipTap Editor** | `v2.12.0` | Rich text WYSIWYG editor (Admin Panel) |
| **Framer Motion & Lucide React** | `v12.18.1` / `v0.511.0` | Animasi UI halus & sistem ikon modern |
| **Axios** | `v1.9.0` | HTTP client untuk konsumsi REST API |
| **DOMPurify** | `v3.2.6` | Sanitasi HTML pada artikel sisi client (Public User) |

### Testing & Tooling
- **Jest (`v29.7.0`) & Supertest (`v6.3.4`)**: Framework pengujian unit dan integrasi API Backend.
- **Vitest (`v4.0.8`) & React Testing Library**: Testing framework performa tinggi untuk komponen React Frontend.
- **Docker & Docker Compose**: Kontainerisasi lingkungan PostgreSQL, Redis, Backend, dan Frontend Nginx.
- **Postman**: API testing suite & dokumentasi endpoint.

---

## 🏗 Arsitektur Sistem

### Prinsip Clean Architecture
Backend aplikasi ini menerapkan prinsip **Clean Architecture** yang terbagi menjadi beberapa layer independen:

```
[ Client Requests (React SPA / Postman) ]
                   │
                   ▼
┌─────────────────────────────────────────┐
│              Routes Layer               │
│ (Validation Middleware, Rate Limit,     │
│  Cache Middleware & Auth Guard)         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│            Controllers Layer            │
│ (Request Parsing, HTTP Status Response) │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│             Services Layer              │
│ (Business Rules, Authorization Logic,   │
│  Data Transformation & Caching Layer)   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│           Repositories Layer            │
│ (Database Abstraction & Data Queries)   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         Sequelize Models Layer          │
│ (PostgreSQL Table Schemas & Relational) │
└─────────────────────────────────────────┘
```

---

## 📂 Struktur Direktori Proyek

```text
PortalBerita/
├── backend/
│   ├── src/
│   │   ├── config/              # Konfigurasi database & environment
│   │   ├── constants/           # Konstanta HTTP Status & Pesan
│   │   ├── controllers/         # Controller layer (HTTP Request/Response)
│   │   ├── infrastructure/
│   │   │   ├── cache/           # Redis singleton client & resilient logic
│   │   │   └── database/models/ # Sequelize Models (Admin, News, Category, etc.)
│   │   ├── middlewares/         # Auth, Cache, Validation, & Logger middlewares
│   │   ├── repositories/        # Database query abstractions
│   │   ├── routes/              # Express API route endpoints
│   │   ├── services/            # Core business logic
│   │   ├── utils/               # AppError, Logger, Cloudinary, Token helpers
│   │   └── validators/          # Input schema validators
│   ├── tests/                   # 112+ Unit & Integration Test Suites (Jest)
│   ├── Dockerfile               # Multi-stage production build (Node Alpine)
│   └── package.json
├── frontend/                    # Admin CMS Panel (React 19 + Vite + Tailwind)
│   ├── src/
│   ├── Dockerfile               # Multi-stage production build (Nginx Alpine)
│   └── nginx.conf
├── frontend-user/               # Public Reader Portal (React 19 + Vite + Tailwind)
│   ├── src/
│   ├── Dockerfile               # Multi-stage production build (Nginx Alpine)
│   └── nginx.conf
├── docker-compose.yml           # Orkestrasi Postgres, Redis, Backend, & Frontends
├── .env.docker.example          # Template konfigurasi environment Docker
└── README.md
```

---

## ⚙️ Prasyarat Sistem

Sebelum memulai instalasi, pastikan perangkat lunak berikut sudah terpasang pada komputer Anda:

- **Docker Desktop**: Versi terbaru (Sangat direkomendasikan)
- **Node.js**: Versi `>= 18.0.0` ([Unduh Node.js](https://nodejs.org/))
- **npm**: Versi `>= 9.0.0` (Termasuk dalam paket Node.js)
- **PostgreSQL**: Versi `>= 12.0` ([Unduh PostgreSQL](https://www.postgresql.org/download/))
- **Git**: Versi terbaru ([Unduh Git](https://git-scm.com/))
- **Akun Cloudinary** *(Opsional tetapi direkomendasikan untuk upload gambar)*

---

## 🚀 Panduan Instalasi & Konfigurasi

### 1. Clone Repository
Buka terminal dan jalankan perintah berikut untuk mengkloning proyek:
```bash
git clone https://github.com/RifandyZUl/PortalBerita.git
cd PortalBerita
```

---

### 2. Konfigurasi Environment Variables

#### 🔴 Backend Environment (`backend/.env`)
Buat file `.env` di dalam folder `backend/`:
```env
# Server Config
NODE_ENV=development
PORT=5000

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portal_berita
DB_USER=postgres
DB_PASS=password_postgres_anda

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# JWT Secret Key
JWT_SECRET=super_secret_jwt_key_portal_berita_2026
JWT_EXPIRE=7d

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Allowed Origins (Dipisahkan Koma)
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

#### 🟡 Admin Panel Environment (`frontend/.env`)
Buat file `.env` di dalam folder `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

#### 🟢 Public Website Environment (`frontend-user/.env`)
Buat file `.env` di dalam folder `frontend-user/`:
```env
VITE_API_URL=http://localhost:5000
```

---

### 3. Instalasi Dependensi

Jalankan perintah instalasi di masing-masing folder modul:

```bash
# 1. Instalasi Backend Dependencies
cd backend
npm install

# 2. Instalasi Admin Frontend Dependencies
cd ../frontend
npm install

# 3. Instalasi Public User Frontend Dependencies
cd ../frontend-user
npm install
```

---

### 4. Setup & Migrasi Database

1. **Buat Database PostgreSQL**:
   Buka PostgreSQL CLI (psql) atau pgAdmin, lalu buat database baru:
   ```sql
   CREATE DATABASE portal_berita;
   ```

2. **Jalankan Migrasi & Seeding Data**:
   Masuk ke folder `backend` dan jalankan script berikut untuk membuat struktur tabel otomatis serta mengisi data awal:
   ```bash
   cd backend
   npm run migrate
   ```
   *Script ini akan membuat kredensial admin default:*
   - **Username**: `admin_super`
   - **Password**: `admin12345`

---

### 5. Menjalankan Aplikasi (Mode Development)

Untuk menjalankan seluruh ekosistem aplikasi, buka 3 terminal terpisah:

**Terminal 1 (Backend REST API - Server Port 5000)**:
```bash
cd backend
npm run dev
```

**Terminal 2 (Admin CMS Dashboard - Port 5173)**:
```bash
cd frontend
npm run dev
```
Akses Admin Panel melalui browser: `http://localhost:5173`

**Terminal 3 (Public Reader Portal - Port 5174)**:
```bash
cd frontend-user
npm run dev
```
Akses Public Portal melalui browser: `http://localhost:5174`

---

## 📡 Ringkasan API Endpoints

Semua endpoint backend diawali dengan prefix `/api`. Berikut ringkasan beberapa endpoint utama:

| Modul | Method | Endpoint | Deskripsi | Akses |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/api/health` | Healthcheck status server | Public |
| **Auth** | `POST` | `/api/auth/login` | Login admin & dapatkan token JWT | Public |
| **Dashboard**| `GET` | `/api/dashboard/stats` | Dapatkan statistik total data portal | Admin (JWT) |
| **News** | `GET` | `/api/news` | Ambil semua berita (mendukung filter & pagination) | Public (Cached) |
| **News** | `GET` | `/api/news/:id` | Detail berita lengkap berdasarkan ID/Slug | Public (Cached) |
| **News** | `POST` | `/api/news` | Buat artikel berita baru (dukung gambar) | Admin (JWT) |
| **News** | `PUT` | `/api/news/:id` | Perbarui artikel berita | Admin (JWT) |
| **News** | `DELETE`| `/api/news/:id` | Hapus artikel berita | Admin (JWT) |
| **Category**| `GET` | `/api/categories` | Daftar semua kategori berita | Public (Cached) |
| **Category**| `POST` | `/api/categories` | Tambah kategori berita baru | Admin (JWT) |
| **Author** | `GET` | `/api/authors` | Daftar semua penulis berita | Public |
| **Author** | `POST` | `/api/authors` | Tambah profil penulis baru | Admin (JWT) |
| **Comment** | `GET` | `/api/comments` | Ambil komentar (dapat difilter per berita/status) | Public/Admin |
| **Comment** | `POST` | `/api/comments` | Kirim komentar baru pada artikel | Public |
| **Comment** | `PATCH`| `/api/comments/:id/status` | Moderasi komentar (`approved`/`rejected`) | Admin (JWT) |

> 📘 **Dokumentasi Lengkap API**: Untuk membaca seluruh skema request/response, silakan baca dokumentasi terpisah pada file [`backend/POSTMAN_DOCUMENTATION.md`](backend/POSTMAN_DOCUMENTATION.md).

---

## 🔒 Fitur Keamanan (Security Features)

1. **JWT Authentication & Protection**: Seluruh endpoint sensitif manajemen data diuji dan dilindungi oleh middleware `authMiddleware.js`.
2. **XSS Protection**: HTML sanitization menggunakan `sanitize-html` pada backend dan `DOMPurify` pada frontend pembaca sebelum merender isi berita dari rich text editor.
3. **HTTP Security Headers (Helmet)**: Pengaturan header keamanan HTTP untuk mencegah attacks seperti Clickjacking, MIME Sniffing, dan XSS injection.
4. **Rate Limiting**: Membatasi percobaan request berlebihan (seperti bruteforce login) menggunakan `express-rate-limit`.
5. **Secure Input Validation**: Validasi tipe data, batas karakter, dan format field melalui `express-validator` di tingkat route.

---

## 🧪 Pengujian & Quality Assurance

Sistem ini didesain dengan standar kualitas tinggi yang diuji melalui pengujian otomatis maupun manual.

### Backend Testing (Jest + Supertest)
Backend memiliki suite test otomatis untuk menguji layer integrasi API dan unit logic (112 test cases lulus 100%).

```bash
cd backend

# Menjalankan seluruh pengujian backend
npm test

# Menjalankan pengujian dalam mode watch
npm run test:watch

# Menjalankan laporan cakupan pengujian (test coverage)
npm run test:coverage
```

### Frontend Testing (Vitest + React Testing Library)
Kedua aplikasi frontend dilengkapi dengan pengujian Vitest untuk memverifikasi fungsionalitas komponen UI dan routing.

```bash
# Testing pada Admin Panel
cd frontend
npm test

# Testing pada Public User Portal
cd frontend-user
npm test:run
```

### Black Box Testing & Postman Documentation
- **Tabel Black Box Testing**: Seluruh modul (Auth, News, Category, Author, Comments, Dashboard) telah diuji skenario *valid/invalid input*, batas error code HTTP (200, 201, 400, 401, 404, 429), dan dicatat secara detail pada file [`BLACK_BOX_TESTING_TABLE.md`](BLACK_BOX_TESTING_TABLE.md).
- **Postman Collection Guide**: Dokumentasi petunjuk variabel otomatis dan flow pengujian Postman tersedia di [`backend/POSTMAN_DOCUMENTATION.md`](backend/POSTMAN_DOCUMENTATION.md).

---

## ☁️ Panduan Deployment

Proyek ini telah siap untuk dideploy ke lingkungan produksi cloud:

### 1. Docker Production Deployment (Recommended)
Cukup jalankan Docker Compose di VPS/Server Cloud (DigitalOcean, AWS EC2, Hetzner, dll.):
```bash
docker compose up -d --build
```

### 2. Multi-Cloud Managed Services
* **Backend API**: Dapat dideploy ke Render, Railway, Fly.io, atau Google Cloud Run menggunakan `backend/Dockerfile`.
* **Database**: Managed PostgreSQL (Neon, Supabase, Aiven).
* **Cache**: Managed Redis (Upstash, Redis Cloud).
* **Frontend Admin & User**: Vercel atau Netlify menggunakan multi-app SPA routing.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **ISC**. Seluruh hak cipta dan penggunaan kode mengikuti aturan pengembang.

<div align="center">
  <sub>Dikembangkan dengan ❤️ untuk sistem manajemen portal berita yang andal, aman, dan dapat diandalkan.</sub>
</div>
