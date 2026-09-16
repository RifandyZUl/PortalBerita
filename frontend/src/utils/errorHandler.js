/**
 * Error Handler Utility
 * 
 * Centralized error handling untuk frontend.
 * Menyediakan fungsi-fungsi untuk handle errors secara konsisten.
 * 
 * Features:
 * - Extract user-friendly messages dari backend
 * - Log errors untuk development
 * - Handle different error types
 * - Provide fallback messages
 * 
 * @module utils/errorHandler
 */

/**
 * Extract error message dari error object
 * 
 * Priority:
 * 1. Backend response message (user-friendly)
 * 2. Error message
 * 3. Fallback message
 * 
 * @param {Error} error - Error object
 * @param {string} fallbackMessage - Fallback message jika tidak ada error message
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, fallbackMessage = 'Terjadi kesalahan. Silakan coba lagi.') => {
  // Handle Axios error dengan response dari backend
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Handle error dengan message
  if (error.message) {
    return error.message;
  }

  // Handle error object langsung
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return fallbackMessage;
};

/**
 * Extract error code dari error object
 * 
 * @param {Error} error - Error object
 * @returns {string|null} Error code atau null
 */
export const getErrorCode = (error) => {
  return error.response?.data?.code || error.code || null;
};

/**
 * Extract validation errors dari error object
 * 
 * @param {Error} error - Error object
 * @returns {Array|null} Validation errors array atau null
 */
export const getValidationErrors = (error) => {
  return error.response?.data?.errors || null;
};

/**
 * Check jika error adalah network error
 * 
 * @param {Error} error - Error object
 * @returns {boolean} True jika network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.message === 'Network Error';
};

/**
 * Check jika error adalah timeout error
 * 
 * @param {Error} error - Error object
 * @returns {boolean} True jika timeout error
 */
export const isTimeoutError = (error) => {
  return error.code === 'ECONNABORTED' || error.message?.includes('timeout');
};

/**
 * Check jika error adalah unauthorized (401)
 * 
 * @param {Error} error - Error object
 * @returns {boolean} True jika unauthorized
 */
export const isUnauthorizedError = (error) => {
  return error.response?.status === 401;
};

/**
 * Check jika error adalah forbidden (403)
 * 
 * @param {Error} error - Error object
 * @returns {boolean} True jika forbidden
 */
export const isForbiddenError = (error) => {
  return error.response?.status === 403;
};

/**
 * Check jika error adalah not found (404)
 * 
 * @param {Error} error - Error object
 * @returns {boolean} True jika not found
 */
export const isNotFoundError = (error) => {
  return error.response?.status === 404;
};

/**
 * Check jika error adalah validation error (400)
 * 
 * @param {Error} error - Error object
 * @returns {boolean} True jika validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 400 || getValidationErrors(error) !== null;
};

/**
 * Get HTTP status code dari error
 * 
 * @param {Error} error - Error object
 * @returns {number|null} HTTP status code atau null
 */
export const getErrorStatus = (error) => {
  return error.response?.status || null;
};

/**
 * Format error untuk logging (development only)
 * 
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {Object} Formatted error object
 */
export const formatErrorForLogging = (error, context = {}) => {
  const isDevelopment = import.meta.env.MODE === 'development';

  if (!isDevelopment) {
    return null; // Don't log in production
  }

  return {
    message: getErrorMessage(error),
    code: getErrorCode(error),
    status: getErrorStatus(error),
    url: error.config?.url || context.url,
    method: error.config?.method || context.method,
    validationErrors: getValidationErrors(error),
    ...context,
  };
};

/**
 * Log error untuk development
 * 
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
  const isDevelopment = import.meta.env.MODE === 'development';

  if (!isDevelopment) {
    return; // Don't log in production
  }

  const formattedError = formatErrorForLogging(error, context);
  
  if (formattedError) {
    console.error('❌ API Error:', formattedError);
    
    // Log full error object untuk debugging
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
};

/**
 * Handle API error dan return formatted error
 * 
 * @param {Error} error - Error object
 * @param {string} fallbackMessage - Fallback message
 * @param {Object} context - Additional context untuk logging
 * @returns {Error} Formatted error dengan user-friendly message
 */
export const handleApiError = (error, fallbackMessage = 'Terjadi kesalahan. Silakan coba lagi.', context = {}) => {
  // Log error untuk development
  logError(error, context);

  // Extract user-friendly message
  const message = getErrorMessage(error, fallbackMessage);

  // Create new error dengan message yang sudah di-format
  const formattedError = new Error(message);
  
  // Attach additional info untuk debugging
  formattedError.code = getErrorCode(error);
  formattedError.status = getErrorStatus(error);
  formattedError.validationErrors = getValidationErrors(error);
  formattedError.originalError = error;

  return formattedError;
};

/**
 * Get user-friendly message berdasarkan error type
 * 
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
export const getUserFriendlyMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  }

  if (isTimeoutError(error)) {
    return 'Request timeout. Silakan coba lagi.';
  }

  if (isUnauthorizedError(error)) {
    return 'Sesi Anda telah berakhir. Silakan login kembali.';
  }

  if (isForbiddenError(error)) {
    return 'Anda tidak memiliki akses untuk melakukan aksi ini.';
  }

  if (isNotFoundError(error)) {
    return 'Data tidak ditemukan.';
  }

  if (isValidationError(error)) {
    const validationErrors = getValidationErrors(error);
    if (validationErrors && validationErrors.length > 0) {
      return validationErrors[0].message || 'Data tidak valid.';
    }
    return 'Data yang Anda masukkan tidak valid.';
  }

  // Default: use message dari backend atau fallback
  return getErrorMessage(error, 'Terjadi kesalahan. Silakan coba lagi.');
};

