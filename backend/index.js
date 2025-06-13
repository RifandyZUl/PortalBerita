import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import db from './models/index.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin/admin.routes.js';
import dashboardRoutes from './routes/admin/dashboard.routes.js';
import newsRoutes from './routes/news.routes.js';
import authorRoutes from './routes/author.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE ===== //
app.use(cors({
  origin: ['http://localhost:5173'], // Ganti dengan domain frontend di production
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger untuk development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });
}

// ===== ROUTES ===== //
app.use('/api/auth', authRoutes);          // Login, logout, register (kalau ada)
app.use('/api/admin', adminRoutes);        // Admin profile & update
app.use('/api/admin', dashboardRoutes);    // Dashboard (GET /dashboard)
app.use('/api/news', newsRoutes);          // CRUD berita
app.use('/api/authors', authorRoutes);     // Dropdown author

// ===== 404 Handler ===== //
app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' });
});

// ===== Global Error Handler ===== //
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  return res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined,
  });
});

// ===== Start Server ===== //
async function startServer() {
  try {
    await connectDB(); // custom config koneksi db
    await db.sequelize.authenticate();
    console.log('✅ PostgreSQL connected');

    // Sync semua model (jika belum migrasi manual)
    await Promise.all([
      db.Admin.sync({ alter: true }),
      db.Author.sync({ alter: true }),
      db.Category.sync({ alter: true }),
      db.News.sync({ alter: true }),
      db.Comment.sync({ alter: true }),
    ]);

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
