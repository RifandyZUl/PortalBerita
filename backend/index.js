// index.js
import dotenv from 'dotenv';
// Load dotenv HANYA di development/test (di production, Railway sudah set env vars)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import connectDB from './config/db.js';
import db from './models/index.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect using config/db.js (already handles authentication)
    await connectDB();
    
    // Verify models/index.js connection (should be same instance, but double-check)
    // Note: If using DATABASE_URL, both should use same connection
    console.log('✅ PostgreSQL connected');

    const shouldAlter = process.env.SEQUELIZE_ALTER === 'true';

    await Promise.all([
      db.Admin.sync({ alter: shouldAlter }),
      db.Author.sync({ alter: shouldAlter }),
      db.Category.sync({ alter: shouldAlter }),
      db.News.sync({ alter: shouldAlter }),
      db.Comment.sync({ alter: shouldAlter }),
    ]);

    console.log('✅ Semua tabel disinkronisasi dengan database');

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Handler error global
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

startServer();
