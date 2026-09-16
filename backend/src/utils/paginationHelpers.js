/**
 * Pagination Helper Utilities
 * 
 * Utility functions untuk pagination operations.
 * Mengikuti DRY principle dan Single Responsibility Principle.
 * 
 * @module utils/paginationHelpers
 */

/**
 * Calculate pagination offset
 * 
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {number} Offset value
 */
export const calculateOffset = (page, limit) => {
  return (parseInt(page) - 1) * parseInt(limit);
};

/**
 * Validate and normalize pagination parameters
 * 
 * @param {Object} params - Pagination parameters
 * @param {number} defaultLimit - Default limit (default: 10)
 * @param {number} maxLimit - Maximum limit (default: 100)
 * @returns {Object} Normalized pagination object { page, limit, offset }
 */
export const normalizePaginationParams = (params = {}, defaultLimit = 10, maxLimit = 100) => {
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.max(1, Math.min(maxLimit, parseInt(params.limit) || defaultLimit));
  const offset = calculateOffset(page, limit);
  
  return { page, limit, offset };
};

/**
 * Build pagination response metadata
 * 
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} perPage - Items per page
 * @returns {Object} Pagination metadata
 */
export const buildPaginationMetadata = (totalItems, currentPage, perPage) => {
  return {
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    currentPage,
    perPage
  };
};

/**
 * Build paginated response (standard format)
 * 
 * @param {Array} data - Data array
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} perPage - Items per page
 * @returns {Object} Paginated response
 */
export const buildPaginatedResponse = (data, totalItems, currentPage, perPage) => {
  return {
    data,
    pagination: buildPaginationMetadata(totalItems, currentPage, perPage)
  };
};

/**
 * Build paginated response for Dashboard (backward compatible format)
 * 
 * @param {Array} items - Items array
 * @param {string} itemsKey - Key name for items (e.g., 'articles', 'comments')
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} perPage - Items per page
 * @returns {Object} Paginated response with backward compatible format
 */
export const buildDashboardPaginatedResponse = (items, itemsKey, totalItems, currentPage, perPage) => {
  const totalPages = Math.ceil(totalItems / perPage);
  
  return {
    [itemsKey]: items,
    total: totalItems,
    currentPage,
    totalPages
  };
};
