import express from 'express';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { validateCategory } from '../validators/categoryValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', protect, validateCategory, createCategory);
router.put('/:id', protect, validateCategory, updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;
