import Admin from '../models/admin.js';

export const updateProfile = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    // Ambil data admin dari database
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    }

    // Ambil data dari body
    const { firstName, lastName, bio } = req.body;

    // Cek apakah ada file gambar yang diupload
    if (req.file && req.file.path) {
      admin.photo = req.file.path; // Cloudinary URL
    }

    // Update data lainnya
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.bio = bio || admin.bio;

    // Simpan perubahan
    await admin.save();

    return res.json({ message: 'Profil berhasil diperbarui', admin });
  } catch (error) {
    console.error('Gagal update profil:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
