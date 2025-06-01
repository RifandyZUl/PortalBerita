import express from 'express';
import { getAllNews, createNews } from '../controllers/newsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllNews);
router.post('/', protect, createNews);

export default router;
