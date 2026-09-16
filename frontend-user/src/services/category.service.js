/**
 * Category Service
 * 
 * Service layer untuk Category API calls (Public).
 * Menangani semua komunikasi dengan backend untuk Category endpoints.
 * 
 * @module services/category.service
 */

import api from '../utils/api.js';
import { handleApiError } from '../utils/errorHandler.js';

/**
 * Get all categories
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of category objects
 */
export const getAllCategories = async (params = {}) => {
  try {
    const response = await api.get('/api/categories', { params });
    return response.data?.data?.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

// Error handling sudah di-handle oleh centralized errorHandler
// Import dari utils/errorHandler.js

