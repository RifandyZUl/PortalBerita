import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Halo admin dengan ID ${req.user.id}, ini adalah halaman dashboard.` });
});

export default router;
