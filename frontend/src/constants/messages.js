/**
 * Application Messages Constants
 * 
 * Centralized messages untuk konsistensi di seluruh aplikasi.
 * 
 * @module constants/messages
 */

export const MESSAGES = {
  SUCCESS: {
    NEWS_CREATED: 'Artikel berhasil dibuat',
    NEWS_UPDATED: 'Artikel berhasil diperbarui',
    NEWS_DELETED: 'Artikel berhasil dihapus',
    CATEGORY_CREATED: 'Kategori berhasil dibuat',
    CATEGORY_UPDATED: 'Kategori berhasil diperbarui',
    CATEGORY_DELETED: 'Kategori berhasil dihapus',
    COMMENT_UPDATED: 'Status komentar berhasil diperbarui',
    COMMENT_DELETED: 'Komentar berhasil dihapus',
    LOGIN_SUCCESS: 'Login berhasil',
    LOGOUT_SUCCESS: 'Logout berhasil'
  },
  ERROR: {
    NEWS_FETCH_FAILED: 'Gagal memuat artikel',
    NEWS_CREATE_FAILED: 'Gagal membuat artikel',
    NEWS_UPDATE_FAILED: 'Gagal memperbarui artikel',
    NEWS_DELETE_FAILED: 'Gagal menghapus artikel',
    CATEGORY_FETCH_FAILED: 'Gagal memuat kategori',
    CATEGORY_CREATE_FAILED: 'Gagal membuat kategori',
    CATEGORY_UPDATE_FAILED: 'Gagal memperbarui kategori',
    CATEGORY_DELETE_FAILED: 'Gagal menghapus kategori',
    COMMENT_FETCH_FAILED: 'Gagal memuat komentar',
    COMMENT_UPDATE_FAILED: 'Gagal memperbarui status komentar',
    COMMENT_DELETE_FAILED: 'Gagal menghapus komentar',
    LOGIN_FAILED: 'Login gagal',
    SERVER_ERROR: 'Terjadi kesalahan pada server'
  }
};

