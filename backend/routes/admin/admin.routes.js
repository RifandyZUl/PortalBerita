import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
// (Tambahkan controller lain sesuai kebutuhan, misalnya untuk update profil, dll)

const router = express.Router();

// Misalnya endpoint untuk dapatkan data admin yang login
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Data admin saat ini',
    admin: req.admin, // ini akan ada karena middleware `protect` menyisipkan admin ke req
  });
});

// Kamu bisa tambahkan endpoint lain seperti:
// PUT /api/admin/profile
// DELETE /api/admin/:id

export default router;
