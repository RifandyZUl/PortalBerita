/**
 * Category Routes
 * 
 * Routes untuk Category endpoints.
 * 
 * @module routes/category.routes
 */

import express from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/CategoryController.js';
import { validateCategory, validateUpdateCategory } from '../validators/categoryValidator.js';
import { protect } from '../middlewares/authMiddleware.js';
import { handleValidationErrors } from '../utils/handleValidation.js';
import { cacheResponse, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

// Public routes (Cached for 30 minutes)
router.get('/', cacheResponse(1800), getAllCategories);
router.get('/:id', cacheResponse(1800), getCategoryById);

// Protected routes (Admin only with auto cache invalidation)
router.post(
  '/',
  protect,
  validateCategory,
  handleValidationErrors,
  invalidateCache(['portal:/api/categories*', 'portal:/api/news*']),
  createCategory
);
router.put(
  '/:id',
  protect,
  validateUpdateCategory,
  handleValidationErrors,
  invalidateCache(['portal:/api/categories*', 'portal:/api/news*']),
  updateCategory
);
router.delete(
  '/:id',
  protect,
  invalidateCache(['portal:/api/categories*', 'portal:/api/news*']),
  deleteCategory
);

export default router;

