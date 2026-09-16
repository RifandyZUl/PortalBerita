/**
 * Database Configuration
 * 
 * Sequelize database configuration and connection setup.
 * 
 * @module config/db
 */

import { Sequelize } from 'sequelize';
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
// SSL hanya diperlukan jika di-set eksplisit true atau jika production ke cloud database (bukan internal docker / localhost)
const isLocalDatabase = hasDatabaseUrl && (
  process.env.DATABASE_URL.includes('@postgres:') ||
  process.env.DATABASE_URL.includes('localhost') ||
  process.env.DATABASE_URL.includes('127.0.0.1')
);
const needsSSL = process.env.DB_SSL === 'true' || (isProduction && hasDatabaseUrl && process.env.DB_SSL !== 'false' && !isLocalDatabase);


// Strip channel_binding if present (Node.js pg does not support SASL channel binding)
let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.includes('channel_binding')) {
  dbUrl = dbUrl.replace(/([?&])channel_binding=[^&]*(&|$)/g, (match, prefix, suffix) => {
    return suffix === '&' ? prefix : '';
  }).replace(/[?&]$/, '');
}

const sequelize = hasDatabaseUrl
  ? new Sequelize(dbUrl, {
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
 * 
 * @returns {Promise<void>}
 */
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await sequelize.authenticate(); // Menguji koneksi
    isConnected = true;
    console.log('✅ PostgreSQL connected');
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    if (!process.env.VERCEL) {
      process.exit(1); // Keluar dari proses hanya jika bukan di serverless
    }
  }
};

// Export instance sequelize untuk digunakan dalam definisi model
export { sequelize };

// Export fungsi koneksi sebagai default agar bisa dipanggil di server.js / app.js
export default connectDB;

