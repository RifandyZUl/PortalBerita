/**
 * Admin Routes
 * 
 * Routes untuk Admin endpoints.
 * 
 * @module routes/admin/admin.routes
 */

import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import upload, { handleUploadError } from '../../middlewares/uploadMiddleware.js';
import { getProfile, updateProfile } from '../../controllers/AdminController.js';

const router = express.Router();

router.get('/profile', protect, getProfile);

// Route untuk update profil + upload gambar ke Cloudinary
router.put('/profile', protect, upload.single('photo'), handleUploadError, updateProfile);

export default router;

