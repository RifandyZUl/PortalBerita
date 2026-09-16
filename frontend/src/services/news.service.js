/**
 * News Service
 * 
 * Service layer untuk News API calls.
 * Menangani semua komunikasi dengan backend untuk News endpoints.
 * 
 * @module services/news.service
 */

import api from '../utils/api.js';

/**
 * Get all news with filters and pagination
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News list with pagination
 */
export const getAllNews = async (params = {}) => {
  try {
    const response = await api.get('/api/news', { params });
    return response.data?.data || {};
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get news by ID
 * 
 * @param {number} id - News ID
 * @returns {Promise<Object>} News object
 */
export const getNewsById = async (id) => {
  try {
    const response = await api.get(`/api/news/${id}`);
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create news
 * 
 * @param {FormData} formData - News data (FormData for file upload)
 * @returns {Promise<Object>} Created news object
 */
export const createNews = async (formData) => {
  try {
    const response = await api.post('/api/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update news
 * 
 * @param {number} id - News ID
 * @param {FormData} formData - Update data (FormData for file upload)
 * @returns {Promise<Object>} Updated news object
 */
export const updateNews = async (id, formData) => {
  try {
    const response = await api.put(`/api/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete news
 * 
 * @param {number} id - News ID
 * @returns {Promise<void>}
 */
export const deleteNews = async (id) => {
  try {
    await api.delete(`/api/news/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Search news by keyword (public)
 * 
 * @param {string} keyword - Search keyword
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Array>} Array of news objects
 */
export const searchNews = async (keyword, params = {}) => {
  try {
    const response = await api.get('/api/news/search', {
      params: {
        keyword,
        ...params
      }
    });
    return response.data?.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get published news (public)
 * 
 * @param {Object} params - Query parameters (keyword, category, limit, page)
 * @returns {Promise<Array>} Array of published news
 */
export const getPublishedNews = async (params = {}) => {
  try {
    const response = await api.get('/api/news/public/list', { params });
    return response.data?.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

// Import centralized error handler
import { handleApiError } from '../utils/errorHandler.js';

