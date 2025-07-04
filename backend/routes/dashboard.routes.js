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

router.get('/', protect, (req, res) => {
  res.json({ message: `Halo admin dengan ID ${req.admin.adminId}, ini adalah halaman dashboard.` });
});

router.get('/stats', protect, getDashboardStats);
router.get('/articles', protect, getRecentArticles);
router.get('/comments', protect, getRecentComments);
router.get('/articles/all', protect, getAllArticlesPaginated);
router.get('/comments/all', protect, getAllCommentsPaginated);

export default router;
