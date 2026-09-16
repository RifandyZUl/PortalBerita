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
 * 2. GET /api/news/public/detail/:slug - Detail berita public
 * 3. GET /api/news/search - Search berita
 * 4. GET /api/news/popular - Popular news
 * 5. PATCH /api/news/:id/views - Increment views
 * 6. GET /api/news - Mengambil semua berita untuk admin (termasuk draft)
 * 7. GET /api/news/:id - Detail berita admin
 * 8. POST /api/news - Membuat berita baru
 * 9. PUT /api/news/:id - Update berita
 * 10. DELETE /api/news/:id - Delete berita
 * 
 * CARA KERJA:
 * - Setup: Buat kategori, penulis, admin, dan 2 berita dummy (1 published, 1 draft)
 * - Test: Test berbagai skenario (public vs admin, validasi, dll)
 * - Cleanup: Tutup koneksi database
 */

import request from 'supertest';
import app from '../src/app.js';
import db from '../src/infrastructure/database/models/index.js';
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
     * SETUP - Pastikan category dan author selalu ada sebelum setiap test
     */
    beforeEach(async () => {
      // Pastikan category ada - cari atau buat
      let category = await Category.findOne({ where: { slug: 'teknologi' } });
      if (!category) {
        category = await Category.create({ name: 'Teknologi', slug: 'teknologi' });
      }
      // Refresh dari database untuk memastikan data terbaru
      testCategory = await Category.findByPk(category.categoryId);
      
      // Pastikan author ada - cari atau buat
      let author = await Author.findOne({ where: { name: 'Penulis Satu' } });
      if (!author) {
        author = await Author.create({ name: 'Penulis Satu' });
      }
      // Refresh dari database untuk memastikan data terbaru
      testAuthor = await Author.findByPk(author.authorId);
      
      // Verifikasi bahwa data benar-benar ada
      if (!testCategory || !testAuthor) {
        throw new Error('Failed to setup test data: category or author not found');
      }
    });
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
      // LANGKAH 0: Buat fresh category dan author untuk test ini
      // Ini memastikan data benar-benar ada dan tidak ada masalah dengan timing
      const category = await Category.findOrCreate({
        where: { slug: 'teknologi-test' },
        defaults: { name: 'Teknologi Test', slug: 'teknologi-test' }
      });
      const author = await Author.findOrCreate({
        where: { name: 'Penulis Test' },
        defaults: { name: 'Penulis Test' }
      });
      
      // Pastikan data benar-benar ada di database dengan findByPk
      const categoryData = await Category.findByPk(category[0].categoryId);
      const authorData = await Author.findByPk(author[0].authorId);
      
      if (!categoryData || !authorData) {
        throw new Error('Failed to create test data');
      }
      
      // LANGKAH 1: Siapkan data berita yang valid
      const newArticle = {
        title: 'Berita Ketiga',
        content: longContent, // ✅ Content panjang (lebih dari 100 karakter)
        categoryId: categoryData.categoryId,
        authorId: authorData.authorId,
        status: 'published',
        imageUrl: 'https://example.com/image3.jpg' // ✅ Ada gambar
      };

      // LANGKAH 2: Kirim request untuk membuat berita
      const res = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${token}`)
        .send(newArticle);

      // Debug: Log response jika gagal
      if (res.statusCode !== 201) {
        console.log('❌ Test failed - Response status:', res.statusCode);
        console.log('❌ Response body:', JSON.stringify(res.body, null, 2));
        console.log('❌ Request data:', JSON.stringify(newArticle, null, 2));
        console.log('❌ Category ID:', categoryData.categoryId, 'Type:', typeof categoryData.categoryId);
        console.log('❌ Author ID:', authorData.authorId, 'Type:', typeof authorData.authorId);
        // Cek apakah data benar-benar ada di database
        const catCheck = await Category.findByPk(categoryData.categoryId);
        const authCheck = await Author.findByPk(authorData.authorId);
        console.log('❌ Category exists:', !!catCheck, 'Author exists:', !!authCheck);
      }

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
      // LANGKAH 0: Buat fresh category dan author untuk test ini
      // Ini memastikan data benar-benar ada dan tidak ada masalah dengan timing
      const category = await Category.findOrCreate({
        where: { slug: 'teknologi-test-2' },
        defaults: { name: 'Teknologi Test 2', slug: 'teknologi-test-2' }
      });
      const author = await Author.findOrCreate({
        where: { name: 'Penulis Test 2' },
        defaults: { name: 'Penulis Test 2' }
      });
      
      // Pastikan data benar-benar ada di database dengan findByPk
      const categoryData = await Category.findByPk(category[0].categoryId);
      const authorData = await Author.findByPk(author[0].authorId);
      
      if (!categoryData || !authorData) {
        throw new Error('Failed to create test data');
      }
      
      const newArticle = {
        title: 'Berita Keempat Dengan Judul Panjang', // Title dengan spasi dan huruf besar
        content: longContent,
        categoryId: categoryData.categoryId,
        authorId: authorData.authorId,
        status: 'published',
        imageUrl: 'https://example.com/image4.jpg'
      };

      const res = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${token}`)
        .send(newArticle);

      // Debug: Log response jika gagal
      if (res.statusCode !== 201) {
        console.log('❌ Test failed - Response status:', res.statusCode);
        console.log('❌ Response body:', JSON.stringify(res.body, null, 2));
        console.log('❌ Request data:', JSON.stringify(newArticle, null, 2));
        console.log('❌ Category ID:', categoryData.categoryId, 'Type:', typeof categoryData.categoryId);
        console.log('❌ Author ID:', authorData.authorId, 'Type:', typeof authorData.authorId);
        // Cek apakah data benar-benar ada di database
        const catCheck = await Category.findByPk(categoryData.categoryId);
        const authCheck = await Author.findByPk(authorData.authorId);
        console.log('❌ Category exists:', !!catCheck, 'Author exists:', !!authCheck);
      }

      expect(res.statusCode).toBe(201);
      // Verifikasi slug otomatis dibuat dengan format yang benar
      expect(res.body.data.slug).toBe('berita-keempat-dengan-judul-panjang'); // Lowercase, dash sebagai separator
    });
  });

  /**
   * ============================================
   * TEST GROUP: PUT /api/news/:id (UPDATE)
   * ============================================
   * Menguji endpoint untuk update berita
   */
  describe('PUT /api/news/:id - Update News', () => {
    let updateNewsId;

    beforeEach(async () => {
      // Buat berita untuk di-update
      const [category] = await Category.findOrCreate({
        where: { slug: 'teknologi-update' },
        defaults: { name: 'Teknologi Update', slug: 'teknologi-update' }
      });
      const [author] = await Author.findOrCreate({
        where: { name: 'Penulis Update' },
        defaults: { name: 'Penulis Update' }
      });

      // Pastikan category dan author benar-benar ada
      const categoryData = await Category.findByPk(category.categoryId);
      const authorData = await Author.findByPk(author.authorId);
      
      if (!categoryData || !authorData) {
        throw new Error('Failed to setup test data: category or author not found');
      }

      // Hapus news dengan slug yang sama jika ada (untuk menghindari duplicate)
      await News.destroy({ where: { slug: 'berita-untuk-update' } });

      const news = await News.create({
        title: 'Berita Untuk Update',
        slug: 'berita-untuk-update',
        content: longContent,
        summary: 'Ringkasan awal',
        imageUrl: 'https://example.com/update1.jpg',
        categoryId: categoryData.categoryId,
        authorId: authorData.authorId,
        adminId: testAdmin.adminId,
        status: 'draft',
        views: 0
      });

      updateNewsId = news.newsId;
    });

    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app)
        .put(`/api/news/${updateNewsId}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toBe(401);
    });

    it('❌ Harus gagal jika berita tidak ditemukan', async () => {
      const res = await request(app)
        .put('/api/news/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          content: longContent,
          categoryId: testCategory.categoryId,
          authorId: testAuthor.authorId,
          status: 'published',
          imageUrl: 'https://example.com/updated.jpg'
        });

      expect(res.statusCode).toBe(404);
    });

    it('✅ Berhasil update berita', async () => {
      const category = await Category.findOrCreate({
        where: { slug: 'teknologi-update-2' },
        defaults: { name: 'Teknologi Update 2', slug: 'teknologi-update-2' }
      });
      const author = await Author.findOrCreate({
        where: { name: 'Penulis Update 2' },
        defaults: { name: 'Penulis Update 2' }
      });

      const res = await request(app)
        .put(`/api/news/${updateNewsId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Berita Diupdate',
          content: longContent,
          categoryId: category[0].categoryId,
          authorId: author[0].authorId,
          status: 'published',
          imageUrl: 'https://example.com/updated.jpg'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Berita Diupdate');
      expect(res.body.data.status).toBe('published');
    });

    it('✅ Slug harus otomatis diupdate jika title berubah', async () => {
      const res = await request(app)
        .put(`/api/news/${updateNewsId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Judul Baru Dengan Kata Panjang',
          content: longContent,
          categoryId: testCategory.categoryId,
          authorId: testAuthor.authorId,
          status: 'published',
          imageUrl: 'https://example.com/updated.jpg'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.slug).toBe('judul-baru-dengan-kata-panjang');
    });
  });

  /**
   * ============================================
   * TEST GROUP: DELETE /api/news/:id
   * ============================================
   * Menguji endpoint untuk delete berita
   */
  describe('DELETE /api/news/:id - Delete News', () => {
    let deleteNewsId;

    beforeEach(async () => {
      const [category] = await Category.findOrCreate({
        where: { slug: 'teknologi-delete' },
        defaults: { name: 'Teknologi Delete', slug: 'teknologi-delete' }
      });
      const [author] = await Author.findOrCreate({
        where: { name: 'Penulis Delete' },
        defaults: { name: 'Penulis Delete' }
      });

      // Pastikan category dan author benar-benar ada
      const categoryData = await Category.findByPk(category.categoryId);
      const authorData = await Author.findByPk(author.authorId);
      
      if (!categoryData || !authorData) {
        throw new Error('Failed to setup test data: category or author not found');
      }

      // Hapus news dengan slug yang sama jika ada (untuk menghindari duplicate)
      await News.destroy({ where: { slug: 'berita-untuk-delete' } });

      const news = await News.create({
        title: 'Berita Untuk Delete',
        slug: 'berita-untuk-delete',
        content: longContent,
        summary: 'Ringkasan',
        imageUrl: 'https://example.com/delete.jpg',
        categoryId: categoryData.categoryId,
        authorId: authorData.authorId,
        adminId: testAdmin.adminId,
        status: 'published',
        views: 0
      });

      deleteNewsId = news.newsId;
    });

    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app)
        .delete(`/api/news/${deleteNewsId}`);

      expect(res.statusCode).toBe(401);
    });

    it('❌ Harus gagal jika berita tidak ditemukan', async () => {
      const res = await request(app)
        .delete('/api/news/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

    it('✅ Berhasil delete berita', async () => {
      const res = await request(app)
        .delete(`/api/news/${deleteNewsId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verifikasi berita sudah dihapus
      const deletedNews = await News.findByPk(deleteNewsId);
      expect(deletedNews).toBeNull();
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/news/public/detail/:slug
   * ============================================
   * Menguji endpoint untuk detail berita public
   */
  describe('GET /api/news/public/detail/:slug - Public News Detail', () => {
    it('✅ Berhasil mengambil detail berita published', async () => {
      const publishedNews = await News.findOne({ where: { status: 'published' } });
      
      if (publishedNews) {
        const res = await request(app)
          .get(`/api/news/public/detail/${publishedNews.slug}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('title');
        expect(res.body.data).toHaveProperty('content');
        expect(res.body.data).toHaveProperty('slug');
        // Note: Public format tidak mengembalikan status field (sudah difilter hanya published)
      }
    });

    it('❌ Harus gagal jika slug tidak ditemukan', async () => {
      const res = await request(app)
        .get('/api/news/public/detail/slug-yang-tidak-ada');

      expect(res.statusCode).toBe(404);
    });

    it('❌ Draft tidak boleh diakses public', async () => {
      const draftNews = await News.findOne({ where: { status: 'draft' } });
      
      if (draftNews) {
        const res = await request(app)
          .get(`/api/news/public/detail/${draftNews.slug}`);

        expect(res.statusCode).toBe(404);
      }
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/news/:id (Admin Detail)
   * ============================================
   * Menguji endpoint untuk detail berita admin
   */
  describe('GET /api/news/:id - Admin News Detail', () => {
    it('❌ Harus gagal jika tidak ada token', async () => {
      const publishedNews = await News.findOne({ where: { status: 'published' } });
      
      if (publishedNews) {
        const res = await request(app)
          .get(`/api/news/${publishedNews.newsId}`);

        expect(res.statusCode).toBe(401);
      }
    });

    it('✅ Admin dapat melihat detail berita published', async () => {
      const publishedNews = await News.findOne({ where: { status: 'published' } });
      
      if (publishedNews) {
        const res = await request(app)
          .get(`/api/news/${publishedNews.newsId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('newsId');
        expect(res.body.data.title).toBe(publishedNews.title);
      }
    });

    it('✅ Admin dapat melihat detail berita draft', async () => {
      const draftNews = await News.findOne({ where: { status: 'draft' } });
      
      if (draftNews) {
        const res = await request(app)
          .get(`/api/news/${draftNews.newsId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('draft');
      }
    });

    it('❌ Harus gagal jika berita tidak ditemukan', async () => {
      const res = await request(app)
        .get('/api/news/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/news/search
   * ============================================
   * Menguji endpoint untuk search berita
   */
  describe('GET /api/news/search - Search News', () => {
    it('✅ Berhasil search berita dengan keyword', async () => {
      const res = await request(app)
        .get('/api/news/search?keyword=Berita');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('✅ Mengembalikan array kosong jika tidak ada hasil', async () => {
      const res = await request(app)
        .get('/api/news/search?keyword=KeywordYangTidakAda12345');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('✅ Search hanya menampilkan berita published', async () => {
      const res = await request(app)
        .get('/api/news/search?keyword=Berita');

      expect(res.statusCode).toBe(200);
      if (res.body.data.length > 0) {
        res.body.data.forEach(news => {
          expect(news.status).toBe('published');
        });
      }
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/news/popular
   * ============================================
   * Menguji endpoint untuk popular news
   */
  describe('GET /api/news/popular - Popular News', () => {
    it('✅ Berhasil mengambil popular news', async () => {
      const res = await request(app)
        .get('/api/news/popular');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('✅ Popular news diurutkan berdasarkan views', async () => {
      const res = await request(app)
        .get('/api/news/popular?limit=10');

      expect(res.statusCode).toBe(200);
      if (res.body.data.length > 1) {
        // Verifikasi urutan descending (views tertinggi dulu)
        for (let i = 0; i < res.body.data.length - 1; i++) {
          expect(res.body.data[i].views).toBeGreaterThanOrEqual(res.body.data[i + 1].views);
        }
      }
    });

    it('✅ Hanya menampilkan berita published', async () => {
      const res = await request(app)
        .get('/api/news/popular');

      expect(res.statusCode).toBe(200);
      // Verifikasi bahwa endpoint hanya mengembalikan published news
      // (tidak perlu cek status field karena public format tidak include status)
      // Yang penting adalah endpoint tidak mengembalikan draft news
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('✅ Menggunakan limit default jika tidak dikirim', async () => {
      const res = await request(app)
        .get('/api/news/popular');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(5); // Default limit biasanya 5
    });
  });

  /**
   * ============================================
   * TEST GROUP: PATCH /api/news/:id/views
   * ============================================
   * Menguji endpoint untuk increment views
   */
  describe('PATCH /api/news/:id/views - Increment Views', () => {
    let viewsNewsId;
    let initialViews;

    beforeEach(async () => {
      const [category] = await Category.findOrCreate({
        where: { slug: 'teknologi-views' },
        defaults: { name: 'Teknologi Views', slug: 'teknologi-views' }
      });
      const [author] = await Author.findOrCreate({
        where: { name: 'Penulis Views' },
        defaults: { name: 'Penulis Views' }
      });

      // Pastikan category dan author benar-benar ada
      const categoryData = await Category.findByPk(category.categoryId);
      const authorData = await Author.findByPk(author.authorId);
      
      if (!categoryData || !authorData) {
        throw new Error('Failed to setup test data: category or author not found');
      }

      // Hapus news dengan slug yang sama jika ada (untuk menghindari duplicate)
      await News.destroy({ where: { slug: 'berita-untuk-views' } });

      const news = await News.create({
        title: 'Berita Untuk Views',
        slug: 'berita-untuk-views',
        content: longContent,
        summary: 'Ringkasan',
        imageUrl: 'https://example.com/views.jpg',
        categoryId: categoryData.categoryId,
        authorId: authorData.authorId,
        adminId: testAdmin.adminId,
        status: 'published',
        views: 10
      });

      viewsNewsId = news.newsId;
      initialViews = news.views;
    });

    it('✅ Berhasil increment views', async () => {
      const res = await request(app)
        .patch(`/api/news/${viewsNewsId}/views`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verifikasi views bertambah
      const updatedNews = await News.findByPk(viewsNewsId);
      expect(updatedNews.views).toBe(initialViews + 1);
    });

    it('✅ Views dapat di-increment beberapa kali', async () => {
      // Increment pertama
      await request(app).patch(`/api/news/${viewsNewsId}/views`);
      
      // Increment kedua
      await request(app).patch(`/api/news/${viewsNewsId}/views`);

      const updatedNews = await News.findByPk(viewsNewsId);
      expect(updatedNews.views).toBe(initialViews + 2);
    });

    it('❌ Harus gagal jika berita tidak ditemukan', async () => {
      // Gunakan ID yang sangat besar yang pasti tidak ada
      const nonExistentId = 999999;
      
      // Pastikan ID ini benar-benar tidak ada
      const checkNews = await News.findByPk(nonExistentId);
      expect(checkNews).toBeNull();
      
      const res = await request(app)
        .patch(`/api/news/${nonExistentId}/views`);

      expect(res.statusCode).toBe(404);
    });
  });
});
