/**
 * Comment Validator
 * 
 * Express-validator rules untuk Comment validation.
 * Memastikan semua input comment divalidasi dengan ketat untuk mencegah XSS dan injection attacks.
 * 
 * @module validators/commentValidator
 */

import { body, param } from 'express-validator';
import db from '../infrastructure/database/models/index.js';

const { News } = db;

/**
 * Validator untuk create comment (public endpoint)
 */
export const validateCreateComment = [
  param('newsId')
    .notEmpty().withMessage('News ID wajib diisi')
    .isInt({ min: 1 }).withMessage('News ID harus berupa angka positif')
    .custom(async (value) => {
      const news = await News.findByPk(parseInt(value));
      if (!news) {
        return Promise.reject('Berita tidak ditemukan');
      }
      return true;
    }),

  body('name')
    .notEmpty().withMessage('Nama wajib diisi')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Nama harus antara 2-100 karakter')
    .matches(/^[a-zA-Z0-9\s.,'-]+$/).withMessage('Nama hanya boleh mengandung huruf, angka, dan karakter khusus (.,\'-)')
    .escape(),

  body('email')
    .notEmpty().withMessage('Email wajib diisi')
    .trim()
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email maksimal 255 karakter'),

  body('comment')
    .notEmpty().withMessage('Komentar wajib diisi')
    .trim()
    .isLength({ min: 1, max: 2000 }).withMessage('Komentar maksimal 2000 karakter')
    .custom((value) => {
      // Cek apakah mengandung script tags atau javascript
      const scriptPattern = /<script|javascript:|onerror=|onload=/i;
      if (scriptPattern.test(value)) {
        throw new Error('Komentar tidak boleh mengandung script atau kode berbahaya');
      }
      return true;
    }),
];

/**
 * Validator untuk update comment status (admin only)
 */
export const validateUpdateCommentStatus = [
  param('id')
    .notEmpty().withMessage('Comment ID wajib diisi')
    .isInt({ min: 1 }).withMessage('Comment ID harus berupa angka positif'),

  body('status')
    .notEmpty().withMessage('Status wajib diisi')
    .isIn(['Pending', 'Approved', 'Spam']).withMessage('Status harus Pending, Approved, atau Spam'),
];

