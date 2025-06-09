// routes/newsRoutes.js
import express from 'express';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// ✅ Validasi sesuai model News
const validateNews = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('imageUrl').optional().isURL().withMessage('Invalid image URL'),
  body('authorId').notEmpty().withMessage('Author ID is required').isInt(),
  body('categoryId').notEmpty().withMessage('Category ID is required').isInt(),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
];

router.get('/', getAllNews);
router.get('/:id', getNewsById);

// 🔐 Protected routes (require Bearer Token)
router.post('/', protect, validateNews, createNews);
router.put('/:id', protect, validateNews, updateNews);
router.delete('/:id', protect, deleteNews);

export default router;
