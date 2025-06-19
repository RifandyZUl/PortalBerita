// app.js
import express from 'express';
import cors from 'cors';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin/admin.routes.js';
import dashboardRoutes from './routes/admin/dashboard.routes.js';
import newsRoutes from './routes/news.routes.js';
import authorRoutes from './routes/author.routes.js';
import categoryRoutes from './routes/category.routes.js';
import commentRoutes from './routes/comments.routes.js';

const app = express();

// ===== MIDDLEWARE ===== //
app.use(cors({
  origin: ['http://localhost:5173'],
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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);

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

export default app;
