/**
 * Author Routes
 * 
 * Routes untuk Author endpoints.
 * 
 * @module routes/author.routes
 */

import express from 'express';
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../controllers/AuthorController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateAuthor, validateUpdateAuthor } from '../validators/authorValidator.js';
import { handleValidationErrors } from '../utils/handleValidation.js';

const router = express.Router();

// Public routes
router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);

// Protected routes (Admin only)
router.post('/', protect, validateAuthor, handleValidationErrors, createAuthor);
router.put('/:id', protect, validateUpdateAuthor, handleValidationErrors, updateAuthor);
router.delete('/:id', protect, deleteAuthor);

export default router;

