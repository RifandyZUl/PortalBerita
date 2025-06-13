// validators/newsValidator.js
import { body } from 'express-validator';
import db from '../models/index.js';

export const validateNews = [
  body('title')
    .notEmpty().withMessage('Judul tidak boleh kosong')
    .isLength({ min: 10 }).withMessage('Judul minimal 10 karakter'),

  body('content')
    .notEmpty().withMessage('Konten tidak boleh kosong')
    .isLength({ min: 100 }).withMessage('Konten minimal 100 karakter'),

  body('imageUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('URL gambar tidak valid'),

  body('authorId')
    .notEmpty().withMessage('Author wajib dipilih')
    .isInt().withMessage('Author harus berupa ID numerik')
    .custom(async (value) => {
      const author = await db.Author.findByPk(value);
      if (!author) {
        return Promise.reject('Author tidak ditemukan');
      }
    }),

  body('categoryId')
    .notEmpty().withMessage('Kategori wajib dipilih')
    .isInt().withMessage('Kategori harus berupa ID numerik')
    .custom(async (value) => {
      const category = await db.Category.findByPk(value);
      if (!category) {
        return Promise.reject('Kategori tidak ditemukan');
      }
    }),

  body('status')
    .notEmpty().withMessage('Status wajib diisi')
    .isIn(['draft', 'published']).withMessage('Status harus draft atau published'),

  body('publishedAt')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Format tanggal tidak valid')
    .custom((value) => {
      const date = new Date(value);
      if (date > new Date()) {
        throw new Error('Tanggal terbit tidak boleh di masa depan');
      }
      return true;
    }),
];
