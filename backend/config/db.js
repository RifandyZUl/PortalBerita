// Import Sequelize ORM
import { Sequelize } from 'sequelize';

// Import dotenv untuk membaca variabel lingkungan dari file .env
import dotenv from 'dotenv';

// Load environment variables dari file .env ke dalam process.env
dotenv.config();

// Membuat instance Sequelize dengan konfigurasi dari environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nama database
  process.env.DB_USER,     // Username database
  process.env.DB_PASS,     // Password database
  {
    host: process.env.DB_HOST, // Host database (misalnya: localhost)
    dialect: 'postgres',       // Dialek database yang digunakan
    logging: process.env.NODE_ENV !== 'production' // Tampilkan SQL query hanya di dev
  }
);

/**
 * Fungsi untuk menguji koneksi ke database PostgreSQL.
 * Digunakan saat server pertama kali dijalankan.
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Menguji koneksi
    console.log('✅ PostgreSQL connected');
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
};

// Export instance sequelize untuk digunakan dalam definisi model
export { sequelize };

// Export fungsi koneksi sebagai default agar bisa dipanggil di server.js / app.js
export default connectDB;
