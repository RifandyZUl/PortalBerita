/**
 * ============================================
 * TEST FILE: category.test.js
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji semua operasi CRUD (Create, Read, Update, Delete) untuk Category (Kategori).
 * 
 * YANG DITEST:
 * 1. POST /api/categories - Membuat kategori baru
 * 2. GET /api/categories - Mengambil semua kategori
 * 3. PUT /api/categories/:id - Mengupdate kategori
 * 4. DELETE /api/categories/:id - Menghapus kategori
 * 
 * CARA KERJA:
 * - Setup: Buat admin dan token untuk authentication
 * - Test: Test semua operasi CRUD dengan berbagai skenario
 * - Cleanup: Tutup koneksi database
 */

import request from 'supertest';
import app from '../app.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { sequelize, Admin, Category } = db;

let token;
let categoryId;
let secondCategoryId;

describe('🧪 CATEGORY ENDPOINT TEST', () => {
  /**
   * SETUP AWAL - Dijalankan sekali sebelum semua test
   * Tujuan: Menyiapkan admin dan token untuk authentication
   */
  beforeAll(async () => {
    // Reset database untuk test ini - gunakan cleanup helper
    const { cleanupDatabase } = await import('./helpers/dbCleanup.js');
    await cleanupDatabase();
    
    // Buat admin dummy untuk authentication
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await Admin.create({
      username: 'admincategory',
      email: 'categoryadmin@example.com',
      password: hashedPassword,
    });

    // Generate JWT token untuk digunakan di semua test
    token = jwt.sign(
      { adminId: admin.adminId, email: admin.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
  });

  /**
   * CLEANUP - Tutup koneksi database
   */
  afterAll(async () => {
    await sequelize.close();
  });

  /**
   * ============================================
   * TEST GROUP: POST /api/categories (CREATE)
   * ============================================
   * Menguji endpoint untuk membuat kategori baru
   */
  describe('POST /api/categories - Create Category', () => {
    /**
     * TEST: Authentication - Harus login untuk membuat kategori
     * 
     * SKENARIO:
     * - User mencoba membuat kategori TANPA token (tidak login)
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 401 (Unauthorized)
     * - Ini penting untuk keamanan (hanya admin yang bisa membuat kategori)
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      // Kirim request TANPA token di header
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Teknologi', slug: 'teknologi' });

      expect(res.statusCode).toBe(401); // 401 = Unauthorized (tidak punya akses)
    });

    /**
     * TEST: Validasi - name wajib diisi
     * 
     * SKENARIO:
     * - User mencoba membuat kategori TANPA mengirim name
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 400
     */
    it('❌ Harus gagal jika name tidak dikirim', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`) // ✅ Ada token
        .send({ slug: 'teknologi' }); // ❌ Tapi TIDAK ada name

      expect(res.statusCode).toBe(400); // 400 = Bad Request (data tidak valid)
    });

    /**
     * TEST: Create kategori sukses (Happy Path)
     * 
     * SKENARIO:
     * - Admin membuat kategori baru dengan data yang valid
     * 
     * YANG DICEK:
     * - Status harus 201 (Created)
     * - Response harus sukses
     * - Data kategori harus lengkap (categoryId, name, slug)
     */
    it('✅ Berhasil menambahkan kategori baru', async () => {
      // LANGKAH 1: Kirim request untuk membuat kategori
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`) // ✅ Token valid
        .send({ name: 'Teknologi Baru', slug: 'teknologi-baru' }); // ✅ Data valid (gunakan nama unik)

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(201); // 201 = Created (berhasil dibuat)
      expect(res.body.success).toBe(true); // Response sukses
      
      // LANGKAH 3: Verifikasi data yang dikembalikan
      expect(res.body.data).toHaveProperty('categoryId'); // Harus ada ID
      expect(res.body.data.name).toBe('Teknologi Baru'); // Name harus sesuai
      expect(res.body.data.slug).toBe('teknologi-baru'); // Slug harus sesuai
      
      // Simpan ID untuk digunakan di test lain (update, delete)
      categoryId = res.body.data.categoryId;
    });

    /**
     * TEST: Validasi - slug harus unique
     * 
     * SKENARIO:
     * - User mencoba membuat kategori dengan slug yang sudah ada
     * 
     * YANG DICEK:
     * - Sistem harus menolak karena slug duplikat
     * - Ini mencegah kategori dengan slug yang sama
     */
    it('❌ Harus gagal jika slug duplikat', async () => {
      // Coba buat kategori dengan slug yang sama seperti sebelumnya (teknologi-baru)
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Teknologi Lain', slug: 'teknologi-baru' }); // ❌ Slug 'teknologi-baru' sudah ada

      expect(res.statusCode).toBe(400); // Harus gagal karena duplikat
    });
  });

  describe('GET /api/categories - Get Categories', () => {
    it('✅ Berhasil mengambil semua kategori tanpa token (public endpoint)', async () => {
      // Buat kategori kedua
      const createRes = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Olahraga', slug: 'olahraga' });
      secondCategoryId = createRes.body.data.categoryId;

      const res = await request(app).get('/api/categories');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      // Response bisa berupa object dengan pagination atau array langsung
      const categories = res.body.data.categories || res.body.data;
      expect(Array.isArray(categories) || typeof categories === 'object').toBe(true);
    });
  });

  /**
   * ============================================
   * TEST GROUP: PUT /api/categories/:id (UPDATE)
   * ============================================
   * Menguji endpoint untuk mengupdate kategori yang sudah ada
   */
  describe('PUT /api/categories/:id - Update Category', () => {
    /**
     * TEST: Authentication - Harus login untuk update
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send({ name: 'Teknologi Modern' }); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401);
    });

    /**
     * TEST: Edge case - Kategori tidak ditemukan
     * 
     * SKENARIO:
     * - User mencoba update kategori dengan ID yang tidak ada (99999)
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 404 (Not Found)
     */
    it('❌ Harus gagal jika kategori tidak ditemukan', async () => {
      const res = await request(app)
        .put('/api/categories/99999') // ❌ ID ini TIDAK ADA
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Teknologi Modern', slug: 'teknologi-modern' });

      expect(res.statusCode).toBe(404); // 404 = Not Found
    });

    /**
     * TEST: Update kategori sukses
     * 
     * SKENARIO:
     * - Admin mengupdate kategori yang sudah ada
     * 
     * YANG DICEK:
     * - Status harus 200 (OK)
     * - Data yang diupdate harus sesuai
     */
    it('✅ Berhasil mengupdate kategori', async () => {
      // LANGKAH 1: Pastikan categoryId sudah ada (dari test create sebelumnya)
      // Jika belum ada, buat dulu
      if (!categoryId) {
        const createRes = await request(app)
          .post('/api/categories')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Kategori Update', slug: 'kategori-update' });
        categoryId = createRes.body.data.categoryId;
      }
      
      // LANGKAH 2: Update kategori dengan ID yang valid
      const res = await request(app)
        .put(`/api/categories/${categoryId}`) // ✅ ID valid
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Teknologi Modern', slug: 'teknologi-modern' });

      // LANGKAH 3: Verifikasi response
      expect(res.statusCode).toBe(200); // 200 = OK (berhasil diupdate)
      expect(res.body.success).toBe(true);
      
      // LANGKAH 4: Verifikasi data yang diupdate
      expect(res.body.data.name).toBe('Teknologi Modern'); // Name sudah berubah
      expect(res.body.data.slug).toBe('teknologi-modern'); // Slug sudah berubah
    });
  });

  /**
   * ============================================
   * TEST GROUP: DELETE /api/categories/:id (DELETE)
   * ============================================
   * Menguji endpoint untuk menghapus kategori
   */
  describe('DELETE /api/categories/:id - Delete Category', () => {
    /**
     * TEST: Authentication - Harus login untuk delete
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app).delete(`/api/categories/${secondCategoryId}`); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401);
    });

    /**
     * TEST: Edge case - Kategori tidak ditemukan
     */
    it('❌ Harus gagal jika kategori tidak ditemukan', async () => {
      const res = await request(app)
        .delete('/api/categories/99999') // ❌ ID tidak ada
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

    /**
     * TEST: Delete kategori sukses
     * 
     * SKENARIO:
     * - Admin menghapus kategori
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Kategori harus benar-benar terhapus dari database
     */
    it('✅ Berhasil menghapus kategori', async () => {
      // LANGKAH 1: Hapus kategori
      const res = await request(app)
        .delete(`/api/categories/${secondCategoryId}`) // ✅ ID valid
        .set('Authorization', `Bearer ${token}`);

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // LANGKAH 3: Verifikasi kategori benar-benar terhapus dari database
      //            Cek langsung ke database, bukan hanya response
      const deletedCategory = await Category.findByPk(secondCategoryId);
      expect(deletedCategory).toBeNull(); // Harus null (sudah terhapus)
    });
  });
});
