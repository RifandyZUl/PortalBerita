// index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import db from './models/index.js'; // Sequelize instance
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import dashboardRoutes from './routes/admin/dashboardRoutes.js';
import newsRoutes from './routes/newsRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (optional, bisa hapus jika tidak perlu)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);            // → /api/auth/login, register, etc
app.use('/api/admin', adminRoutes);          // → /api/admin/*
app.use('/admin', dashboardRoutes);          // → /admin/dashboard
app.use('/api/news', newsRoutes);            // → /api/news GET, POST, PUT, DELETE

// Server + Database Init
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  try {
    await db.sequelize.sync({ alter: true }); // Use alter: true for development
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Database synced successfully`);
    });
  } catch (error) {
    console.error('❌ Failed to sync database:', error);
  }
});
