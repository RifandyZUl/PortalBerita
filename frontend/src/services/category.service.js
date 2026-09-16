/**
 * Category Service
 * 
 * Service layer untuk Category API calls.
 * Menangani semua komunikasi dengan backend untuk Category endpoints.
 * 
 * @module services/category.service
 */

import api from '../utils/api.js';
import { handleApiError } from '../utils/errorHandler.js';

/**
 * Get all categories with pagination
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Categories with pagination
 */
export const getAllCategories = async (params = {}) => {
  try {
    const response = await api.get('/api/categories', { params });
    return response.data?.data || {};
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get category by ID
 * 
 * @param {number} id - Category ID
 * @returns {Promise<Object>} Category object
 */
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/api/categories/${id}`);
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create category
 * 
 * @param {Object} data - Category data
 * @returns {Promise<Object>} Created category object
 */
export const createCategory = async (data) => {
  try {
    const response = await api.post('/api/categories', data);
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update category
 * 
 * @param {number} id - Category ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated category object
 */
export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`/api/categories/${id}`, data);
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete category
 * 
 * @param {number} id - Category ID
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  try {
    await api.delete(`/api/categories/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

