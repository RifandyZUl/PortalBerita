/**
 * Response Handler Utility
 * 
 * Utility untuk handle HTTP responses secara konsisten.
 * 
 * @module utils/responseHandler
 */

/**
 * Send success response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} JSON response
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send error response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {*} errors - Error details
 * @param {number} statusCode - HTTP status code (default: 400)
 * @returns {Object} JSON response
 */
export const errorResponse = (res, message, errors = null, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

