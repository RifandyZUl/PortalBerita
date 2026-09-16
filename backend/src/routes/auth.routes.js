/**
 * Auth Routes
 * 
 * Routes untuk authentication endpoints.
 * 
 * @module routes/auth.routes
 */

import express from 'express';
import { login } from '../controllers/AuthController.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Endpoint untuk login
router.post('/login', loginLimiter, login);

export default router;

