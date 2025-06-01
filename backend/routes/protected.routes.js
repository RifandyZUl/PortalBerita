import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/admin/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Selamat datang di dashboard', user: req.user });
});

export default router;
