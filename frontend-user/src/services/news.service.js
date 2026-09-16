/**
 * News Service
 * 
 * Service layer untuk News API calls (Public).
 * Menangani semua komunikasi dengan backend untuk News endpoints.
 * 
 * @module services/news.service
 */

import api from '../utils/api.js';
import { handleApiError } from '../utils/errorHandler.js';

/**
 * Get published news list
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of news objects
 */
export const getPublishedNews = async (params = {}) => {
  try {
    const response = await api.get('/api/news/public/list', { params });
    return response.data?.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get news by slug (public)
 * 
 * @param {string} slug - News slug
 * @returns {Promise<Object>} News object
 */
export const getNewsBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/news/public/detail/${slug}`);
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get popular news
 * 
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Array of popular news objects
 */
export const getPopularNews = async (limit = 5) => {
  try {
    const response = await api.get('/api/news/popular', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Search news by keyword
 * 
 * @param {string} keyword - Search keyword
 * @param {Object} params - Additional parameters
 * @returns {Promise<Array>} Array of news objects
 */
export const searchNews = async (keyword, params = {}) => {
  try {
    const response = await api.get('/api/news/search', {
      params: { keyword, ...params }
    });
    return response.data?.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Increment news views
 * 
 * @param {number} id - News ID
 * @returns {Promise<void>}
 */
export const incrementViews = async (id) => {
  try {
    await api.patch(`/api/news/${id}/views`);
  } catch (error) {
    // Don't throw error for view increment failures
    console.error('Failed to increment views:', error);
  }
};

// Error handling sudah di-handle oleh centralized errorHandler
// Import dari utils/errorHandler.js

