/**
 * Author Validator
 * 
 * Express-validator rules untuk Author validation.
 * Memastikan semua input author divalidasi dengan ketat.
 * 
 * @module validators/authorValidator
 */

import { body, param } from 'express-validator';

/**
 * Validator untuk create author
 */
export const validateAuthor = [
  body('name')
    .notEmpty().withMessage('Nama author wajib diisi')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Nama author harus antara 2-100 karakter')
    .matches(/^[a-zA-Z0-9\s.,'-]+$/).withMessage('Nama hanya boleh mengandung huruf, angka, dan karakter khusus (.,\'-)')
    .escape(),

  body('bio')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Bio maksimal 1000 karakter')
    .custom((value) => {
      if (value) {
        // Cek apakah mengandung script tags atau javascript
        const scriptPattern = /<script|javascript:|onerror=|onload=/i;
        if (scriptPattern.test(value)) {
          throw new Error('Bio tidak boleh mengandung script atau kode berbahaya');
        }
      }
      return true;
    }),
];

/**
 * Validator untuk update author
 */
export const validateUpdateAuthor = [
  param('id')
    .notEmpty().withMessage('Author ID wajib diisi')
    .isInt({ min: 1 }).withMessage('Author ID harus berupa angka positif'),

  ...validateAuthor,
];

