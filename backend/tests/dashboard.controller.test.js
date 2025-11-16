/**
 * ============================================
 * TEST FILE: dashboard.controller.test.js
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji semua endpoint yang berhubungan dengan Dashboard Admin.
 * 
 * YANG DITEST:
 * 1. GET /api/dashboard - Endpoint dasar dashboard
 * 2. GET /api/dashboard/stats - Statistik dashboard (total berita, komentar, views)
 * 3. GET /api/dashboard/articles - Artikel terbaru
 * 4. GET /api/dashboard/comments - Komentar terbaru
 * 5. GET /api/dashboard/articles/all - Semua artikel dengan pagination
 * 6. GET /api/dashboard/comments/all - Semua komentar dengan pagination
 * 
 * CARA KERJA:
 * - Setup: Buat admin, kategori, penulis, berita, dan komentar dummy
 * - Test: Test semua endpoint dashboard dengan berbagai skenario
 * - Cleanup: Tutup koneksi database
 */

import request from 'supertest';
import app from '../app.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { sequelize, Admin, News, Comment, Category, Author } = db;

let token;

describe('🧪 DASHBOARD CONTROLLER TEST', () => {
  /**
   * SETUP AWAL - Menyiapkan data yang diperlukan untuk testing dashboard
   */
  beforeAll(async () => {
    // Reset database untuk test ini - gunakan cleanup helper
    const { cleanupDatabase } = await import('./helpers/dbCleanup.js');
    await cleanupDatabase();
    
    // 1. Buat admin untuk authentication
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await Admin.create({
      username: 'admindashboard',
      email: 'admindashboard@example.com',
      password: hashedPassword,
    });

    token = jwt.sign(
      { adminId: admin.adminId, email: admin.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    // 2. Buat kategori dan penulis (berita butuh ini)
    const category = await Category.create({ name: 'Teknologi', slug: 'teknologi' });
    const author = await Author.create({ name: 'Penulis Dashboard' });

    // 3. Buat 2 berita dummy untuk testing statistik
    const news1 = await News.create({
      title: 'Berita Pertama',
      slug: 'berita-pertama',
      content: '<p>Ini adalah konten berita pertama yang cukup panjang untuk memenuhi validasi minimal 100 karakter. Konten ini berisi informasi yang cukup lengkap dan detail tentang topik yang dibahas dalam berita ini.</p>',
      summary: 'Ringkasan berita pertama',
      imageUrl: 'https://example.com/image1.jpg',
      categoryId: category.categoryId,
      authorId: author.authorId,
      adminId: admin.adminId,
      status: 'published',
      publishedAt: new Date(),
      views: 100, // 100 views untuk testing statistik
    });

    const news2 = await News.create({
      title: 'Berita Kedua',
      slug: 'berita-kedua',
      content: '<p>Ini adalah konten berita kedua yang cukup panjang untuk memenuhi validasi minimal 100 karakter. Konten ini berisi informasi yang cukup lengkap dan detail tentang topik yang dibahas dalam berita ini.</p>',
      summary: 'Ringkasan berita kedua',
      imageUrl: 'https://example.com/image2.jpg',
      categoryId: category.categoryId,
      authorId: author.authorId,
      adminId: admin.adminId,
      status: 'published',
      publishedAt: new Date(),
      views: 50, // 50 views untuk testing statistik (total = 150)
    });

    // 4. Buat 2 komentar dummy untuk testing statistik
    await Comment.create({
      newsId: news1.newsId,
      name: 'User Satu',
      email: 'user1@example.com',
      comment: 'Komentar pertama',
      status: 'Approved', // Approved - bisa ditampilkan
    });

    await Comment.create({
      newsId: news1.newsId,
      name: 'User Dua',
      email: 'user2@example.com',
      comment: 'Komentar kedua',
      status: 'Pending', // Pending - menunggu persetujuan
    });
  });

  /**
   * CLEANUP - Tutup koneksi database
   */
  afterAll(async () => {
    await sequelize.close();
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/dashboard
   * ============================================
   * Menguji endpoint dasar dashboard
   */
  describe('GET /api/dashboard - Dashboard Home', () => {
    /**
     * TEST: Authentication - Harus login untuk akses dashboard
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app).get('/api/dashboard'); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401); // 401 = Unauthorized
    });

    /**
     * TEST: Mengakses dashboard sukses
     * 
     * SKENARIO:
     * - Admin yang sudah login mengakses dashboard
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Response harus berisi pesan sambutan
     */
    it('✅ Berhasil mengakses dashboard', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${token}`); // ✅ Token valid

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('Halo admin'); // Pesan sambutan
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/dashboard/stats
   * ============================================
   * Menguji endpoint untuk mengambil statistik dashboard
   * 
   * STATISTIK YANG DIKEMBALIKAN:
   * - totalNews: Total jumlah berita
   * - totalComments: Total jumlah komentar
   * - totalViews: Total jumlah views dari semua berita
   */
  describe('GET /api/dashboard/stats - Get Dashboard Stats', () => {
    /**
     * TEST: Authentication - Harus login
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app).get('/api/dashboard/stats'); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401);
    });

    /**
     * TEST: Mengambil statistik sukses
     * 
     * SKENARIO:
     * - Admin mengambil statistik dashboard
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Harus mengembalikan totalNews, totalComments, totalViews
     * - Nilai statistik harus sesuai dengan data dummy yang dibuat
     */
    it('✅ Berhasil mengambil statistik dashboard', async () => {
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      // LANGKAH 1: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // LANGKAH 2: Verifikasi struktur data statistik
      expect(res.body.data).toHaveProperty('totalNews'); // Total berita
      expect(res.body.data).toHaveProperty('totalComments'); // Total komentar
      expect(res.body.data).toHaveProperty('totalViews'); // Total views
      
      // LANGKAH 3: Verifikasi nilai statistik sesuai data dummy
      //            (Kita buat 2 berita, 2 komentar, 150 views total)
      expect(res.body.data.totalNews).toBeGreaterThanOrEqual(2); // Minimal 2 berita
      expect(res.body.data.totalComments).toBeGreaterThanOrEqual(2); // Minimal 2 komentar
      expect(res.body.data.totalViews).toBeGreaterThanOrEqual(150); // 100 + 50 = 150 views
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/dashboard/articles
   * ============================================
   * Menguji endpoint untuk mengambil artikel terbaru
   * 
   * FITUR:
   * - Mengambil artikel terbaru (default limit 5)
   * - Bisa custom limit
   * - Pagination support
   * - Setiap artikel memiliki commentsCount (jumlah komentar)
   */
  describe('GET /api/dashboard/articles - Get Recent Articles', () => {
    /**
     * TEST: Authentication - Harus login
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app).get('/api/dashboard/articles'); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401);
    });

    /**
     * TEST: Mengambil artikel terbaru dengan default limit
     * 
     * SKENARIO:
     * - Admin mengambil artikel terbaru tanpa parameter (default limit)
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Harus mengembalikan array artikel
     * - Harus ada informasi pagination
     */
    it('✅ Berhasil mengambil artikel terbaru dengan default limit', async () => {
      const res = await request(app)
        .get('/api/dashboard/articles') // Default limit (biasanya 5)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verifikasi struktur response
      expect(res.body.data).toHaveProperty('articles'); // Array artikel
      expect(res.body.data).toHaveProperty('total'); // Total artikel
      expect(res.body.data).toHaveProperty('currentPage'); // Halaman saat ini
      expect(res.body.data).toHaveProperty('totalPages'); // Total halaman
      expect(Array.isArray(res.body.data.articles)).toBe(true); // Harus array
    });

    /**
     * TEST: Custom limit
     * 
     * SKENARIO:
     * - Admin ingin mengambil hanya 1 artikel terbaru
     */
    it('✅ Berhasil mengambil artikel dengan custom limit', async () => {
      const res = await request(app)
        .get('/api/dashboard/articles?limit=1') // Custom limit: 1 artikel
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.articles.length).toBeLessThanOrEqual(1); // Maksimal 1 artikel
    });

    /**
     * TEST: Pagination artikel
     * 
     * SKENARIO:
     * - Admin menggunakan pagination (page 1, limit 1)
     */
    it('✅ Berhasil pagination artikel', async () => {
      const res = await request(app)
        .get('/api/dashboard/articles?page=1&limit=1') // Page 1, limit 1
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.currentPage).toBe(1); // Halaman saat ini = 1
      expect(res.body.data.articles.length).toBeLessThanOrEqual(1); // Maksimal 1 artikel
    });

    /**
     * TEST: Artikel harus memiliki commentsCount
     * 
     * SKENARIO:
     * - Setiap artikel harus menampilkan jumlah komentar
     * 
     * YANG DICEK:
     * - Setiap artikel harus punya properti commentsCount
     * - commentsCount harus berupa number
     * - Ini berguna untuk dashboard (menampilkan jumlah komentar per artikel)
     */
    it('✅ Artikel harus memiliki commentsCount', async () => {
      const res = await request(app)
        .get('/api/dashboard/articles')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      
      // Verifikasi setiap artikel punya commentsCount
      res.body.data.articles.forEach(article => {
        expect(article).toHaveProperty('commentsCount'); // Harus ada commentsCount
        expect(typeof article.commentsCount).toBe('number'); // Harus number
      });
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/dashboard/comments
   * ============================================
   * Menguji endpoint untuk mengambil komentar terbaru
   * 
   * FITUR:
   * - Mengambil komentar terbaru (default limit 5)
   * - Pagination support
   */
  describe('GET /api/dashboard/comments - Get Recent Comments', () => {
    /**
     * TEST: Authentication - Harus login
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app).get('/api/dashboard/comments'); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401);
    });

    /**
     * TEST: Mengambil komentar terbaru sukses
     * 
     * SKENARIO:
     * - Admin mengambil komentar terbaru
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Harus mengembalikan array komentar
     * - Harus ada informasi pagination
     */
    it('✅ Berhasil mengambil komentar terbaru', async () => {
      const res = await request(app)
        .get('/api/dashboard/comments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verifikasi struktur response
      expect(res.body.data).toHaveProperty('comments'); // Array komentar
      expect(res.body.data).toHaveProperty('total'); // Total komentar
      expect(Array.isArray(res.body.data.comments)).toBe(true); // Harus array
    });

    /**
     * TEST: Pagination komentar
     * 
     * SKENARIO:
     * - Admin menggunakan pagination (page 1, limit 1)
     */
    it('✅ Berhasil pagination komentar', async () => {
      const res = await request(app)
        .get('/api/dashboard/comments?page=1&limit=1') // Page 1, limit 1
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.comments.length).toBeLessThanOrEqual(1); // Maksimal 1 komentar
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/dashboard/articles/all
   * ============================================
   * Menguji endpoint untuk mengambil semua artikel dengan pagination
   * 
   * PERBEDAAN DENGAN /api/dashboard/articles:
   * - Endpoint ini mengambil SEMUA artikel (bukan hanya terbaru)
   * - Pagination lebih lengkap
   */
  describe('GET /api/dashboard/articles/all - Get All Articles Paginated', () => {
    /**
     * TEST: Authentication - Harus login
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app).get('/api/dashboard/articles/all'); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401);
    });

    /**
     * TEST: Mengambil semua artikel dengan pagination sukses
     * 
     * SKENARIO:
     * - Admin mengambil semua artikel dengan pagination
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Harus mengembalikan semua artikel dengan pagination
     */
    it('✅ Berhasil mengambil semua artikel dengan pagination', async () => {
      const res = await request(app)
        .get('/api/dashboard/articles/all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verifikasi struktur response
      expect(res.body.data).toHaveProperty('articles'); // Array artikel
      expect(res.body.data).toHaveProperty('total'); // Total artikel
      expect(res.body.data).toHaveProperty('currentPage'); // Halaman saat ini
      expect(res.body.data).toHaveProperty('totalPages'); // Total halaman
    });

    /**
     * TEST: Pagination dengan custom page dan limit
     * 
     * SKENARIO:
     * - Admin menggunakan pagination dengan page=1 dan limit=1
     */
    it('✅ Berhasil pagination dengan custom page dan limit', async () => {
      const res = await request(app)
        .get('/api/dashboard/articles/all?page=1&limit=1') // Page 1, limit 1
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.currentPage).toBe(1); // Halaman saat ini = 1
      expect(res.body.data.articles.length).toBeLessThanOrEqual(1); // Maksimal 1 artikel
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/dashboard/comments/all
   * ============================================
   * Menguji endpoint untuk mengambil semua komentar dengan pagination
   * 
   * PERBEDAAN DENGAN /api/dashboard/comments:
   * - Endpoint ini mengambil SEMUA komentar (bukan hanya terbaru)
   * - Pagination lebih lengkap
   */
  describe('GET /api/dashboard/comments/all - Get All Comments Paginated', () => {
    /**
     * TEST: Authentication - Harus login
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app).get('/api/dashboard/comments/all'); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401);
    });

    /**
     * TEST: Mengambil semua komentar dengan pagination sukses
     * 
     * SKENARIO:
     * - Admin mengambil semua komentar dengan pagination
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Harus mengembalikan semua komentar dengan pagination
     */
    it('✅ Berhasil mengambil semua komentar dengan pagination', async () => {
      const res = await request(app)
        .get('/api/dashboard/comments/all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verifikasi struktur response
      expect(res.body.data).toHaveProperty('comments'); // Array komentar
      expect(res.body.data).toHaveProperty('total'); // Total komentar
      expect(res.body.data).toHaveProperty('currentPage'); // Halaman saat ini
      expect(res.body.data).toHaveProperty('totalPages'); // Total halaman
    });
  });
});

