import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';

// import route lain jika ada



dotenv.config();

const app = express(); // ✅ Dideklarasikan lebih dulu

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
app.use('/api/admin', adminRoutes); // hasil akhir: /api/admin/dashboard


// Routes
app.use('/api/auth', authRoutes);
// tambahkan route lain jika ada

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
