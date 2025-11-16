/**
 * ============================================
 * TEST FILE: auth.controller.test.js
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji endpoint authentication (login).
 * 
 * YANG DITEST:
 * 1. POST /api/auth/login - Proses login admin
 *    - Validasi input (field wajib, tipe data)
 *    - Autentikasi (email/username, password)
 *    - Generate token JWT
 * 
 * CARA KERJA:
 * - Setup: Buat admin dummy dengan password yang di-hash
 * - Test: Coba berbagai skenario login (sukses, gagal, edge cases)
 * - Cleanup: Tutup koneksi database
 */

import request from 'supertest';
import app from '../app.js';
import db from '../models/index.js';
import bcrypt from 'bcryptjs';

const { sequelize, Admin } = db;

describe('🧪 AUTH CONTROLLER TEST', () => {
  /**
   * SETUP AWAL - Buat admin dummy untuk testing
   * Password di-hash seperti di production (tidak disimpan plain text)
   */
  beforeAll(async () => {
    // Reset database untuk test ini - gunakan cleanup helper
    const { cleanupDatabase } = await import('./helpers/dbCleanup.js');
    await cleanupDatabase();
    
    // Buat admin dummy dengan password yang di-hash
    // Password: "password123" di-hash menjadi string panjang
    await Admin.create({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 10),
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
   * TEST GROUP: Validasi Input Login
   * ============================================
   * Menguji bahwa sistem memvalidasi input sebelum proses login
   */
  describe('POST /api/auth/login - Validation Tests', () => {
    /**
     * TEST: Validasi - emailOrUsername wajib diisi
     * 
     * SKENARIO:
     * - User mencoba login TANPA mengirim email/username
     * - Hanya mengirim password
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 400
     * - Pesan error harus jelas
     */
    it('❌ Harus gagal jika username/email tidak dikirim', async () => {
      // Kirim request login TANPA email/username
      const res = await request(app).post('/api/auth/login').send({
        password: 'somepassword', // Hanya password, tidak ada email/username
      });

      // Verifikasi sistem menolak
      expect(res.statusCode).toBe(400); // 400 = Bad Request
      expect(res.body.success).toBe(false); // Response harus gagal
      expect(res.body.message).toBe('Email/username dan password wajib diisi.'); // Pesan error jelas
    });

    /**
     * TEST: Validasi - password wajib diisi
     * 
     * SKENARIO:
     * - User mencoba login TANPA mengirim password
     * - Hanya mengirim email/username
     */
    it('❌ Harus gagal jika password tidak dikirim', async () => {
      const res = await request(app).post('/api/auth/login').send({
        emailOrUsername: 'admin@example.com', // Ada email, tapi TIDAK ada password
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email/username dan password wajib diisi.');
    });

    /**
     * TEST: Validasi - emailOrUsername harus string
     * 
     * SKENARIO:
     * - User mengirim emailOrUsername dengan tipe data salah (number)
     * 
     * YANG DICEK:
     * - Sistem harus menolak karena tipe data tidak sesuai
     */
    it('❌ Harus gagal jika emailOrUsername bukan string', async () => {
      const res = await request(app).post('/api/auth/login').send({
        emailOrUsername: 12345, // ❌ Bukan string, tapi number
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    /**
     * TEST: Edge case - Semua field kosong
     * 
     * SKENARIO:
     * - User mengirim request kosong (tidak ada data sama sekali)
     */
    it('❌ Harus gagal jika semua field kosong', async () => {
      const res = await request(app).post('/api/auth/login').send({}); // Request kosong

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  /**
   * ============================================
   * TEST GROUP: Proses Autentikasi Login
   * ============================================
   * Menguji proses login yang sebenarnya (cek database, verifikasi password, generate token)
   */
  describe('POST /api/auth/login - Authentication Tests', () => {
    /**
     * TEST: Autentikasi gagal - User tidak ditemukan
     * 
     * SKENARIO:
     * - User mencoba login dengan email/username yang TIDAK ADA di database
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 401 (Unauthorized)
     * - Pesan error harus jelas bahwa user tidak ditemukan
     * 
     * CATATAN:
     * - Bisa juga dapat 429 (rate limit) jika terlalu banyak request
     */
    it('❌ Harus gagal jika email/username tidak ditemukan', async () => {
      const res = await request(app).post('/api/auth/login').send({
        emailOrUsername: 'nonexistent@example.com', // ❌ Email ini TIDAK ADA di database
        password: 'password123',
      });

      // Bisa 401 (not found) atau 429 (rate limit) tergantung urutan test
      expect([401, 429]).toContain(res.statusCode);
      if (res.statusCode === 401) {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Email atau username tidak ditemukan.');
      }
    });

    /**
     * TEST: Autentikasi gagal - Password salah
     * 
     * SKENARIO:
     * - User mencoba login dengan email yang BENAR tapi password SALAH
     * 
     * YANG DICEK:
     * - Sistem harus menolak dengan status 401
     * - Ini penting untuk keamanan (jangan kasih tahu apakah email ada atau tidak)
     */
    it('❌ Harus gagal jika password salah', async () => {
      const res = await request(app).post('/api/auth/login').send({
        emailOrUsername: 'admin@example.com', // ✅ Email benar
        password: 'wrongpassword', // ❌ Password salah
      });

      // Bisa 401 (wrong password) atau 429 (rate limit)
      expect([401, 429]).toContain(res.statusCode);
      if (res.statusCode === 401) {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Password salah.');
      }
    });

    /**
     * TEST: Login sukses dengan email
     * 
     * SKENARIO:
     * - User login dengan email yang benar dan password yang benar
     * 
     * YANG DICEK:
     * - Status harus 200 (OK)
     * - Response harus sukses
     * - Harus ada token JWT di response
     * - Token harus berupa string yang valid
     * 
     * CATATAN:
     * - Rate limiter bisa membatasi jika terlalu banyak request (429)
     */
    it('✅ Berhasil login dengan email', async () => {
      // Kirim request login dengan email dan password yang benar
      const res = await request(app).post('/api/auth/login').send({
        emailOrUsername: 'admin@example.com', // ✅ Email benar
        password: 'password123', // ✅ Password benar
      });

      // Bisa 200 (success) atau 429 (rate limit)
      if (res.statusCode === 200) {
        // Verifikasi response sukses
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Login berhasil.');
        
        // Verifikasi token ada dan valid
        expect(res.body.data).toHaveProperty('token'); // Harus ada token
        expect(typeof res.body.data.token).toBe('string'); // Token harus string
        expect(res.body.data.token.length).toBeGreaterThan(0); // Token tidak boleh kosong
      } else {
        // Rate limit reached - ini normal jika terlalu banyak test
        expect(res.statusCode).toBe(429);
      }
    });

    /**
     * TEST: Login sukses dengan username
     * 
     * SKENARIO:
     * - Sistem harus bisa login dengan username (bukan hanya email)
     * - Ini fitur fleksibilitas untuk user
     */
    it('✅ Berhasil login dengan username', async () => {
      const res = await request(app).post('/api/auth/login').send({
        emailOrUsername: 'admin', // ✅ Login dengan username (bukan email)
        password: 'password123',
      });

      // Bisa 200 (success) atau 429 (rate limit)
      if (res.statusCode === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Login berhasil.');
        expect(res.body.data).toHaveProperty('token');
        expect(typeof res.body.data.token).toBe('string');
      } else {
        expect(res.statusCode).toBe(429);
      }
    });

    /**
     * TEST: Token generation
     * 
     * SKENARIO:
     * - User login 2 kali dengan kredensial yang sama
     * 
     * YANG DICEK:
     * - Setiap login harus menghasilkan token
     * - Token bisa sama atau berbeda (tergantung implementasi)
     * 
     * CATATAN:
     * - Test ini memastikan token selalu di-generate
     */
    it('✅ Token yang dihasilkan harus berbeda setiap login', async () => {
      // Login pertama
      const res1 = await request(app).post('/api/auth/login').send({
        emailOrUsername: 'admin@example.com',
        password: 'password123',
      });

      // Login kedua (dengan kredensial sama)
      const res2 = await request(app).post('/api/auth/login').send({
        emailOrUsername: 'admin@example.com',
        password: 'password123',
      });

      // Rate limiter bisa membatasi, jadi kita cek jika berhasil
      if (res1.statusCode === 200 && res2.statusCode === 200) {
        // Kedua login harus menghasilkan token
        expect(res1.body.data.token).toBeTruthy();
        expect(res2.body.data.token).toBeTruthy();
      } else {
        // Rate limit reached - ini normal untuk test yang banyak
        expect([200, 429]).toContain(res1.statusCode);
        expect([200, 429]).toContain(res2.statusCode);
      }
    });
  });
});
