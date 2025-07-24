import express from 'express';
import {
  getAllComments,
  createComment,
  updateCommentStatus,
  deleteComment,
  getCommentsByNewsSlug,
} from '../controllers/comment.controller.js';

const router = express.Router();

// GET /api/comments?status=&search=&page=&limit=
router.get('/', getAllComments);

// POST /api/comments/:newsId → kirim komentar untuk berita tertentu
router.post('/:newsId', createComment);

// PATCH /api/comments/:id/status → update status komentar
router.patch('/:id/status', updateCommentStatus);

// DELETE /api/comments/:id → hapus komentar
router.delete('/:id', deleteComment);

router.get('/public/:slug', getCommentsByNewsSlug); // tambahkan ini

export default router;
