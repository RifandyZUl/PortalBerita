/**
 * Validation Helper Utilities
 * 
 * Utility functions untuk validation operations.
 * Mengikuti DRY principle dan Single Responsibility Principle.
 * 
 * @module utils/validationHelpers
 */

import { AppError } from './AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Validate news ID
 * 
 * @param {string|number} id - News ID
 * @returns {number} Parsed and validated news ID
 * @throws {AppError} If ID is invalid
 */
export const validateNewsId = (id) => {
  const newsId = parseInt(id, 10);
  
  if (isNaN(newsId)) {
    throw new AppError('ID berita tidak valid.', HTTP_STATUS.BAD_REQUEST);
  }
  
  return newsId;
};

/**
 * Validate search keyword
 * 
 * @param {string} keyword - Search keyword
 * @param {number} minLength - Minimum keyword length (default: 2)
 * @throws {AppError} If keyword is too short
 */
export const validateSearchKeyword = (keyword, minLength = 2) => {
  if (!keyword || keyword.trim().length < minLength) {
    throw new AppError(MESSAGES.VALIDATION.KEYWORD_MIN_LENGTH, HTTP_STATUS.BAD_REQUEST);
  }
};

/**
 * Validate comment status
 * 
 * @param {string} status - Comment status
 * @returns {boolean} True if status is valid
 * @throws {AppError} If status is invalid
 */
export const validateCommentStatus = (status) => {
  const validStatuses = ['Pending', 'Approved', 'Spam'];
  
  if (!validStatuses.includes(status)) {
    throw new AppError(
      'Status tidak valid. Harus Pending, Approved, atau Spam.',
      HTTP_STATUS.BAD_REQUEST
    );
  }
  
  return true;
};

/**
 * Validate pagination parameters
 * 
 * @param {Object} params - Pagination parameters
 * @returns {Object} Validated pagination object
 */
export const validatePaginationParams = (params = {}) => {
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(params.limit) || 10));
  
  return { page, limit };
};

