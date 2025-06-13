import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Endpoint untuk login
router.post('/login', loginLimiter,login);

export default router;
