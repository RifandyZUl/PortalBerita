/**
 * ============================================
 * TEST FILE: comment.controller.test.js
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji semua operasi yang berhubungan dengan Comment (Komentar).
 * 
 * YANG DITEST:
 * 1. POST /api/comments/:newsId - Membuat komentar baru (public, tidak perlu login)
 * 2. GET /api/comments - Mengambil semua komentar (dengan filter, search, pagination)
 * 3. PATCH /api/comments/:id/status - Mengupdate status komentar (Pending/Approved/Spam)
 * 4. GET /api/comments/public/:slug - Mengambil komentar untuk public (hanya Approved)
 * 5. DELETE /api/comments/:id - Menghapus komentar
 * 
 * CARA KERJA:
 * - Setup: Buat admin, kategori, penulis, dan berita dummy
 * - Test: Test semua operasi CRUD dan validasi
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
let newsId;
let commentId;
let secondCommentId;

describe('🧪 COMMENT CONTROLLER TEST', () => {
  /**
   * SETUP AWAL - Menyiapkan data yang diperlukan
   */
  beforeAll(async () => {
    // Reset database untuk test ini - gunakan cleanup helper
    const { cleanupDatabase } = await import('./helpers/dbCleanup.js');
    await cleanupDatabase();
    
    // 1. Buat admin untuk authentication (untuk test yang memerlukan admin)
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await Admin.create({
      username: 'admincomment',
      email: 'admincomment@example.com',
      password: hashedPassword,
    });

    token = jwt.sign(
      { adminId: admin.adminId, email: admin.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    // 2. Buat kategori dan penulis (berita butuh ini)
    const category = await Category.create({ name: 'Teknologi', slug: 'teknologi' });
    const author = await Author.create({ name: 'Penulis Test' });

    // 3. Buat berita dummy (komentar butuh berita)
    const news = await News.create({
      title: 'Berita Test',
      slug: 'berita-test',
      content: '<p>Ini adalah konten berita test yang cukup panjang untuk memenuhi validasi minimal 100 karakter. Konten ini berisi informasi yang cukup lengkap dan detail tentang topik yang dibahas dalam berita ini.</p>',
      summary: 'Ringkasan berita test',
      imageUrl: 'https://example.com/image.jpg',
      categoryId: category.categoryId,
      authorId: author.authorId,
      adminId: admin.adminId,
      status: 'published', // Published agar bisa diakses public
      publishedAt: new Date(),
    });

    newsId = news.newsId; // Simpan ID untuk digunakan di test
  });

  /**
   * CLEANUP - Tutup koneksi database
   */
  afterAll(async () => {
    await sequelize.close();
  });

  /**
   * ============================================
   * TEST GROUP: POST /api/comments/:newsId (CREATE)
   * ============================================
   * Menguji endpoint untuk membuat komentar baru
   * 
   * PENTING:
   * - Endpoint ini PUBLIC (tidak perlu login) - siapa saja bisa komentar
   * - Komentar baru otomatis status 'Pending' (menunggu persetujuan admin)
   * - Ada validasi: name, email, comment wajib diisi
   */
  describe('POST /api/comments/:newsId - Create Comment', () => {
    /**
     * TEST: Validasi - name wajib diisi
     * 
     * SKENARIO:
     * - User mencoba membuat komentar TANPA mengirim name
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 400
     */
    it('❌ Harus gagal jika name tidak dikirim', async () => {
      const res = await request(app)
        .post(`/api/comments/${newsId}`)
        .send({
          // name TIDAK dikirim - ini yang kita test
          email: 'test@example.com',
          comment: 'Test comment',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('wajib diisi'); // Pesan error harus jelas
    });

    /**
     * TEST: Validasi - email wajib diisi
     */
    it('❌ Harus gagal jika email tidak dikirim', async () => {
      const res = await request(app)
        .post(`/api/comments/${newsId}`)
        .send({
          name: 'Test User',
          // email TIDAK dikirim
          comment: 'Test comment',
        });

      expect(res.statusCode).toBe(400);
    });

    /**
     * TEST: Validasi - comment (isi komentar) wajib diisi
     */
    it('❌ Harus gagal jika comment tidak dikirim', async () => {
      const res = await request(app)
        .post(`/api/comments/${newsId}`)
        .send({
          name: 'Test User',
          email: 'test@example.com',
          // comment TIDAK dikirim
        });

      expect(res.statusCode).toBe(400);
    });

    /**
     * TEST: Edge case - newsId tidak ditemukan
     * 
     * SKENARIO:
     * - User mencoba membuat komentar untuk berita yang tidak ada
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 404
     */
    it('❌ Harus gagal jika newsId tidak ditemukan', async () => {
      const res = await request(app)
        .post('/api/comments/99999') // ❌ ID berita tidak ada
        .send({
          name: 'Test User',
          email: 'test@example.com',
          comment: 'Test comment',
        });

      expect(res.statusCode).toBe(404); // 404 = Not Found
      expect(res.body.success).toBe(false);
    });

    /**
     * TEST: Membuat komentar sukses (Happy Path)
     * 
     * SKENARIO:
     * - User membuat komentar dengan data yang valid
     * 
     * YANG DICEK:
     * - Status harus 201 (Created)
     * - Response harus sukses
     * - Data komentar harus lengkap
     * - Status otomatis 'Pending' (menunggu persetujuan)
     */
    it('✅ Berhasil membuat komentar baru', async () => {
      // LANGKAH 1: Kirim request untuk membuat komentar
      const res = await request(app)
        .post(`/api/comments/${newsId}`) // ✅ newsId valid
        .send({
          name: 'Test User', // ✅ Name ada
          email: 'test@example.com', // ✅ Email ada
          comment: 'Ini adalah komentar test', // ✅ Comment ada
        });

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(201); // 201 = Created
      expect(res.body.success).toBe(true);
      
      // LANGKAH 3: Verifikasi data komentar
      expect(res.body.data).toHaveProperty('commentId'); // Harus ada ID
      expect(res.body.data.name).toBe('Test User'); // Name sesuai
      expect(res.body.data.email).toBe('test@example.com'); // Email sesuai
      expect(res.body.data.status).toBe('Pending'); // Status otomatis Pending (belum disetujui)
      
      // Simpan ID untuk digunakan di test lain
      commentId = res.body.data.commentId;
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/comments (READ)
   * ============================================
   * Menguji endpoint untuk mengambil semua komentar
   * 
   * FITUR:
   * - Filter berdasarkan status (Pending/Approved/Spam)
   * - Search komentar berdasarkan isi komentar
   * - Pagination (page, limit)
   */
  describe('GET /api/comments - Get All Comments', () => {
    /**
     * TEST: Mengambil semua komentar (Happy Path)
     * 
     * SKENARIO:
     * - Admin mengakses endpoint untuk melihat semua komentar
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Harus mengembalikan array komentar
     * - Harus ada informasi pagination
     */
    it('✅ Berhasil mengambil semua komentar', async () => {
      // LANGKAH 1: Buat komentar kedua untuk testing
      const createRes = await request(app)
        .post(`/api/comments/${newsId}`)
        .send({
          name: 'User Kedua',
          email: 'user2@example.com',
          comment: 'Komentar kedua',
        });
      secondCommentId = createRes.body.data.commentId;

      // LANGKAH 2: Ambil semua komentar
      const res = await request(app).get('/api/comments');

      // LANGKAH 3: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.comments).toBeInstanceOf(Array); // Harus array
      expect(res.body.data.comments.length).toBeGreaterThanOrEqual(2); // Minimal 2 komentar
      
      // LANGKAH 4: Verifikasi pagination ada
      expect(res.body.data.pagination).toHaveProperty('totalItems'); // Total item
      expect(res.body.data.pagination).toHaveProperty('totalPages'); // Total halaman
    });

    /**
     * TEST: Filter komentar berdasarkan status
     * 
     * SKENARIO:
     * - Admin ingin melihat hanya komentar dengan status 'Pending'
     * 
     * YANG DICEK:
     * - Semua komentar yang dikembalikan harus status 'Pending'
     * - Ini berguna untuk admin melihat komentar yang perlu disetujui
     */
    it('✅ Berhasil filter komentar berdasarkan status', async () => {
      const res = await request(app).get('/api/comments?status=Pending'); // Filter hanya Pending

      expect(res.statusCode).toBe(200);
      // Verifikasi semua komentar yang dikembalikan statusnya Pending
      expect(res.body.data.comments.every(c => c.status === 'Pending')).toBe(true);
    });

    /**
     * TEST: Search komentar
     * 
     * SKENARIO:
     * - Admin mencari komentar yang mengandung kata "kedua"
     * 
     * YANG DICEK:
     * - Harus mengembalikan komentar yang mengandung kata tersebut
     * - Search bersifat case-insensitive (tidak peduli huruf besar/kecil)
     */
    it('✅ Berhasil search komentar', async () => {
      const res = await request(app).get('/api/comments?search=kedua'); // Cari kata "kedua"

      expect(res.statusCode).toBe(200);
      expect(res.body.data.comments.length).toBeGreaterThan(0); // Harus ada hasil
    });

    /**
     * TEST: Pagination komentar
     * 
     * SKENARIO:
     * - Admin ingin melihat komentar dengan pagination (1 komentar per halaman)
     * 
     * YANG DICEK:
     * - Harus mengembalikan maksimal 1 komentar (sesuai limit)
     * - Ini berguna untuk performa (tidak load semua komentar sekaligus)
     */
    it('✅ Berhasil pagination komentar', async () => {
      const res = await request(app).get('/api/comments?page=1&limit=1'); // 1 komentar per halaman

      expect(res.statusCode).toBe(200);
      expect(res.body.data.comments.length).toBeLessThanOrEqual(1); // Maksimal 1 komentar
    });
  });

  /**
   * ============================================
   * TEST GROUP: PATCH /api/comments/:id/status (UPDATE STATUS)
   * ============================================
   * Menguji endpoint untuk mengupdate status komentar
   * 
   * STATUS YANG TERSEDIA:
   * - Pending: Komentar baru, menunggu persetujuan
   * - Approved: Komentar disetujui, bisa ditampilkan di public
   * - Spam: Komentar dianggap spam, tidak ditampilkan
   */
  describe('PATCH /api/comments/:id/status - Update Comment Status', () => {
    /**
     * TEST: Validasi - status wajib diisi
     * 
     * SKENARIO:
     * - Admin mencoba update status TANPA mengirim status
     */
    it('❌ Harus gagal jika status tidak dikirim', async () => {
      const res = await request(app)
        .patch(`/api/comments/${commentId}/status`)
        .send({}); // ❌ Tidak ada status

      expect(res.statusCode).toBe(400); // 400 = Bad Request
    });

    /**
     * TEST: Edge case - Komentar tidak ditemukan
     */
    it('❌ Harus gagal jika comment tidak ditemukan', async () => {
      const res = await request(app)
        .patch('/api/comments/99999/status') // ❌ ID tidak ada
        .send({ status: 'Approved' });

      expect(res.statusCode).toBe(404); // 404 = Not Found
    });

    /**
     * TEST: Update status ke Approved
     * 
     * SKENARIO:
     * - Admin menyetujui komentar (mengubah dari Pending ke Approved)
     * 
     * YANG DICEK:
     * - Status harus berubah menjadi 'Approved'
     * - Komentar dengan status Approved bisa ditampilkan di public
     */
    it('✅ Berhasil mengupdate status komentar ke Approved', async () => {
      // LANGKAH 1: Update status komentar menjadi Approved
      const res = await request(app)
        .patch(`/api/comments/${commentId}/status`)
        .send({ status: 'Approved' }); // Setujui komentar

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // LANGKAH 3: Verifikasi status sudah berubah
      expect(res.body.data.status).toBe('Approved'); // Status sekarang Approved
    });

    /**
     * TEST: Update status ke Spam
     * 
     * SKENARIO:
     * - Admin menandai komentar sebagai spam
     * 
     * YANG DICEK:
     * - Status harus berubah menjadi 'Spam'
     * - Komentar spam tidak ditampilkan di public
     */
    it('✅ Berhasil mengupdate status komentar ke Spam', async () => {
      const res = await request(app)
        .patch(`/api/comments/${secondCommentId}/status`)
        .send({ status: 'Spam' }); // Tandai sebagai spam

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('Spam'); // Status sekarang Spam
    });
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/comments/public/:slug (PUBLIC ENDPOINT)
   * ============================================
   * Menguji endpoint untuk mengambil komentar yang ditampilkan di public
   * 
   * PENTING:
   * - Endpoint ini PUBLIC (tidak perlu login)
   * - Hanya menampilkan komentar dengan status 'Approved'
   * - Komentar Pending dan Spam TIDAK ditampilkan
   */
  describe('GET /api/comments/public/:slug - Get Comments by News Slug', () => {
    /**
     * TEST: Edge case - Slug berita tidak ditemukan
     */
    it('❌ Harus gagal jika slug tidak ditemukan', async () => {
      const res = await request(app).get('/api/comments/public/nonexistent-slug'); // ❌ Slug tidak ada

      expect(res.statusCode).toBe(404); // 404 = Not Found
    });

    /**
     * TEST: Mengambil komentar approved untuk public
     * 
     * SKENARIO:
     * - User biasa mengakses komentar untuk berita tertentu
     * 
     * YANG DICEK:
     * - Hanya komentar dengan status 'Approved' yang ditampilkan
     * - Komentar Pending dan Spam TIDAK ditampilkan
     * - Ini penting untuk keamanan (hanya komentar yang sudah disetujui)
     */
    it('✅ Berhasil mengambil komentar yang approved untuk news slug', async () => {
      // LANGKAH 1: Ambil komentar untuk berita dengan slug 'berita-test'
      const res = await request(app).get('/api/comments/public/berita-test');

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true); // Harus array
      
      // LANGKAH 3: Verifikasi hanya komentar Approved yang ditampilkan
      //            (Pending dan Spam tidak boleh muncul)
      res.body.forEach(comment => {
        expect(comment.status).toBe('Approved'); // Semua harus Approved
      });
    });
  });

  /**
   * ============================================
   * TEST GROUP: DELETE /api/comments/:id (DELETE)
   * ============================================
   * Menguji endpoint untuk menghapus komentar
   */
  describe('DELETE /api/comments/:id - Delete Comment', () => {
    /**
     * TEST: Edge case - Komentar tidak ditemukan
     */
    it('❌ Harus gagal jika comment tidak ditemukan', async () => {
      const res = await request(app).delete('/api/comments/99999'); // ❌ ID tidak ada

      expect(res.statusCode).toBe(404);
    });

    /**
     * TEST: Menghapus komentar sukses
     * 
     * SKENARIO:
     * - Admin menghapus komentar
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Komentar harus benar-benar terhapus dari database
     */
    it('✅ Berhasil menghapus komentar', async () => {
      // LANGKAH 1: Hapus komentar
      const res = await request(app).delete(`/api/comments/${secondCommentId}`); // ✅ ID valid

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // LANGKAH 3: Verifikasi komentar benar-benar terhapus dari database
      //            Cek langsung ke database, bukan hanya response
      const deletedComment = await Comment.findByPk(secondCommentId);
      expect(deletedComment).toBeNull(); // Harus null (sudah terhapus)
    });
  });
});

