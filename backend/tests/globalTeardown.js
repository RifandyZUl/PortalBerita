/**
 * GLOBAL TEARDOWN - Menutup semua koneksi setelah semua test selesai
 * 
 * File ini akan dipanggil oleh Jest setelah semua test suite selesai.
 * Tujuannya adalah memastikan semua koneksi database ditutup dengan benar
 * untuk menghindari pesan "Jest did not exit one second after the test run has completed"
 */

import db from '../src/infrastructure/database/models/index.js';
const { sequelize } = db;

export default async function globalTeardown() {
  try {
    console.log('🔄 Closing all database connections...');
    
    // Tutup koneksi Sequelize jika masih terbuka
    if (sequelize) {
      // Cek apakah koneksi masih terbuka
      const isConnected = sequelize.connectionManager && 
                         sequelize.connectionManager.pool && 
                         !sequelize.connectionManager.pool._closed;
      
      if (isConnected) {
        await sequelize.close();
        console.log('✅ Database connection closed');
      } else {
        console.log('ℹ️  Database connection already closed');
      }
    }
    
    // Beri waktu sedikit untuk memastikan semua operasi async selesai
    await new Promise(resolve => setTimeout(resolve, 200));
    
  } catch (error) {
    // Ignore error jika koneksi sudah ditutup
    if (error.message && error.message.includes('already closed')) {
      console.log('ℹ️  Database connection already closed');
    } else {
      console.error('❌ Error closing database connection:', error.message);
    }
    // Jangan throw error, biarkan Jest exit dengan normal
  }
}

