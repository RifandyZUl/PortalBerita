# 📮 DOKUMENTASI POSTMAN TESTING

## 📋 DAFTAR ISI
1. [Overview](#overview)
2. [Setup Postman](#setup-postman)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Request Examples](#request-examples)
6. [Error Handling](#error-handling)
7. [Tips & Best Practices](#tips--best-practices)

---

## 🎯 OVERVIEW

Dokumentasi ini menjelaskan cara menggunakan Postman untuk testing semua endpoint API backend Portal Berita. Dokumentasi ini mencakup:
- Setup environment dan collection
- Authentication flow
- Semua endpoint dengan detail lengkap
- Contoh request dan response
- Error handling
- Tips dan best practices

### Base URL
```
Development: http://localhost:5000
Production: https://your-production-url.com
```

### API Prefix
Semua endpoint menggunakan prefix `/api`

---

## ⚙️ SETUP POSTMAN

### 1. Membuat Environment

1. Klik **Environments** di sidebar kiri
2. Klik **+** untuk membuat environment baru
3. Beri nama: `Portal Berita API`
4. Tambahkan variables berikut:

| Variable | Initial Value | Current Value | Description |
|----------|---------------|---------------|-------------|
| `base_url` | `http://localhost:5000` | `http://localhost:5000` | Base URL API |
| `token` | (kosong) | (kosong) | JWT Token (akan diisi setelah login) |
| `admin_id` | (kosong) | (kosong) | Admin ID (optional) |
| `news_id` | (kosong) | (kosong) | News ID untuk testing (optional) |
| `category_id` | (kosong) | (kosong) | Category ID untuk testing (optional) |
| `author_id` | (kosong) | (kosong) | Author ID untuk testing (optional) |
| `comment_id` | (kosong) | (kosong) | Comment ID untuk testing (optional) |

5. Klik **Save**

### 2. Membuat Collection

1. Klik **Collections** di sidebar kiri
2. Klik **+** untuk membuat collection baru
3. Beri nama: `Portal Berita API Collection`
4. Klik **...** pada collection → **Edit**
5. Di tab **Variables**, tambahkan:
   - `base_url`: `{{base_url}}`
6. Klik **Save**

### 3. Mengatur Collection untuk Auto-Save Token

1. Buka collection → **Tests** tab
2. Tambahkan script berikut untuk auto-save token setelah login:

```javascript
// Auto-save token setelah login
if (pm.response.code === 200 && pm.response.json().token) {
    pm.environment.set("token", pm.response.json().token);
    console.log("Token saved to environment");
}

// Auto-save admin_id jika ada
if (pm.response.code === 200 && pm.response.json().data?.adminId) {
    pm.environment.set("admin_id", pm.response.json().data.adminId);
}
```

---

## 🔐 AUTHENTICATION

### Login Endpoint

**Endpoint**: `POST /api/auth/login`

**Description**: Login admin untuk mendapatkan JWT token. Token ini diperlukan untuk mengakses protected endpoints.

#### Request

**Method**: `POST`

**URL**: `{{base_url}}/api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Atau menggunakan username**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

#### Response Success (200 OK)

```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "adminId": 1,
    "username": "admin",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Response Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Email atau password salah",
  "errors": []
}
```

#### Response Error (400 Bad Request)

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "Email wajib diisi"
    }
  ]
}
```

### Menggunakan Token

Setelah login berhasil, token akan otomatis tersimpan di environment variable `token`. Untuk menggunakan token di request berikutnya:

1. Buka request yang memerlukan authentication
2. Pergi ke tab **Authorization**
3. Pilih **Bearer Token**
4. Token akan otomatis diambil dari `{{token}}` environment variable

**Atau** tambahkan manual di **Headers**:
```
Authorization: Bearer {{token}}
```

---

## 📡 API ENDPOINTS

### 🔐 AUTHENTICATION

#### 1. Login Admin

**Endpoint**: `POST /api/auth/login`

**Authentication**: ❌ Tidak diperlukan

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response**: Lihat [Authentication](#authentication) section di atas.

---

### 👤 ADMIN PROFILE

#### 1. Get Admin Profile

**Endpoint**: `GET /api/admin/profile`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Profile berhasil diambil",
  "data": {
    "adminId": 1,
    "username": "admin",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Admin bio",
    "photo": "https://cloudinary.com/photo.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Update Admin Profile

**Endpoint**: `PUT /api/admin/profile`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: multipart/form-data
```

**Body** (form-data):
```
firstName: John
lastName: Doe
bio: Updated bio
photo: [file] (optional - upload image)
```

**Atau menggunakan raw JSON** (tanpa photo):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio"
}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Profile berhasil diupdate",
  "data": {
    "adminId": 1,
    "username": "admin",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Updated bio",
    "photo": "https://cloudinary.com/updated-photo.jpg"
  }
}
```

---

### 📂 CATEGORY

#### 1. Get All Categories

**Endpoint**: `GET /api/categories`

**Authentication**: ❌ Tidak diperlukan (Public)

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Kategori berhasil diambil",
  "data": [
    {
      "categoryId": 1,
      "name": "Teknologi",
      "slug": "teknologi",
      "description": "Kategori teknologi",
      "icon": "tech",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Get Category by ID

**Endpoint**: `GET /api/categories/:id`

**Authentication**: ❌ Tidak diperlukan (Public)

**URL**: `{{base_url}}/api/categories/1`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Kategori berhasil diambil",
  "data": {
    "categoryId": 1,
    "name": "Teknologi",
    "slug": "teknologi",
    "description": "Kategori teknologi",
    "icon": "tech"
  }
}
```

#### 3. Create Category

**Endpoint**: `POST /api/categories`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body**:
```json
{
  "name": "Teknologi",
  "slug": "teknologi",
  "description": "Kategori tentang teknologi",
  "icon": "tech"
}
```

**Validation Rules**:
- `name`: Required, 3-100 karakter, hanya huruf, angka, spasi, dan dash
- `slug`: Required, 3-100 karakter, hanya huruf kecil, angka, dan dash
- `description`: Optional, maksimal 500 karakter
- `icon`: Optional, maksimal 50 karakter

**Response Success (201 Created)**:
```json
{
  "success": true,
  "message": "Kategori berhasil dibuat",
  "data": {
    "categoryId": 1,
    "name": "Teknologi",
    "slug": "teknologi",
    "description": "Kategori tentang teknologi",
    "icon": "tech"
  }
}
```

#### 4. Update Category

**Endpoint**: `PUT /api/categories/:id`

**Authentication**: ✅ Required (Bearer Token)

**URL**: `{{base_url}}/api/categories/1`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body**:
```json
{
  "name": "Teknologi Updated",
  "slug": "teknologi-updated",
  "description": "Updated description"
}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Kategori berhasil diupdate",
  "data": {
    "categoryId": 1,
    "name": "Teknologi Updated",
    "slug": "teknologi-updated",
    "description": "Updated description"
  }
}
```

#### 5. Delete Category

**Endpoint**: `DELETE /api/categories/:id`

**Authentication**: ✅ Required (Bearer Token)

**URL**: `{{base_url}}/api/categories/1`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Kategori berhasil dihapus"
}
```

---

### ✍️ AUTHOR

#### 1. Get All Authors

**Endpoint**: `GET /api/authors`

**Authentication**: ❌ Tidak diperlukan (Public)

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Penulis berhasil diambil",
  "data": [
    {
      "authorId": 1,
      "name": "John Doe",
      "bio": "Penulis profesional",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Get Author by ID

**Endpoint**: `GET /api/authors/:id`

**Authentication**: ❌ Tidak diperlukan (Public)

**URL**: `{{base_url}}/api/authors/1`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Penulis berhasil diambil",
  "data": {
    "authorId": 1,
    "name": "John Doe",
    "bio": "Penulis profesional"
  }
}
```

#### 3. Create Author

**Endpoint**: `POST /api/authors`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body**:
```json
{
  "name": "John Doe",
  "bio": "Penulis profesional dengan pengalaman 10 tahun"
}
```

**Validation Rules**:
- `name`: Required, 2-100 karakter
- `bio`: Optional, maksimal 1000 karakter

**Response Success (201 Created)**:
```json
{
  "success": true,
  "message": "Penulis berhasil dibuat",
  "data": {
    "authorId": 1,
    "name": "John Doe",
    "bio": "Penulis profesional dengan pengalaman 10 tahun"
  }
}
```

#### 4. Update Author

**Endpoint**: `PUT /api/authors/:id`

**Authentication**: ✅ Required (Bearer Token)

**URL**: `{{base_url}}/api/authors/1`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body**:
```json
{
  "name": "John Doe Updated",
  "bio": "Updated bio"
}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Penulis berhasil diupdate",
  "data": {
    "authorId": 1,
    "name": "John Doe Updated",
    "bio": "Updated bio"
  }
}
```

#### 5. Delete Author

**Endpoint**: `DELETE /api/authors/:id`

**Authentication**: ✅ Required (Bearer Token)

**URL**: `{{base_url}}/api/authors/1`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Penulis berhasil dihapus"
}
```

---

### 📰 NEWS

#### Public Endpoints (Tidak Perlu Authentication)

#### 1. Get Published News List

**Endpoint**: `GET /api/news/public/list`

**Authentication**: ❌ Tidak diperlukan

**Query Parameters**:
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `category` (optional): Filter by category slug
- `author` (optional): Filter by author ID

**URL Example**: `{{base_url}}/api/news/public/list?page=1&limit=10&category=teknologi`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Berita berhasil diambil",
  "data": [
    {
      "id": 1,
      "title": "Judul Berita",
      "slug": "judul-berita",
      "summary": "Ringkasan berita...",
      "imageUrl": "https://example.com/image.jpg",
      "views": 100,
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "category": {
        "name": "Teknologi",
        "slug": "teknologi"
      },
      "author": {
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 2. Get Public News Detail by Slug

**Endpoint**: `GET /api/news/public/detail/:slug`

**Authentication**: ❌ Tidak diperlukan

**URL**: `{{base_url}}/api/news/public/detail/judul-berita`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Berita berhasil diambil",
  "data": {
    "id": 1,
    "title": "Judul Berita",
    "slug": "judul-berita",
    "content": "<p>Konten berita lengkap...</p>",
    "summary": "Ringkasan berita...",
    "imageUrl": "https://example.com/image.jpg",
    "views": 100,
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "name": "Teknologi",
      "slug": "teknologi"
    },
    "author": {
      "name": "John Doe"
    }
  }
}
```

**Response Error (404 Not Found)**:
```json
{
  "success": false,
  "message": "Berita tidak ditemukan"
}
```

#### 3. Search News

**Endpoint**: `GET /api/news/search`

**Authentication**: ❌ Tidak diperlukan

**Query Parameters**:
- `keyword` (required): Kata kunci pencarian
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)

**URL Example**: `{{base_url}}/api/news/search?keyword=teknologi&page=1&limit=10`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Pencarian berhasil",
  "data": [
    {
      "id": 1,
      "title": "Judul Berita",
      "slug": "judul-berita",
      "summary": "Ringkasan...",
      "imageUrl": "https://example.com/image.jpg",
      "views": 100
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

#### 4. Get Popular News

**Endpoint**: `GET /api/news/popular`

**Authentication**: ❌ Tidak diperlukan

**Query Parameters**:
- `limit` (optional): Jumlah data (default: 10)

**URL Example**: `{{base_url}}/api/news/popular?limit=10`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Berita populer berhasil diambil",
  "data": [
    {
      "id": 1,
      "title": "Judul Berita",
      "slug": "judul-berita",
      "summary": "Ringkasan...",
      "imageUrl": "https://example.com/image.jpg",
      "views": 1000,
      "publishedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 5. Increment Views

**Endpoint**: `PATCH /api/news/:id/views`

**Authentication**: ❌ Tidak diperlukan

**URL**: `{{base_url}}/api/news/1/views`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Views berhasil diupdate",
  "data": {
    "newsId": 1,
    "views": 101
  }
}
```

---

#### Admin Endpoints (Perlu Authentication)

#### 6. Get All News (Admin)

**Endpoint**: `GET /api/news`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
```

**Query Parameters**:
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `status` (optional): Filter by status (draft, published, archived)
- `search` (optional): Search by title/content
- `categoryId` (optional): Filter by category ID
- `authorId` (optional): Filter by author ID

**URL Example**: `{{base_url}}/api/news?page=1&limit=10&status=published`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Berita berhasil diambil",
  "data": [
    {
      "newsId": 1,
      "title": "Judul Berita",
      "slug": "judul-berita",
      "content": "<p>Konten...</p>",
      "summary": "Ringkasan...",
      "imageUrl": "https://example.com/image.jpg",
      "status": "published",
      "views": 100,
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "categoryId": 1,
      "authorId": 1,
      "adminId": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 7. Get News by ID (Admin)

**Endpoint**: `GET /api/news/:id`

**Authentication**: ✅ Required (Bearer Token)

**URL**: `{{base_url}}/api/news/1`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Berita berhasil diambil",
  "data": {
    "newsId": 1,
    "title": "Judul Berita",
    "slug": "judul-berita",
    "content": "<p>Konten lengkap...</p>",
    "summary": "Ringkasan...",
    "imageUrl": "https://example.com/image.jpg",
    "status": "published",
    "views": 100,
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "categoryId": 1,
    "authorId": 1,
    "adminId": 1
  }
}
```

#### 8. Create News

**Endpoint**: `POST /api/news`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body**:
```json
{
  "title": "Judul Berita Baru",
  "content": "<p>Ini adalah konten berita yang cukup panjang untuk memenuhi validasi minimal 100 karakter. Konten ini berisi informasi yang cukup lengkap dan detail tentang topik yang dibahas dalam berita ini.</p>",
  "categoryId": 1,
  "authorId": 1,
  "status": "published",
  "imageUrl": "https://example.com/image.jpg",
  "publishedAt": "2024-01-01T00:00:00.000Z"
}
```

**Validation Rules**:
- `title`: Required, minimal 10 karakter
- `content`: Required, minimal 100 karakter (plain text tanpa HTML tags)
- `categoryId`: Required, harus valid category ID
- `authorId`: Required, harus valid author ID
- `status`: Required, harus salah satu: `draft`, `published`, `archived`
- `imageUrl`: Required, harus URL valid
- `publishedAt`: Optional, format ISO8601, tidak boleh di masa depan

**Response Success (201 Created)**:
```json
{
  "success": true,
  "message": "Berita berhasil dibuat",
  "data": {
    "newsId": 1,
    "title": "Judul Berita Baru",
    "slug": "judul-berita-baru",
    "content": "<p>Konten...</p>",
    "summary": "Ringkasan otomatis...",
    "imageUrl": "https://example.com/image.jpg",
    "status": "published",
    "views": 0,
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "categoryId": 1,
    "authorId": 1,
    "adminId": 1
  }
}
```

**Note**: Slug akan otomatis dibuat dari title (lowercase, dash sebagai separator).

#### 9. Update News

**Endpoint**: `PUT /api/news/:id`

**Authentication**: ✅ Required (Bearer Token)

**URL**: `{{base_url}}/api/news/1`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body**:
```json
{
  "title": "Judul Berita Updated",
  "content": "<p>Konten updated yang cukup panjang untuk memenuhi validasi minimal 100 karakter...</p>",
  "categoryId": 1,
  "authorId": 1,
  "status": "published",
  "imageUrl": "https://example.com/updated-image.jpg"
}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Berita berhasil diupdate",
  "data": {
    "newsId": 1,
    "title": "Judul Berita Updated",
    "slug": "judul-berita-updated",
    "content": "<p>Konten updated...</p>",
    "summary": "Ringkasan updated...",
    "imageUrl": "https://example.com/updated-image.jpg",
    "status": "published"
  }
}
```

**Note**: Slug akan otomatis di-regenerate jika title berubah.

#### 10. Delete News

**Endpoint**: `DELETE /api/news/:id`

**Authentication**: ✅ Required (Bearer Token)

**URL**: `{{base_url}}/api/news/1`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Berita berhasil dihapus"
}
```

---

### 💬 COMMENT

#### 1. Create Comment (Public)

**Endpoint**: `POST /api/comments/:newsId`

**Authentication**: ❌ Tidak diperlukan (Public)

**URL**: `{{base_url}}/api/comments/1`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "content": "Komentar yang sangat bagus!"
}
```

**Validation Rules**:
- `name`: Required, minimal 2 karakter
- `email`: Required, format email valid
- `content`: Required, minimal 10 karakter

**Response Success (201 Created)**:
```json
{
  "success": true,
  "message": "Komentar berhasil dibuat",
  "data": {
    "commentId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "content": "Komentar yang sangat bagus!",
    "status": "pending",
    "newsId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note**: Status default adalah `pending`, harus di-approve oleh admin sebelum muncul di public.

#### 2. Get All Comments (Admin)

**Endpoint**: `GET /api/comments`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
```

**Query Parameters**:
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `status` (optional): Filter by status (pending, approved, spam)
- `search` (optional): Search by name, email, or content

**URL Example**: `{{base_url}}/api/comments?page=1&limit=10&status=pending`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Komentar berhasil diambil",
  "data": [
    {
      "commentId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "content": "Komentar yang sangat bagus!",
      "status": "pending",
      "newsId": 1,
      "newsTitle": "Judul Berita",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 3. Update Comment Status

**Endpoint**: `PATCH /api/comments/:id/status`

**Authentication**: ✅ Required (Bearer Token)

**URL**: `{{base_url}}/api/comments/1/status`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body**:
```json
{
  "status": "approved"
}
```

**Valid Status Values**:
- `pending`: Menunggu approval
- `approved`: Disetujui, akan muncul di public
- `spam`: Ditolak sebagai spam

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Status komentar berhasil diupdate",
  "data": {
    "commentId": 1,
    "status": "approved"
  }
}
```

#### 4. Get Public Comments by News Slug

**Endpoint**: `GET /api/comments/public/:slug`

**Authentication**: ❌ Tidak diperlukan (Public)

**URL**: `{{base_url}}/api/comments/public/judul-berita`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Komentar berhasil diambil",
  "data": [
    {
      "commentId": 1,
      "name": "John Doe",
      "content": "Komentar yang sangat bagus!",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Note**: Hanya komentar dengan status `approved` yang dikembalikan.

#### 5. Delete Comment

**Endpoint**: `DELETE /api/comments/:id`

**Authentication**: ✅ Required (Bearer Token)

**URL**: `{{base_url}}/api/comments/1`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Komentar berhasil dihapus"
}
```

---

### 📊 DASHBOARD

#### 1. Get Dashboard Base

**Endpoint**: `GET /api/dashboard`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
```

**Response Success (200 OK)**:
```json
{
  "message": "Halo admin dengan ID 1, ini adalah halaman dashboard."
}
```

#### 2. Get Dashboard Stats

**Endpoint**: `GET /api/dashboard/stats`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
```

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Statistik dashboard berhasil diambil",
  "data": {
    "totalNews": 100,
    "totalComments": 500,
    "totalViews": 10000,
    "publishedNews": 80,
    "draftNews": 20,
    "pendingComments": 10,
    "approvedComments": 450,
    "spamComments": 40
  }
}
```

#### 3. Get Recent Articles

**Endpoint**: `GET /api/dashboard/articles`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
```

**Query Parameters**:
- `limit` (optional): Jumlah artikel (default: 5)

**URL Example**: `{{base_url}}/api/dashboard/articles?limit=10`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Artikel terbaru berhasil diambil",
  "data": [
    {
      "newsId": 1,
      "title": "Judul Berita",
      "slug": "judul-berita",
      "status": "published",
      "views": 100,
      "publishedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 4. Get Recent Comments

**Endpoint**: `GET /api/dashboard/comments`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
```

**Query Parameters**:
- `limit` (optional): Jumlah komentar (default: 5)

**URL Example**: `{{base_url}}/api/dashboard/comments?limit=10`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Komentar terbaru berhasil diambil",
  "data": [
    {
      "commentId": 1,
      "name": "John Doe",
      "content": "Komentar...",
      "status": "pending",
      "newsTitle": "Judul Berita",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 5. Get All Articles with Pagination

**Endpoint**: `GET /api/dashboard/articles/all`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
```

**Query Parameters**:
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `status` (optional): Filter by status
- `search` (optional): Search by title

**URL Example**: `{{base_url}}/api/dashboard/articles/all?page=1&limit=10&status=published`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Artikel berhasil diambil",
  "data": [
    {
      "newsId": 1,
      "title": "Judul Berita",
      "slug": "judul-berita",
      "status": "published",
      "views": 100,
      "publishedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### 6. Get All Comments with Pagination

**Endpoint**: `GET /api/dashboard/comments/all`

**Authentication**: ✅ Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {{token}}
```

**Query Parameters**:
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `status` (optional): Filter by status
- `search` (optional): Search by name, email, or content

**URL Example**: `{{base_url}}/api/dashboard/comments/all?page=1&limit=10&status=pending`

**Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Komentar berhasil diambil",
  "data": [
    {
      "commentId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "content": "Komentar...",
      "status": "pending",
      "newsTitle": "Judul Berita",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 500,
    "totalPages": 50
  }
}
```

---

## ❌ ERROR HANDLING

### Standard Error Response Format

Semua error response mengikuti format yang sama:

```json
{
  "success": false,
  "message": "Pesan error utama",
  "errors": [
    {
      "field": "fieldName",
      "message": "Pesan error spesifik untuk field ini"
    }
  ]
}
```

### HTTP Status Codes

| Status Code | Description | Use Case |
|-------------|-------------|----------|
| `200` | OK | Success response untuk GET, PUT, DELETE |
| `201` | Created | Success response untuk POST (create) |
| `400` | Bad Request | Validation error, invalid input |
| `401` | Unauthorized | Missing atau invalid token |
| `403` | Forbidden | Valid token tapi tidak punya akses |
| `404` | Not Found | Resource tidak ditemukan |
| `500` | Internal Server Error | Server error |

### Common Error Scenarios

#### 1. Authentication Error (401)

**Request tanpa token**:
```
GET /api/news
```

**Response**:
```json
{
  "success": false,
  "message": "Token tidak valid atau tidak ditemukan",
  "errors": []
}
```

#### 2. Validation Error (400)

**Request dengan data invalid**:
```json
{
  "title": "Short",  // Minimal 10 karakter
  "content": "Short"  // Minimal 100 karakter
}
```

**Response**:
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "title",
      "message": "Judul minimal 10 karakter"
    },
    {
      "field": "content",
      "message": "Konten minimal 100 karakter (teks tanpa tag HTML)"
    }
  ]
}
```

#### 3. Not Found Error (404)

**Request dengan ID yang tidak ada**:
```
GET /api/news/99999
```

**Response**:
```json
{
  "success": false,
  "message": "Berita tidak ditemukan",
  "errors": []
}
```

#### 4. Foreign Key Constraint Error (400)

**Request dengan categoryId/authorId yang tidak valid**:
```json
{
  "title": "Judul Berita",
  "content": "Konten yang cukup panjang...",
  "categoryId": 99999,  // Category tidak ada
  "authorId": 1,
  "status": "published",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response**:
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "categoryId",
      "message": "Kategori tidak ditemukan"
    }
  ]
}
```

---

## 💡 TIPS & BEST PRACTICES

### 1. Organize Requests dengan Folders

Buat folder di collection untuk mengorganisir requests:
```
Portal Berita API Collection
├── 🔐 Authentication
│   └── Login
├── 👤 Admin
│   ├── Get Profile
│   └── Update Profile
├── 📂 Category
│   ├── Get All
│   ├── Get by ID
│   ├── Create
│   ├── Update
│   └── Delete
├── ✍️ Author
│   └── ...
├── 📰 News
│   ├── Public
│   │   ├── Get List
│   │   ├── Get Detail
│   │   ├── Search
│   │   ├── Popular
│   │   └── Increment Views
│   └── Admin
│       ├── Get All
│       ├── Get by ID
│       ├── Create
│       ├── Update
│       └── Delete
├── 💬 Comment
│   └── ...
└── 📊 Dashboard
    └── ...
```

### 2. Gunakan Pre-request Scripts

Tambahkan pre-request script untuk auto-set headers:

**Collection Pre-request Script**:
```javascript
// Auto-set Authorization header jika token ada
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("token")
    });
}
```

### 3. Gunakan Tests untuk Auto-Save Data

Tambahkan test script untuk auto-save IDs:

**Example untuk Create News**:
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.data?.newsId) {
        pm.environment.set("news_id", response.data.newsId);
        console.log("News ID saved:", response.data.newsId);
    }
}
```

### 4. Gunakan Variables untuk Dynamic Values

Gunakan environment variables untuk dynamic values:
- `{{base_url}}` untuk base URL
- `{{token}}` untuk JWT token
- `{{news_id}}` untuk news ID
- `{{category_id}}` untuk category ID
- dll.

### 5. Test Error Scenarios

Jangan hanya test success cases, test juga:
- Missing required fields
- Invalid data types
- Invalid IDs
- Unauthorized access
- Not found scenarios

### 6. Use Collection Runner

Gunakan Collection Runner untuk menjalankan semua requests secara berurutan:
1. Klik **Run** pada collection
2. Pilih requests yang ingin dijalankan
3. Klik **Run Portal Berita API Collection**

### 7. Export/Import Collection

Export collection untuk backup atau sharing:
1. Klik **...** pada collection
2. Pilih **Export**
3. Pilih format (Collection v2.1 recommended)
4. Save file

Import collection:
1. Klik **Import**
2. Pilih file collection
3. Collection akan di-import

### 8. Use Environment Switching

Gunakan environment switching untuk test di development dan production:
1. Klik environment dropdown di kanan atas
2. Pilih environment yang ingin digunakan
3. Semua variables akan otomatis di-update

### 9. Monitor Response Time

Perhatikan response time di Postman:
- Response time < 200ms: Excellent
- Response time 200-500ms: Good
- Response time 500-1000ms: Acceptable
- Response time > 1000ms: Need optimization

### 10. Use Postman Console

Gunakan Postman Console untuk debugging:
1. Buka **View** → **Show Postman Console**
2. Semua request dan response akan di-log
3. Berguna untuk debugging error

---

## 📝 QUICK REFERENCE

### Authentication Flow
1. **Login** → `POST /api/auth/login`
2. **Save Token** → Token otomatis tersimpan di `{{token}}`
3. **Use Token** → Tambahkan header: `Authorization: Bearer {{token}}`

### Common Headers
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

### Common Query Parameters
- `page`: Halaman (default: 1)
- `limit`: Jumlah data per halaman (default: 10)
- `status`: Filter by status
- `search`: Search keyword
- `categoryId`: Filter by category
- `authorId`: Filter by author

### Status Values
- **News**: `draft`, `published`, `archived`
- **Comment**: `pending`, `approved`, `spam`

---

## 🔗 IMPORTANT NOTES

1. **Token Expiration**: JWT token memiliki expiration time. Jika token expired, login ulang untuk mendapatkan token baru.

2. **Rate Limiting**: Beberapa endpoint memiliki rate limiting (terutama login). Jangan terlalu sering request.

3. **File Upload**: Untuk upload file (photo), gunakan `multipart/form-data` bukan `application/json`.

4. **Slug Generation**: Slug untuk News dan Category akan otomatis dibuat dari title/name. Tidak perlu dikirim manual.

5. **Content Validation**: Content untuk News harus minimal 100 karakter (plain text tanpa HTML tags).

6. **Public vs Admin**: 
   - Public endpoints tidak memerlukan authentication
   - Admin endpoints memerlukan Bearer token
   - Public endpoints hanya menampilkan data dengan status `published`
   - Admin endpoints bisa mengakses semua data termasuk `draft`

---

**Last Updated**: 2024
**Maintained By**: Development Team
**Version**: 1.0.0

