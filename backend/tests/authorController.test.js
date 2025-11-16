/**
 * ============================================
 * TEST FILE: authorController.test.js
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji endpoint yang berhubungan dengan Author (Penulis).
 * 
 * YANG DITEST:
 * 1. GET /api/authors - Mengambil daftar semua penulis
 * 2. Validasi authorId saat membuat berita baru
 * 
 * CARA KERJA:
 * - Sebelum test: Setup database dan buat data dummy (penulis, admin, token)
 * - Selama test: Test berbagai skenario (sukses, gagal, edge cases)
 * - Setelah test: Tutup koneksi database
 */

import request from 'supertest';
import app from '../app.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { sequelize, Author, Admin, Category } = db;

let testAdmin, token;
let authorIds = [];

describe('🧪 AUTHOR CONTROLLER TEST', () => {
  /**
   * SETUP AWAL - Dijalankan sekali sebelum semua test
   * Tujuan: Menyiapkan data yang diperlukan untuk testing
   */
  beforeAll(async () => {
    // Reset database untuk test ini - gunakan cleanup helper
    const { cleanupDatabase } = await import('./helpers/dbCleanup.js');
    await cleanupDatabase();
    
    // 1. Buat 3 penulis dummy untuk testing
    //    Ini seperti kita punya 3 penulis di database
    const authors = await Author.bulkCreate([
      { name: 'Penulis Satu' },
      { name: 'Penulis Dua' },
      { name: 'Penulis Tiga' },
    ]);
    authorIds = authors.map(a => a.authorId); // Simpan ID untuk digunakan di test lain

    // 3. Buat admin dummy untuk authentication
    //    Password di-hash dengan bcrypt (seperti di production)
    const hashedPassword = await bcrypt.hash('123456', 10);
    testAdmin = await Admin.create({
      username: 'admin1',
      email: 'admin1@example.com',
      password: hashedPassword
    });
    
    // 4. Generate JWT token untuk authentication
    //    Token ini digunakan untuk request yang memerlukan login
    token = jwt.sign(
      { adminId: testAdmin.adminId, email: testAdmin.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
  });

  /**
   * CLEANUP - Dijalankan sekali setelah semua test selesai
   * Tujuan: Menutup koneksi database agar tidak ada memory leak
   */
  afterAll(async () => {
    await sequelize.close();
  });

  /**
   * ============================================
   * TEST GROUP: GET /api/authors
   * ============================================
   * Menguji endpoint untuk mengambil daftar semua penulis
   */
  describe('GET /api/authors - Get All Authors', () => {
    /**
     * TEST: Mengambil semua penulis (Happy Path)
     * 
     * SKENARIO:
     * - User memanggil endpoint GET /api/authors
     * - Sistem mengembalikan daftar semua penulis
     * 
     * YANG DICEK:
     * 1. Status code harus 200 (OK)
     * 2. Response harus sukses (success: true)
     * 3. Data harus berupa array
     * 4. Harus ada minimal 3 penulis (karena kita buat 3 di setup)
     * 5. Setiap penulis harus punya authorId dan name
     */
    it('✅ Berhasil mengambil semua penulis', async () => {
      // LANGKAH 1: Kirim request GET ke endpoint /api/authors
      const res = await request(app).get('/api/authors');
      
      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200); // HTTP status harus 200 (OK)
      expect(res.body.success).toBe(true); // Response harus sukses
      expect(Array.isArray(res.body.data)).toBe(true); // Data harus array
      expect(res.body.data.length).toBeGreaterThanOrEqual(3); // Minimal 3 penulis
      
      // LANGKAH 3: Verifikasi struktur data penulis pertama
      expect(res.body.data[0]).toHaveProperty('authorId'); // Harus punya ID
      expect(res.body.data[0]).toHaveProperty('name'); // Harus punya nama
    });

    /**
     * TEST: Validasi struktur data penulis
     * 
     * SKENARIO:
     * - Memastikan setiap penulis punya struktur data yang benar
     * 
     * YANG DICEK:
     * - Setiap penulis harus punya authorId (number) dan name (string)
     */
    it('✅ Data penulis harus memiliki struktur yang benar', async () => {
      const res = await request(app).get('/api/authors');
      
      expect(res.statusCode).toBe(200);
      
      // Loop setiap penulis dan cek strukturnya
      res.body.data.forEach(author => {
        expect(author).toHaveProperty('authorId'); // Harus ada authorId
        expect(author).toHaveProperty('name'); // Harus ada name
        expect(typeof author.authorId).toBe('number'); // authorId harus number
        expect(typeof author.name).toBe('string'); // name harus string
      });
    });

    /**
     * TEST: Edge case - Tidak ada penulis di database
     * 
     * SKENARIO:
     * - Hapus semua penulis dari database
     * - Coba ambil daftar penulis
     * 
     * YANG DICEK:
     * - Sistem harus mengembalikan array kosong, bukan error
     */
    it('✅ Harus mengembalikan array kosong jika tidak ada penulis', async () => {
      // LANGKAH 1: Hapus semua news yang mereferensi authors (foreign key constraint) 
      const { News } = db;
      await News.destroy({ where: {} });
      
      // LANGKAH 2: Hapus semua penulis dari database
      await Author.destroy({ where: {} });
      
      // LANGKAH 3: Coba ambil daftar penulis
      const res = await request(app).get('/api/authors');
      
      // LANGKAH 3: Verifikasi response
      expect(res.statusCode).toBe(200); // Tetap 200, bukan error
      expect(res.body.success).toBe(true); // Tetap sukses
      expect(res.body.data).toEqual([]); // Data harus array kosong
    });
  });

  /**
   * ============================================
   * TEST GROUP: Validasi Author saat Membuat Berita
   * ============================================
   * Menguji bahwa sistem memvalidasi authorId saat membuat berita baru
   */
  describe('POST /api/news - News Creation Validation (Author Related)', () => {
    /**
     * SETUP untuk test group ini
     * Tujuan: Memastikan ada data penulis dan kategori untuk testing
     */
    beforeAll(async () => {
      // Jika penulis sudah dihapus di test sebelumnya, buat lagi
      if (authorIds.length === 0) {
        const authors = await Author.bulkCreate([
          { name: 'Penulis Satu' },
          { name: 'Penulis Dua' },
        ]);
        authorIds = authors.map(a => a.authorId);
      }

      // Buat kategori dummy untuk test (berita butuh kategori)
      await Category.create({ name: 'Test Category', slug: 'test-category' });
    });

    /**
     * TEST: Validasi - authorId wajib diisi
     * 
     * SKENARIO:
     * - User mencoba membuat berita tanpa mengirim authorId
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 400 (Bad Request)
     * - Ini penting karena setiap berita HARUS punya penulis
     */
    it('❌ Harus gagal jika authorId tidak dikirim', async () => {
      // LANGKAH 1: Kirim request POST untuk membuat berita
      //            Tapi TIDAK mengirim authorId (field wajib)
      const res = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${token}`) // Butuh token untuk autentikasi
        .send({ 
          title: 'Berita Tanpa Author',
          // authorId TIDAK dikirim - ini yang kita test
          content: '<p>Ini adalah konten berita yang cukup panjang untuk memenuhi validasi minimal 100 karakter. Konten ini berisi informasi yang cukup lengkap dan detail tentang topik yang dibahas dalam berita ini.</p>',
        });

      // LANGKAH 2: Verifikasi bahwa sistem menolak request
      expect(res.statusCode).toBe(400); // 400 = Bad Request (data tidak valid)
    });

    /**
     * TEST: Validasi - authorId harus valid (ada di database)
     * 
     * SKENARIO:
     * - User mencoba membuat berita dengan authorId yang tidak ada (99999)
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 400
     * - Ini mencegah berita dibuat dengan penulis yang tidak ada
     */
    it('❌ Harus gagal jika authorId tidak valid', async () => {
      // LANGKAH 1: Ambil kategori yang valid (berita butuh kategori)
      const category = await Category.findOne();
      
      // LANGKAH 2: Kirim request dengan authorId yang TIDAK ADA (99999)
      const res = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          title: 'Berita Dengan Author Invalid',
          content: '<p>Ini adalah konten berita yang cukup panjang untuk memenuhi validasi minimal 100 karakter. Konten ini berisi informasi yang cukup lengkap dan detail tentang topik yang dibahas dalam berita ini.</p>',
          categoryId: category.categoryId, // Kategori valid
          authorId: 99999, // ❌ ID ini TIDAK ADA di database
          status: 'published',
          imageUrl: 'https://example.com/image.jpg'
        });

      // LANGKAH 3: Verifikasi bahwa sistem menolak
      expect(res.statusCode).toBe(400); // Harus gagal karena authorId tidak valid
    });
  });
});
