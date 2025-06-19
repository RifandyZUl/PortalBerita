// routes/newsRoutes.js
import express from 'express';
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews
} from '../controllers/news.controller.js';

import { protect } from '../middlewares/authMiddleware.js';
import { validateNews } from '../validators/newsValidator.js';
import { handleValidationErrors } from '../utils/handleValidation.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post(
  '/',
  protect,
  upload.single('image'), // ⬅️ ini harus duluan
  validateNews,
  handleValidationErrors,
  createNews
);

router.put('/:id', protect, upload.single('image'), validateNews, handleValidationErrors, updateNews);
router.delete('/:id', protect, deleteNews);

export default router;
