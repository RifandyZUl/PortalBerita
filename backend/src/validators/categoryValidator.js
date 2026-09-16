/**
 * Category Validator
 * 
 * Express-validator rules untuk Category validation.
 * Memastikan semua input category divalidasi dengan ketat.
 * 
 * @module validators/categoryValidator
 */

import { body, param } from 'express-validator';

/**
 * Validator untuk create category
 */
export const validateCategory = [
  body('name')
    .notEmpty().withMessage('Nama kategori wajib diisi')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Nama kategori harus antara 3-100 karakter')
    .matches(/^[a-zA-Z0-9\s-]+$/).withMessage('Nama kategori hanya boleh mengandung huruf, angka, dan spasi')
    .escape(),

  body('slug')
    .notEmpty().withMessage('Slug tidak boleh kosong')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Slug harus antara 3-100 karakter')
    .matches(/^[a-z0-9-]+$/).withMessage('Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung')
    .custom((value) => {
      // Slug tidak boleh dimulai atau diakhiri dengan tanda hubung
      if (value.startsWith('-') || value.endsWith('-')) {
        throw new Error('Slug tidak boleh dimulai atau diakhiri dengan tanda hubung');
      }
      // Slug tidak boleh mengandung tanda hubung berturut-turut
      if (value.includes('--')) {
        throw new Error('Slug tidak boleh mengandung tanda hubung berturut-turut');
      }
      return true;
    }),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter')
    .custom((value) => {
      if (value) {
        // Cek apakah mengandung script tags atau javascript
        const scriptPattern = /<script|javascript:|onerror=|onload=/i;
        if (scriptPattern.test(value)) {
          throw new Error('Deskripsi tidak boleh mengandung script atau kode berbahaya');
        }
      }
      return true;
    }),

  body('parentId')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Parent ID harus berupa angka positif'),

  body('icon')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('Icon maksimal 50 karakter')
    .matches(/^[a-zA-Z0-9-]+$/).withMessage('Icon hanya boleh mengandung huruf, angka, dan tanda hubung'),
];

/**
 * Validator untuk update category
 */
export const validateUpdateCategory = [
  param('id')
    .notEmpty().withMessage('Category ID wajib diisi')
    .isInt({ min: 1 }).withMessage('Category ID harus berupa angka positif'),

  ...validateCategory,
];

