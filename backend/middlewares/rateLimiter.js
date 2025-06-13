import rateLimit from 'express-rate-limit';

// Rate limiter untuk endpoint login
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 5, // maksimal 5 percobaan per IP
  message: {
    message: 'Terlalu banyak percobaan login. Coba lagi dalam 5 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
