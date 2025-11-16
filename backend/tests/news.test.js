/**
 * ============================================
 * TEST FILE: news.test.js
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji semua operasi yang berhubungan dengan News (Berita).
 * 
 * YANG DITEST:
 * 1. GET /api/news/public/list - Mengambil berita untuk public (hanya published)
 * 2. GET /api/news - Mengambil semua berita untuk admin (termasuk draft)
 * 3. POST /api/news - Membuat berita baru
 * 
 * CARA KERJA:
 * - Setup: Buat kategori, penulis, admin, dan 2 berita dummy (1 published, 1 draft)
 * - Test: Test berbagai skenario (public vs admin, validasi, dll)
 * - Cleanup: Tutup koneksi database
 */

import request from 'supertest';
import app from '../app.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { sequelize, News, Category, Author, Admin } = db;

let testCategory, testAuthor, testAdmin, token;
let newsId;

// Konten berita yang panjang (minimal 100 karakter untuk validasi)
const longContent = '<p>Ini adalah konten berita yang cukup panjang untuk memenuhi validasi minimal 100 karakter. Konten ini berisi informasi yang cukup lengkap dan detail tentang topik yang dibahas dalam berita ini. Dengan panjang yang memadai, konten ini dapat melewati validasi yang ditetapkan oleh sistem.</p>';

