/**
 * Global Error Handler Utility
 * 
 * Utility untuk handle errors secara konsisten di seluruh aplikasi.
 * 
 * Features:
 * - Safe error messages untuk user
 * - Detailed error messages untuk developer (logging)
 * - Structured error responses
 * - Automatic error logging
 * 
 * @module utils/errorHandler
 */

import { AppError } from './AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import { logError, logWarn } from './logger.js';

/**
 * Handle application errors
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Object} Error response
 */
export const handleError = (err, req, res, next) => {
  // Build error context untuk logging
  const errorContext = {
    url: req?.originalUrl,
    method: req?.method,
    ip: req?.ip || req?.connection?.remoteAddress,
    userAgent: req?.get('user-agent'),
    userId: req?.admin?.adminId || req?.user?.userId || null,
    body: process.env.NODE_ENV === 'development' ? req?.body : undefined,
    params: req?.params,
    query: req?.query,
  };

  // Handle AppError (operational errors - expected errors)
  if (err instanceof AppError) {
    // Log error dengan context
    logError(err, {
      ...errorContext,
      ...err.context,
      code: err.code,
      userMessage: err.userMessage,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.userMessage, // Safe message untuk user
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && {
        // Hanya tampilkan detail di development
        developerMessage: err.message,
        stack: err.stack,
      }),
      ...(err.errors && { errors: err.errors }),
    });
  }

  // Handle validation errors (express-validator)
  if (err.name === 'ValidationError' || err.name === 'validationError') {
    logWarn('Validation Error', {
      ...errorContext,
      errors: err.errors || err.array?.() || err.message,
    });

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION.FAILED || 'Data tidak valid',
      code: 'VALIDATION_ERROR',
      errors: err.errors || err.array?.() || err.message,
    });
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    logWarn('Sequelize Validation Error', {
      ...errorContext,
      errors: err.errors,
    });

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION.FAILED || 'Data tidak valid',
      code: 'VALIDATION_ERROR',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    logWarn('Unique Constraint Error', {
      ...errorContext,
      errors: err.errors,
    });

    const field = err.errors?.[0]?.path || 'data';
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: `${field} sudah ada dalam database`,
      code: 'DUPLICATE_ENTRY',
      errors: err.errors?.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    logWarn('Foreign Key Constraint Error', {
      ...errorContext,
      error: err.message,
    });

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Data yang direferensikan tidak ditemukan',
      code: 'FOREIGN_KEY_ERROR',
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    logWarn('JWT Error', {
      ...errorContext,
      error: 'Invalid token',
    });

    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.AUTH.TOKEN_INVALID || 'Token tidak valid',
      code: 'INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError') {
    logWarn('JWT Expired', {
      ...errorContext,
      error: 'Token expired',
    });

    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Token telah kadaluarsa',
      code: 'TOKEN_EXPIRED',
    });
  }

  // Handle Multer errors (file upload)
  if (err.name === 'MulterError') {
    logWarn('File Upload Error', {
      ...errorContext,
      error: err.message,
      code: err.code,
    });

    let message = 'Terjadi kesalahan saat mengupload file';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Ukuran file terlalu besar';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Jumlah file melebihi batas';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Field file tidak valid';
    }

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message,
      code: 'FILE_UPLOAD_ERROR',
    });
  }

  // Handle Cast errors (invalid ID format)
  if (err.name === 'CastError' || err.kind === 'ObjectId') {
    logWarn('Cast Error', {
      ...errorContext,
      error: err.message,
    });

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Format ID tidak valid',
      code: 'INVALID_ID_FORMAT',
    });
  }

  // Default error (unexpected errors - programming errors, bugs)
  // Log dengan detail penuh untuk debugging
  logError(err, {
    ...errorContext,
    isOperational: false,
    type: 'UNEXPECTED_ERROR',
  });

  // Response untuk user (safe, tidak expose detail)
  const response = {
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? MESSAGES.GENERAL.SERVER_ERROR || 'Terjadi kesalahan pada server'
      : err.message, // Di development, tampilkan message
    code: 'INTERNAL_SERVER_ERROR',
  };

  // Hanya tambahkan detail di development
  if (process.env.NODE_ENV === 'development') {
    response.developerMessage = err.message;
    response.stack = err.stack;
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};

/**
 * Async handler wrapper untuk catch errors di async route handlers
 * 
 * @param {Function} fn - Async function
 * @returns {Function} Wrapped function
 * 
 * @example
 * router.get('/news', asyncHandler(async (req, res) => {
 *   const news = await newsService.getAll();
 *   res.json(news);
 * }));
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create AppError dengan user message yang aman
 * 
 * @param {string} developerMessage - Detailed message untuk developer
 * @param {number} statusCode - HTTP status code
 * @param {string} userMessage - Safe message untuk user
 * @param {Object} options - Additional options
 * @returns {AppError} AppError instance
 * 
 * @example
 * throw createSafeError(
 *   'Database connection failed: Connection timeout after 30s',
 *   HTTP_STATUS.INTERNAL_SERVER_ERROR,
 *   'Layanan sedang sibuk, silakan coba lagi nanti'
 * );
 */
export const createSafeError = (
  developerMessage,
  statusCode = 500,
  userMessage = null,
  options = {}
) => {
  return new AppError(developerMessage, statusCode, {
    userMessage,
    ...options,
  });
};
