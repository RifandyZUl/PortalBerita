import express from 'express';
import cors from 'cors';

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
// CORS Configuration - support both environment variable and default localhost
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (corsOrigins.includes(origin)) {
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

// Logger (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });
}

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
  res.status(404).json({ message: 'Route not found' });
});

// ===== Global Error Handler ===== //
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined,
  });
});

export default app;
