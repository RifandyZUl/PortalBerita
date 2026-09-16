/**
 * Custom Application Error Class
 * 
 * Extended Error class untuk handling custom application errors.
 * Memungkinkan error handling yang lebih konsisten dan terstruktur.
 * 
 * Features:
 * - Support untuk user-friendly messages (safe untuk user)
 * - Support untuk developer messages (detailed untuk debugging)
 * - Support untuk error codes
 * - Support untuk additional context
 * 
 * @class AppError
 * @extends Error
 * 
 * @example
 * throw new AppError('News not found', HTTP_STATUS.NOT_FOUND, {
 *   userMessage: 'Berita tidak ditemukan',
 *   code: 'NEWS_NOT_FOUND',
 *   context: { newsId: 123 }
 * });
 */
export class AppError extends Error {
  /**
   * Creates an instance of AppError
   * 
   * @param {string} message - Developer message (detailed, untuk logging)
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {Object} options - Additional options
   * @param {string} options.userMessage - User-friendly message (safe untuk user)
   * @param {string} options.code - Error code untuk tracking
   * @param {Object} options.context - Additional context untuk logging
   * @param {boolean} options.isOperational - Is this an operational error (default: true)
   */
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = options.isOperational !== false; // Default: true (operational error)
    this.name = this.constructor.name;
    
    // User-friendly message (safe untuk user)
    // Jika tidak ada userMessage, gunakan message sebagai fallback
    this.userMessage = options.userMessage || this._getDefaultUserMessage(statusCode);
    
    // Error code untuk tracking
    this.code = options.code || this._getDefaultErrorCode(statusCode);
    
    // Additional context untuk logging
    this.context = options.context || {};
    
    // Errors array untuk validation errors
    this.errors = options.errors || null;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get default user message based on status code
   * 
   * @param {number} statusCode - HTTP status code
   * @returns {string} Default user message
   * @private
   */
  _getDefaultUserMessage(statusCode) {
    const defaultMessages = {
      400: 'Permintaan tidak valid',
      401: 'Anda tidak memiliki akses',
      403: 'Akses ditolak',
      404: 'Data tidak ditemukan',
      409: 'Data sudah ada',
      422: 'Data tidak valid',
      500: 'Terjadi kesalahan pada server',
      503: 'Layanan tidak tersedia',
    };

    return defaultMessages[statusCode] || 'Terjadi kesalahan';
  }

  /**
   * Get default error code based on status code
   * 
   * @param {number} statusCode - HTTP status code
   * @returns {string} Default error code
   * @private
   */
  _getDefaultErrorCode(statusCode) {
    const defaultCodes = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    };

    return defaultCodes[statusCode] || 'UNKNOWN_ERROR';
  }

  /**
   * Convert error to JSON for logging
   * 
   * @returns {Object} Error object for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message, // Developer message
      userMessage: this.userMessage, // User-friendly message
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      errors: this.errors,
      stack: this.stack,
    };
  }
}
