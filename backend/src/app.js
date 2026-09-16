/**
 * Express Application Setup
 * 
 * Main Express application configuration.
 * 
 * @module app
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { HTTP_STATUS } from './constants/httpStatus.js';
import { MESSAGES } from './constants/messages.js';
import { handleError } from './utils/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import logger, { logInfo } from './utils/logger.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin/admin.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import newsRoutes from './routes/news.routes.js';
import authorRoutes from './routes/author.routes.js';
import categoryRoutes from './routes/category.routes.js';
import commentRoutes from './routes/comments.routes.js';

const app = express();

// ===== MIDDLEWARE ===== //
// Security Headers dengan Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "https:", "data:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable untuk compatibility dengan Cloudinary
}));

// CORS Configuration - support both environment variable and default localhost
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (corsOrigins.includes('*') || corsOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware (Morgan + Winston)
app.use(requestLogger());

// Log application startup
logInfo('Application started', {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
});

// ===== HEALTH CHECK ===== //
app.get(['/health', '/api/health'], (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ===== DATABASE INITIALIZATION & SEEDING ROUTE ===== //
app.get('/api/init-database', async (req, res) => {
  try {
    const db = (await import('./infrastructure/database/models/index.js')).default;
    const bcrypt = (await import('bcryptjs')).default;

    // 1. Sync all tables
    await Promise.all([
      db.Admin.sync({ alter: true }),
      db.Author.sync({ alter: true }),
      db.Category.sync({ alter: true }),
      db.News.sync({ alter: true }),
      db.Comment.sync({ alter: true }),
    ]);

    // 2. Create default Admin
    const hashedPassword = await bcrypt.hash('admin12345', 10);
    const [admin, adminCreated] = await db.Admin.findOrCreate({
      where: { username: 'admin_super' },
      defaults: {
        username: 'admin_super',
        email: 'admin@portalberita.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        bio: 'Administrator Portal Berita'
      }
    });

    // 3. Seed default Categories if empty
    const categoryCount = await db.Category.count();
    let seededCategories = 0;
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: 'Teknologi', slug: 'teknologi' },
        { name: 'Politik', slug: 'politik' },
        { name: 'Ekonomi', slug: 'ekonomi' },
        { name: 'Olahraga', slug: 'olahraga' },
        { name: 'Hiburan', slug: 'hiburan' }
      ];
      await db.Category.bulkCreate(defaultCategories);
      seededCategories = defaultCategories.length;
    }

    res.json({
      success: true,
      message: 'Database berhasil disinkronisasi dan diinisialisasi!',
      data: {
        admin: {
          username: admin.username,
          email: admin.email,
          created: adminCreated
        },
        defaultCategoriesCount: seededCategories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal inisialisasi database: ' + error.message
    });
  }
});

// ===== ROUTES ===== //
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);

// ===== 404 Handler ===== //
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: MESSAGES.GENERAL.ROUTE_NOT_FOUND || 'Route not found'
  });
});

// ===== Global Error Handler ===== //
// Must be last middleware, with 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

export default app;