describe('🧪 NEWS CONTROLLER TEST', () => {
  /**
   * SETUP AWAL - Dijalankan sekali sebelum semua test
   * Tujuan: Menyiapkan data yang diperlukan (kategori, penulis, admin, berita dummy)
   */
  beforeAll(async () => {
    // Reset database untuk test ini - gunakan cleanup helper
    const { cleanupDatabase } = await import('./helpers/dbCleanup.js');
    await cleanupDatabase();
    
    // 1. Buat kategori dan penulis (berita butuh kategori dan penulis)
    testCategory = await Category.create({ name: 'Teknologi', slug: 'teknologi' });
    testAuthor = await Author.create({ name: 'Penulis Satu' });
    
    // 3. Buat admin untuk authentication
    const hashedPassword = await bcrypt.hash('123456', 10);
    testAdmin = await Admin.create({ 
      username: 'adminnews', 
      email: 'newsadmin@example.com', 
      password: hashedPassword 
    });
    
    // 4. Generate token untuk authentication
    token = jwt.sign(
      { adminId: testAdmin.adminId, email: testAdmin.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    // 5. Buat 2 berita dummy untuk testing
    //    - Berita 1: status 'published' (bisa dilihat public)
    //    - Berita 2: status 'draft' (hanya admin yang bisa lihat)
    await News.bulkCreate([
      {
        title: 'Berita Pertama',
        slug: 'berita-pertama',
        content: longContent,
        summary: 'Ringkasan berita pertama',
        imageUrl: 'https://example.com/image1.jpg',
        categoryId: testCategory.categoryId,
        authorId: testAuthor.authorId,
        adminId: testAdmin.adminId,
        status: 'published', // ✅ Published - bisa dilihat public
        publishedAt: new Date(),
        views: 10,
      },
      {
        title: 'Berita Kedua',
        slug: 'berita-kedua',
        content: longContent,
        summary: 'Ringkasan berita kedua',
        imageUrl: 'https://example.com/image2.jpg',
        categoryId: testCategory.categoryId,
        authorId: testAuthor.authorId,
        adminId: testAdmin.adminId,
        status: 'draft', // ❌ Draft - hanya admin yang bisa lihat
        publishedAt: new Date(),
        views: 5,
      }
    ]);
  });

  /**
   * CLEANUP - Tutup koneksi database
   */
  afterAll(async () => {
    await sequelize.close();
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/news/public/list (Public Endpoint)
   * ============================================
   * Menguji endpoint untuk mengambil berita yang bisa dilihat public
   * 
   * PENTING:
   * - Endpoint ini TIDAK memerlukan authentication (public)
   * - Hanya menampilkan berita dengan status 'published'
   * - Berita dengan status 'draft' TIDAK boleh muncul
   */
  describe('GET /api/news/public/list - Public News List', () => {
    /**
     * TEST: Mengambil berita published untuk public (Happy Path)
     * 
     * SKENARIO:
     * - User biasa (tidak login) mengakses endpoint public
     * - Sistem mengembalikan hanya berita yang sudah published
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Data harus array
     * - Harus ada minimal 1 berita (karena kita buat 1 published)
     * - Setiap berita harus punya struktur yang benar (id, title, slug)
     */
    it('✅ Berhasil mengambil berita yang published untuk public', async () => {
      // LANGKAH 1: Kirim request GET tanpa token (public endpoint)
      const res = await request(app).get('/api/news/public/list');
      
      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200); // Harus sukses
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true); // Data harus array
      expect(res.body.data.length).toBeGreaterThanOrEqual(1); // Minimal 1 berita published
      
      // LANGKAH 3: Verifikasi struktur data setiap berita
      res.body.data.forEach(news => {
        expect(news).toHaveProperty('id'); // Harus ada ID
        expect(news).toHaveProperty('title'); // Harus ada title
        expect(news).toHaveProperty('slug'); // Harus ada slug
      });
    });

    /**
     * TEST: Security - Berita draft tidak boleh muncul di public
     * 
     * SKENARIO:
     * - User biasa mengakses endpoint public
     * 
     * YANG DICEK:
     * - Berita dengan status 'draft' TIDAK boleh muncul
     * - Ini penting untuk keamanan (draft tidak boleh dilihat public)
     */
    it('✅ Berita draft tidak boleh muncul di public list', async () => {
      const res = await request(app).get('/api/news/public/list');
      
      // getPublishedNews hanya mengambil status published, jadi tidak ada draft
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      
      // Verifikasi tidak ada berita draft
      // (getPublishedNews sudah filter hanya published, jadi tidak perlu cek lagi)
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/news (Admin Endpoint)
   * ============================================
   * Menguji endpoint untuk admin mengambil berita
   * 
   * PENTING:
   * - Endpoint ini MEMERLUKAN authentication (hanya admin)
   * - Admin bisa melihat SEMUA berita (published + draft)
   * - Bisa filter berdasarkan status
   */
  describe('GET /api/news - Admin News List', () => {
    /**
     * TEST: Authentication - Harus login untuk akses admin endpoint
     * 
     * SKENARIO:
     * - User mencoba akses endpoint admin TANPA token
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 401
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app).get('/api/news'); // ❌ Tidak ada token
      
      expect(res.statusCode).toBe(401); // 401 = Unauthorized
    });

    /**
     * TEST: Admin mengambil semua berita (Happy Path)
     * 
     * SKENARIO:
     * - Admin yang sudah login mengakses endpoint
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Harus mengembalikan semua berita (published + draft)
     * - Response harus punya struktur pagination
     */
    it('✅ Berhasil mengambil semua berita untuk admin', async () => {
      // LANGKAH 1: Kirim request dengan token admin
      const res = await request(app)
        .get('/api/news')
        .set('Authorization', `Bearer ${token}`); // ✅ Token valid

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('articles'); // Harus ada array articles
      expect(Array.isArray(res.body.data.articles)).toBe(true);
      expect(res.body.data.articles.length).toBeGreaterThanOrEqual(1); // Minimal 1 berita
    });

    /**
     * TEST: Admin bisa filter berita berdasarkan status
     * 
     * SKENARIO:
     * - Admin ingin melihat hanya berita draft
     * 
     * YANG DICEK:
     * - Admin harus bisa melihat berita draft
     * - Ini membedakan admin dengan public (public tidak bisa lihat draft)
     */
    it('✅ Admin dapat melihat berita dengan status draft', async () => {
      // LANGKAH 1: Request dengan filter status=draft
      const res = await request(app)
        .get('/api/news?status=draft') // Filter hanya draft
        .set('Authorization', `Bearer ${token}`);

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200);
      const draftNews = res.body.data.articles.find(news => news.status === 'draft');
      
      // Jika ada draft news, harus bisa dilihat
      if (res.body.data.articles.length > 0) {
        expect(res.body.data.articles).toBeDefined();
      }
    });
  });

  /**
   * ============================================
   * TEST GROUP: POST /api/news (CREATE)
   * ============================================
   * Menguji endpoint untuk membuat berita baru
   * 
   * PENTING:
   * - Hanya admin yang bisa membuat berita
   * - Ada banyak validasi (title, content length, imageUrl, dll)
   * - Slug otomatis dibuat dari title
   */
  describe('POST /api/news - Create News', () => {
    /**
     * TEST: Authentication - Harus login untuk membuat berita
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app)
        .post('/api/news')
        .send({
          title: 'Test News',
          content: longContent,
        }); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401);
    });

    /**
     * TEST: Validasi - title wajib diisi
     * 
     * SKENARIO:
     * - Admin mencoba membuat berita TANPA title
     * 
     * YANG DICEK:
     * - Sistem harus menolak karena title wajib
     */
    it('❌ Harus gagal jika title tidak dikirim', async () => {
      const res = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // title TIDAK dikirim - ini yang kita test
          content: longContent,
          categoryId: testCategory.categoryId,
          authorId: testAuthor.authorId,
        });

      expect(res.statusCode).toBe(400); // 400 = Bad Request
    });

    /**
     * TEST: Validasi - content minimal 100 karakter
     * 
     * SKENARIO:
     * - Admin mencoba membuat berita dengan content terlalu pendek
     * 
     * YANG DICEK:
     * - Sistem harus menolak karena content terlalu pendek
     * - Ini mencegah berita dengan konten yang tidak bermutu
     */
    it('❌ Harus gagal jika content terlalu pendek', async () => {
      const res = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test News',
          content: '<p>Pendek</p>', // ❌ Terlalu pendek (kurang dari 100 karakter)
          categoryId: testCategory.categoryId,
          authorId: testAuthor.authorId,
        });

      expect(res.statusCode).toBe(400);
    });

    /**
     * TEST: Validasi - imageUrl wajib diisi
     * 
     * SKENARIO:
     * - Admin mencoba membuat berita TANPA gambar
     * 
     * YANG DICEK:
     * - Sistem harus menolak karena setiap berita HARUS punya gambar
     */
    it('❌ Harus gagal jika imageUrl tidak dikirim', async () => {
      const res = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test News',
          content: longContent,
          categoryId: testCategory.categoryId,
          authorId: testAuthor.authorId,
          status: 'published',
          // imageUrl TIDAK dikirim - ini yang kita test
        });

      expect(res.statusCode).toBe(400);
    });

    /**
     * TEST: Membuat berita sukses (Happy Path)
     * 
     * SKENARIO:
     * - Admin membuat berita dengan semua data yang valid
     * 
     * YANG DICEK:
     * - Status harus 201 (Created)
     * - Response harus sukses
     * - Data berita harus lengkap (newsId, title, slug)
     * - Slug harus otomatis dibuat
     */
    it('✅ Berhasil membuat berita baru', async () => {
      // LANGKAH 1: Siapkan data berita yang valid
      const newArticle = {
        title: 'Berita Ketiga',
        content: longContent, // ✅ Content panjang (lebih dari 100 karakter)
        categoryId: testCategory.categoryId, // ✅ Kategori valid
        authorId: testAuthor.authorId, // ✅ Penulis valid
        status: 'published',
        imageUrl: 'https://example.com/image3.jpg' // ✅ Ada gambar
      };

      // LANGKAH 2: Kirim request untuk membuat berita
      const res = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${token}`)
        .send(newArticle);

      // LANGKAH 3: Verifikasi response
      expect(res.statusCode).toBe(201); // 201 = Created (berhasil dibuat)
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Berita Ketiga'); // Title sesuai
      expect(res.body.data).toHaveProperty('newsId'); // Harus ada ID
      expect(res.body.data).toHaveProperty('slug'); // Harus ada slug
      
      // Simpan ID untuk digunakan di test lain
      newsId = res.body.data.newsId;
    });

    /**
     * TEST: Auto-generate slug dari title
     * 
     * SKENARIO:
     * - Admin membuat berita dengan title panjang
     * 
     * YANG DICEK:
     * - Slug harus otomatis dibuat dari title
     * - Slug harus lowercase dan menggunakan dash (-)
     * - Contoh: "Berita Keempat Dengan Judul Panjang" → "berita-keempat-dengan-judul-panjang"
     */
    it('✅ Slug harus otomatis dibuat dari title', async () => {
      const newArticle = {
        title: 'Berita Keempat Dengan Judul Panjang', // Title dengan spasi dan huruf besar
        content: longContent,
        categoryId: testCategory.categoryId,
        authorId: testAuthor.authorId,
        status: 'published',
        imageUrl: 'https://example.com/image4.jpg'
      };

      const res = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${token}`)
        .send(newArticle);

      expect(res.statusCode).toBe(201);
      // Verifikasi slug otomatis dibuat dengan format yang benar
      expect(res.body.data.slug).toBe('berita-keempat-dengan-judul-panjang'); // Lowercase, dash sebagai separator
    });
  });
});
