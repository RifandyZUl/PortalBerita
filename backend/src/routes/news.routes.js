/**
 * News Routes
 * 
 * Routes untuk News endpoints.
 * 
 * @module routes/news.routes
 */

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
} from '../controllers/NewsController.js';

import { protect } from '../middlewares/authMiddleware.js';
import { validateNews, validateUpdateNews } from '../validators/newsValidator.js';
import { handleValidationErrors } from '../utils/handleValidation.js';
import upload, { handleUploadError, optionalUpload } from '../middlewares/uploadMiddleware.js';
import { cacheResponse, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

// ======= PUBLIC ROUTES (CACHED) ======= //
router.get('/public/list', cacheResponse(300), getPublishedNews);         // Homepage user (5m cache)
router.get('/public/detail/:slug', cacheResponse(600), getPublicNewsBySlug); // Detail berita (10m cache)
router.get('/search', cacheResponse(180), searchNewsByKeyword);           // Fitur pencarian (3m cache)
router.get('/popular', cacheResponse(300), getPopularNews);               // Berita populer (5m cache)
router.patch('/:id/views', incrementViews);                               // Tambah views otomatis 

// ======= ADMIN ROUTES (WITH AUTO CACHE INVALIDATION) ======= //
router.get('/', protect, getAllNews);
router.post(
  '/',
  protect,
  optionalUpload,
  handleUploadError,
  validateNews,
  handleValidationErrors,
  invalidateCache(['portal:/api/news*', 'portal:/api/dashboard*']),
  createNews
);
router.put(
  '/:id',
  protect,
  optionalUpload,
  handleUploadError,
  validateUpdateNews,
  handleValidationErrors,
  invalidateCache(['portal:/api/news*', 'portal:/api/dashboard*']),
  updateNews
);
router.delete(
  '/:id',
  protect,
  invalidateCache(['portal:/api/news*', 'portal:/api/dashboard*']),
  deleteNews
);
router.get('/:id', protect, getNewsById);

export default router;

