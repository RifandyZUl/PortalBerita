import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import { generateToken } from '../utils/token.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password || typeof emailOrUsername !== 'string') {
    return errorResponse(res, 'Email/username dan password wajib diisi.', null, 400);
  }

  try {
    const admin = await db.Admin.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });

    if (!admin) {
      return errorResponse(res, 'Email atau username tidak ditemukan.', null, 401);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return errorResponse(res, 'Password salah.', null, 401);
    }

    const token = generateToken(admin.adminId);

    return successResponse(res, 'Login berhasil.', { token });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    return errorResponse(res, 'Terjadi kesalahan pada server.', err.message, 500);
  }
};
