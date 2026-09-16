/**
 * Comment Service
 * 
 * Service layer untuk Comment API calls.
 * Menangani semua komunikasi dengan backend untuk Comment endpoints.
 * 
 * @module services/comment.service
 */

import api from '../utils/api.js';
import { handleApiError } from '../utils/errorHandler.js';

/**
 * Get all comments with filters and pagination
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Comments with pagination
 */
export const getAllComments = async (params = {}) => {
  try {
    const response = await api.get('/api/comments', { params });
    return response.data?.data || {};
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get comment by ID
 * 
 * @param {number} id - Comment ID
 * @returns {Promise<Object>} Comment object
 */
export const getCommentById = async (id) => {
  try {
    const response = await api.get(`/api/comments/${id}`);
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create comment
 * 
 * @param {number} newsId - News ID
 * @param {Object} data - Comment data
 * @returns {Promise<Object>} Created comment object
 */
export const createComment = async (newsId, data) => {
  try {
    const response = await api.post(`/api/comments/${newsId}`, data);
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update comment status
 * 
 * @param {number} id - Comment ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated comment object
 */
export const updateCommentStatus = async (id, status) => {
  try {
    const response = await api.patch(`/api/comments/${id}/status`, { status });
    return response.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete comment
 * 
 * @param {number} id - Comment ID
 * @returns {Promise<void>}
 */
export const deleteComment = async (id) => {
  try {
    await api.delete(`/api/comments/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

