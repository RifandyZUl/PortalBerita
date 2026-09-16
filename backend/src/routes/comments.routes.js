/**
 * Comment Routes
 * 
 * Routes untuk Comment endpoints.
 * 
 * @module routes/comments.routes
 */

import express from 'express';
import {
  getAllComments,
  createComment,
  updateCommentStatus,
  deleteComment,
  getCommentsByNewsSlug,
} from '../controllers/CommentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateCreateComment, validateUpdateCommentStatus } from '../validators/commentValidator.js';
import { handleValidationErrors } from '../utils/handleValidation.js';

const router = express.Router();

// GET /api/comments?status=&search=&page=&limit= (Admin only)
router.get('/', protect, getAllComments);

// POST /api/comments/:newsId → kirim komentar untuk berita tertentu (Public)
router.post(
  '/:newsId',
  validateCreateComment,
  handleValidationErrors,
  createComment
);

// PATCH /api/comments/:id/status → update status komentar (Admin only)
router.patch(
  '/:id/status',
  protect,
  validateUpdateCommentStatus,
  handleValidationErrors,
  updateCommentStatus
);

// DELETE /api/comments/:id → hapus komentar (Admin only)
router.delete('/:id', protect, deleteComment);

// GET /api/comments/public/:slug → get comments by news slug (Public)
router.get('/public/:slug', getCommentsByNewsSlug);

export default router;

