// Import Sequelize ORM
import { Sequelize } from 'sequelize';

// Import dotenv untuk membaca variabel lingkungan dari file .env
import dotenv from 'dotenv';

// Load environment variables HANYA di development/test (di production, Railway sudah set env vars)
if (process.env.NODE_ENV !== 'production') {
  const envFilePath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
  dotenv.config({ path: envFilePath });
}

// Membuat instance Sequelize dengan konfigurasi dari environment variables
// Support DATABASE_URL for platforms like Railway, Render, Heroku
const isProduction = process.env.NODE_ENV === 'production';
const hasDatabaseUrl = !!process.env.DATABASE_URL;
// SSL hanya diperlukan jika production DAN menggunakan DATABASE_URL (cloud database)
const needsSSL = isProduction && hasDatabaseUrl;

const sequelize = hasDatabaseUrl
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: needsSSL ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      logging: process.env.NODE_ENV === 'development'
    })
  : new Sequelize(
      process.env.DB_NAME,     // Nama database
      process.env.DB_USER,     // Username database
      process.env.DB_PASS,     // Password database
      {
        host: process.env.DB_HOST, // Host database (misalnya: localhost)
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',       // Dialek database yang digunakan
        logging: process.env.NODE_ENV === 'development',
        dialectOptions: {
          ssl: false // Local database tidak perlu SSL
        }
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
