// routes/author.routes.js
import express from 'express';
import { getAllAuthors } from '../controllers/authorController.js';

const router = express.Router();
router.get('/', getAllAuthors);

export default router;
