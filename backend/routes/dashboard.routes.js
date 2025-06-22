import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getDashboardStats,
  getRecentArticles,
  getRecentComments,
  getAllArticlesPaginated,
  getAllCommentsPaginated
} from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Halo admin dengan ID ${req.admin.adminId}, ini adalah halaman dashboard.` });
});

router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/dashboard/articles', protect, getRecentArticles); // for dashboard (limit 5)
router.get('/dashboard/comments', protect, getRecentComments); // for dashboard (limit 5)

router.get('/dashboard/articles/all', protect, getAllArticlesPaginated); // for View All with pagination
router.get('/dashboard/comments/all', protect, getAllCommentsPaginated); // for View All with pagination

export default router;
