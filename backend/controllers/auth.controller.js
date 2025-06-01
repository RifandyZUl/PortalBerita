// Import bcryptjs untuk membandingkan password yang di-hash
import bcrypt from 'bcryptjs';

// Import jsonwebtoken untuk membuat token autentikasi
import jwt from 'jsonwebtoken';

// Import model Admin dari folder models
import { Admin } from '../models/admin.models.js';

/**
 * Controller untuk proses login admin.
 * Mengecek apakah email dan password cocok, lalu mengirimkan JWT token jika berhasil.
 */
export const login = async (req, res) => {
  const { email, password } = req.body; // Ambil email dan password dari request body

  try {
    // Cari admin berdasarkan email yang dikirimkan
    const admin = await Admin.findOne({ where: { email } });

    // Jika admin tidak ditemukan, kirim respons 401 (unauthorized)
    if (!admin) return res.status(401).json({ message: 'Email tidak ditemukan' });

    // ✅ Log debugging (optional - boleh dihapus di production)
    console.log('Email masuk:', email);
    console.log('Password masuk:', password);
    console.log('Password di DB:', admin.password);

    // Bandingkan password dari input dengan yang ada di database (yang sudah di-hash)
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password cocok:', isMatch); // true jika cocok

    // Jika password tidak cocok, kirim respons 401
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    // Buat token JWT yang berisi ID admin dan berlaku selama 1 hari
    const token = jwt.sign(
      { id: admin.id },               // Payload token
      process.env.JWT_SECRET,        // Secret key dari .env
      { expiresIn: '1d' }            // Token berlaku 1 hari
    );

    // Kirim token sebagai respons jika login berhasil
    res.status(200).json({ token });
  } catch (err) {
    // Tangani jika ada error server
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
