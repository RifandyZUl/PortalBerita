import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import upload from '../../middlewares/uploadMiddleware.js';
import { updateProfile } from '../../controllers/admin.controller.js';


const router = express.Router();

router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Data admin saat ini',
    admin: req.admin,
  });
});

// Route untuk update profil + upload gambar ke Cloudinary
router.put('/profile', protect, upload.single('photo'), updateProfile);


export default router;
