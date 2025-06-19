import express from 'express';
import {
  getAllComments,
  updateCommentStatus,
  deleteComment,
} from '../controllers/comment.controller.js';

const router = express.Router();

router.get('/', getAllComments);
router.patch('/:id/status', updateCommentStatus);
router.delete('/:id', deleteComment);

export default router;
