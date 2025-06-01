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
    logging: false,            // Jika true, akan menampilkan semua query SQL di console
  }
);

/**
 * Fungsi untuk menguji koneksi ke database PostgreSQL.
 * Digunakan saat server pertama kali dijalankan.
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Menguji koneksi dengan method authenticate
    console.log('PostgreSQL connected'); // Jika berhasil
  } catch (error) {
    // Menampilkan error jika koneksi gagal
    console.error('Unable to connect to PostgreSQL:', error);
  }
};

// Export instance sequelize untuk digunakan dalam definisi model
export { sequelize };

// Export fungsi koneksi sebagai default agar bisa dipanggil saat startup
export default connectDB;
