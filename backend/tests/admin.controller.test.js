/**
 * ============================================
 * TEST FILE: admin.controller.test.js
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji endpoint untuk mengelola profile admin.
 * 
 * YANG DITEST:
 * 1. GET /api/admin/profile - Mengambil profile admin saat ini
 * 2. PUT /api/admin/profile - Mengupdate profile admin (firstName, lastName, bio, photo)
 * 
 * CARA KERJA:
 * - Setup: Buat admin dummy dengan data lengkap
 * - Test: Test mengambil dan mengupdate profile
 * - Cleanup: Tutup koneksi database
 */

import request from 'supertest';
import app from '../app.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { sequelize, Admin } = db;

let token;
let adminId;

describe('🧪 ADMIN CONTROLLER TEST', () => {
  /**
   * SETUP AWAL - Buat admin dummy dengan data lengkap
   */
  beforeAll(async () => {
    // Reset database untuk test ini - gunakan cleanup helper
    const { cleanupDatabase } = await import('./helpers/dbCleanup.js');
    await cleanupDatabase();
    
    // Buat admin dengan data lengkap (firstName, lastName, bio)
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await Admin.create({
      username: 'admintest',
      email: 'admintest@example.com',
      password: hashedPassword,
      firstName: 'John', // Data awal untuk testing
      lastName: 'Doe',
      bio: 'Test admin bio',
    });

    adminId = admin.adminId;
    
    // Generate token untuk authentication
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
   * TEST GROUP: GET /api/admin/profile
   * ============================================
   * Menguji endpoint untuk mengambil profile admin yang sedang login
   */
  describe('GET /api/admin/profile - Get Profile', () => {
    /**
     * TEST: Authentication - Harus login untuk melihat profile
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app).get('/api/admin/profile'); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401); // 401 = Unauthorized
    });

    /**
     * TEST: Authentication - Token harus valid
     * 
     * SKENARIO:
     * - User mengirim token yang tidak valid (bukan JWT yang benar)
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 403 (Forbidden)
     */
    it('❌ Harus gagal jika token tidak valid', async () => {
      const res = await request(app)
        .get('/api/admin/profile')
        .set('Authorization', 'Bearer invalid_token'); // ❌ Token tidak valid

      expect(res.statusCode).toBe(403); // 403 = Forbidden (token tidak valid)
    });

    /**
     * TEST: Mengambil profile sukses (Happy Path)
     * 
     * SKENARIO:
     * - Admin yang sudah login mengakses profile sendiri
     * 
     * YANG DICEK:
     * - Status harus 200
     * - Response harus berisi data admin
     * - Data harus sesuai dengan admin yang login
     */
    it('✅ Berhasil mengambil profile admin', async () => {
      // LANGKAH 1: Kirim request dengan token valid
      const res = await request(app)
        .get('/api/admin/profile')
        .set('Authorization', `Bearer ${token}`); // ✅ Token valid

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('admin'); // Harus ada data admin
      
      // LANGKAH 3: Verifikasi data admin sesuai
      expect(res.body.admin.adminId).toBe(adminId); // ID harus sesuai
      expect(res.body.admin.email).toBe('admintest@example.com'); // Email harus sesuai
      expect(res.body.admin.username).toBe('admintest'); // Username harus sesuai
    });
  });

  /**
   * ============================================
   * TEST GROUP: PUT /api/admin/profile (UPDATE)
   * ============================================
   * Menguji endpoint untuk mengupdate profile admin
   * 
   * PENTING:
   * - Admin hanya bisa update profile sendiri
   * - Update bersifat partial (bisa update beberapa field saja)
   * - Field yang tidak dikirim tetap mempertahankan nilai lama
   */
  describe('PUT /api/admin/profile - Update Profile', () => {
    /**
     * TEST: Authentication - Harus login untuk update
     */
    it('❌ Harus gagal jika tidak ada token', async () => {
      const res = await request(app)
        .put('/api/admin/profile')
        .send({ firstName: 'Jane' }); // ❌ Tidak ada token

      expect(res.statusCode).toBe(401);
    });

    /**
     * TEST: Update firstName dan lastName
     * 
     * SKENARIO:
     * - Admin mengupdate firstName dan lastName sekaligus
     * 
     * YANG DICEK:
     * - Status harus 200
     * - firstName dan lastName harus berubah
     */
    it('✅ Berhasil mengupdate firstName dan lastName', async () => {
      // LANGKAH 1: Update firstName dan lastName
      const res = await request(app)
        .put('/api/admin/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Jane', // Update firstName
          lastName: 'Smith', // Update lastName
        });

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Profil berhasil diperbarui');
      
      // LANGKAH 3: Verifikasi data sudah terupdate
      expect(res.body.admin.firstName).toBe('Jane'); // firstName sudah berubah
      expect(res.body.admin.lastName).toBe('Smith'); // lastName sudah berubah
    });

    /**
     * TEST: Update bio saja
     * 
     * SKENARIO:
     * - Admin hanya mengupdate bio, tidak mengubah field lain
     * 
     * YANG DICEK:
     * - Bio harus berubah
     * - Field lain tetap sama (partial update)
     */
    it('✅ Berhasil mengupdate bio', async () => {
      const res = await request(app)
        .put('/api/admin/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bio: 'Updated bio for testing', // Hanya update bio
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.admin.bio).toBe('Updated bio for testing'); // Bio sudah berubah
    });

    /**
     * TEST: Update semua field sekaligus
     * 
     * SKENARIO:
     * - Admin mengupdate firstName, lastName, dan bio sekaligus
     */
    it('✅ Berhasil mengupdate semua field sekaligus', async () => {
      const res = await request(app)
        .put('/api/admin/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Updated',
          lastName: 'Name',
          bio: 'Final bio update',
        });

      expect(res.statusCode).toBe(200);
      // Verifikasi semua field sudah terupdate
      expect(res.body.admin.firstName).toBe('Updated');
      expect(res.body.admin.lastName).toBe('Name');
      expect(res.body.admin.bio).toBe('Final bio update');
    });

    /**
     * TEST: Partial update - Field yang tidak dikirim tetap sama
     * 
     * SKENARIO:
     * - Admin hanya mengupdate firstName
     * - lastName dan bio TIDAK dikirim
     * 
     * YANG DICEK:
     * - firstName harus berubah
     * - lastName dan bio harus tetap dari update sebelumnya (tidak berubah)
     * 
     * PENTING:
     * - Ini test untuk memastikan update bersifat partial (tidak overwrite semua)
     */
    it('✅ Harus mempertahankan nilai lama jika field tidak dikirim', async () => {
      // LANGKAH 1: Update hanya firstName (tidak kirim lastName dan bio)
      const res = await request(app)
        .put('/api/admin/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'OnlyFirstName', // Hanya update ini
          // lastName dan bio TIDAK dikirim
        });

      // LANGKAH 2: Verifikasi response
      expect(res.statusCode).toBe(200);
      expect(res.body.admin.firstName).toBe('OnlyFirstName'); // firstName berubah
      
      // LANGKAH 3: Verifikasi field lain tetap sama (tidak berubah)
      // lastName dan bio harus tetap dari update sebelumnya
      expect(res.body.admin.lastName).toBe('Name'); // Tetap dari update sebelumnya
      expect(res.body.admin.bio).toBe('Final bio update'); // Tetap dari update sebelumnya
    });
  });
});

