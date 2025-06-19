import { cloudinary } from '../utils/cloudinary.js';
import Admin from '../models/admin.js';

export const updateProfile = async (req, res) => {
  try {
    const adminId = req.user?.adminId || 1; // ganti sesuai implementasi autentikasi kamu

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' });
    }

    const { firstName, lastName, email, username, bio } = req.body;

    // Jika ada file yang di-upload, ambil URL dari Cloudinary
    let photoUrl = admin.photo;
    // admin.controller.js
    if (req.file?.path) {
    photoUrl = req.file.path; // otomatis URL dari Cloudinary
    }

    await admin.update({
    firstName,
    lastName,
    email,
    username,
    bio,
    photo: photoUrl, // ⬅ sesuai nama kolom yang ada
    });


    res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: admin,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil.' });
  }
};
