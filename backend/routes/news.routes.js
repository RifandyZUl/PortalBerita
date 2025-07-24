import express from 'express';
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  getPublishedNews,
  getPublicNewsBySlug,
  searchNewsByKeyword,
  incrementViews,
  getPopularNews
} from '../controllers/news.controller.js';

import { protect } from '../middlewares/authMiddleware.js';
import { validateNews } from '../validators/newsValidator.js';
import { handleValidationErrors } from '../utils/handleValidation.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// ======= PUBLIC ROUTES ======= //
router.get('/public/list', getPublishedNews);         // Homepage user
router.get('/public/detail/:slug', getPublicNewsBySlug); // Detail berita
router.get('/search', searchNewsByKeyword);           // Fitur pencarian
router.get('/popular', getPopularNews);       // Berita populer 
router.patch('/:id/views', incrementViews);     // Tambah views otomatis 

// ======= ADMIN ROUTES ======= //
router.get('/', protect, getAllNews);
router.post(
  '/',
  protect,
  upload.single('image'),
  validateNews,
  handleValidationErrors,
  createNews
);
router.put(
  '/:id',
  protect,
  upload.single('image'),
  validateNews,
  handleValidationErrors,
  updateNews
);
router.delete('/:id', protect, deleteNews);
router.get('/:id', protect, getNewsById); // ← sebaiknya dilindungi juga

export default router;
