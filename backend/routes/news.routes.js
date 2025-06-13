// routes/newsRoutes.js
import express from 'express';
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews
} from '../controllers/newsController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateNews } from '../validators/newsValidator.js';
import { handleValidationErrors } from '../utils/handleValidation.js';


const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', protect, validateNews, createNews);
router.put('/:id', protect, validateNews, updateNews);
router.delete('/:id', protect, deleteNews);
router.post('/', protect, validateNews, handleValidationErrors, createNews);
router.put('/:id', protect, validateNews, handleValidationErrors, updateNews);

export default router;
