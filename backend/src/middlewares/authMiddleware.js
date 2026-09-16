/**
 * Authentication Middleware
 * 
 * Middleware untuk protect routes yang memerlukan authentication.
 * 
 * @module middlewares/authMiddleware
 */

import jwt from 'jsonwebtoken';
import db from '../infrastructure/database/models/index.js';
import { errorResponse } from '../utils/responseHandler.js';

const { Admin } = db;

/**
 * Protect route dengan JWT authentication
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {Object|void} Error response or next()
 */
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Akses ditolak. Token tidak ditemukan.', null, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.adminId) {
      return errorResponse(res, 'Token tidak valid.', null, 403);
    }

    const admin = await Admin.findByPk(decoded.adminId);
    if (!admin) {
      return errorResponse(res, 'Admin tidak ditemukan.', null, 401);
    }

    req.admin = admin; // Tambahkan admin ke req
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ Token verification error:', error.message);
    }

    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token kadaluarsa. Silakan login kembali.', null, 401);
    }

    return errorResponse(res, 'Token tidak valid atau error lainnya.', error.message, 403);
  }
};

