/**
 * Validation Handler Utility
 * 
 * Utility untuk handle validation errors dari express-validator.
 * 
 * @module utils/handleValidation
 */

import { validationResult } from 'express-validator';

/**
 * Handle validation errors from express-validator
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {Object|void} Error response or next()
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formattedErrors = errors.array().map(err => ({
    field: err.param,
    message: err.msg
  }));

  // Log validation errors
  console.error('❌ Validation failed:', formattedErrors);

  return res.status(400).json({
    success: false,
    message: 'Data tidak valid',
    errors: formattedErrors
  });
};

