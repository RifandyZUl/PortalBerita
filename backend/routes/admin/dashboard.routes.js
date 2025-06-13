import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { getDashboardStats } from '../../controllers/dashboardController.js';

const router = express.Router();

router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Halo admin dengan ID ${req.admin.adminId}, ini adalah halaman dashboard.` });
});

router.get('/dashboard/stats', protect, getDashboardStats);

export default router;
