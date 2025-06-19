import { body } from 'express-validator';

export const validateCategory = [
  body('name')
    .notEmpty().withMessage('Nama kategori wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama kategori minimal 3 karakter'),
  body('slug')
    .notEmpty().withMessage('Slug tidak boleh kosong'),
];
