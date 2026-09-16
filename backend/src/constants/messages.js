/**
 * Application Messages Constants
 * 
 * Centralized messages untuk konsistensi di seluruh aplikasi.
 * Semua pesan sukses dan error disimpan di sini.
 * 
 * @module constants/messages
 */

export const MESSAGES = {
  // News messages
  NEWS: {
    CREATED: 'Berita berhasil dibuat.',
    UPDATED: 'Berita berhasil diperbarui.',
    DELETED: 'Berita berhasil dihapus.',
    RETRIEVED: 'Berhasil mengambil data berita.',
    NOT_FOUND: 'Berita tidak ditemukan.',
    ALREADY_EXISTS: 'Slug sudah digunakan, ubah judul.',
    VIEWS_INCREMENTED: 'Jumlah views berhasil ditambahkan.',
    SEARCH_SUCCESS: 'Hasil pencarian ditemukan.',
    POPULAR_RETRIEVED: 'Berhasil mengambil berita populer.',
    PUBLISHED_RETRIEVED: 'Berhasil mengambil berita untuk user.'
  },

  // Category messages
  CATEGORY: {
    CREATED: 'Kategori berhasil dibuat.',
    UPDATED: 'Kategori berhasil diperbarui.',
    DELETED: 'Kategori berhasil dihapus.',
    RETRIEVED: 'Berhasil mengambil semua kategori.',
    NOT_FOUND: 'Kategori tidak ditemukan.',
    SLUG_EXISTS: 'Slug kategori sudah digunakan.',
    HAS_NEWS: 'Kategori tidak dapat dihapus karena masih memiliki berita.'
  },

  // Auth messages
  AUTH: {
    LOGIN_SUCCESS: 'Login berhasil.',
    LOGIN_FAILED: 'Email atau username tidak ditemukan.',
    PASSWORD_WRONG: 'Password salah.',
    UNAUTHORIZED: 'Unauthorized access.',
    TOKEN_INVALID: 'Invalid or expired token.',
    CREDENTIALS_REQUIRED: 'Email/username dan password wajib diisi.'
  },

  // Author messages
  AUTHOR: {
    CREATED: 'Author berhasil dibuat.',
    UPDATED: 'Author berhasil diperbarui.',
    DELETED: 'Author berhasil dihapus.',
    RETRIEVED: 'Berhasil mengambil data author.',
    NOT_FOUND: 'Author tidak ditemukan.'
  },

  // Comment messages
  COMMENT: {
    CREATED: 'Komentar berhasil dibuat.',
    UPDATED: 'Komentar berhasil diperbarui.',
    DELETED: 'Komentar berhasil dihapus.',
    RETRIEVED: 'Berhasil mengambil komentar.',
    NOT_FOUND: 'Komentar tidak ditemukan.'
  },

  // Dashboard messages
  DASHBOARD: {
    STATS_RETRIEVED: 'Berhasil mengambil statistik dashboard.'
  },

  // Validation messages
  VALIDATION: {
    FAILED: 'Validasi gagal.',
    REQUIRED: 'Field wajib diisi.',
    INVALID: 'Nilai tidak valid.',
    MIN_LENGTH: 'Panjang minimum tidak terpenuhi.',
    MAX_LENGTH: 'Panjang maksimum terlampaui.',
    IMAGE_REQUIRED: 'Gambar tidak boleh kosong.',
    KEYWORD_MIN_LENGTH: 'Masukkan kata kunci minimal 2 huruf.'
  },

  // General messages
  GENERAL: {
    SERVER_ERROR: 'Terjadi kesalahan pada server.',
    ROUTE_NOT_FOUND: 'Route not found.',
    SUCCESS: 'Operasi berhasil.',
    FAILED: 'Operasi gagal.'
  }
};

