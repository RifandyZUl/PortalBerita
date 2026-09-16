/**
 * useComment Hook
 * 
 * Custom React hook untuk manage comment state dan operations.
 * Menggunakan comment service untuk API calls.
 * 
 * @module hooks/useComment
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getAllComments,
  updateCommentStatus,
  deleteComment
} from '../services/comment.service.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for comment management
 * 
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} Comment state and operations
 */
export const useComment = (initialParams = {}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  });

  /**
   * Fetch comments with filters
   * 
   * @param {Object} params - Query parameters
   */
  const fetchComments = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAllComments({
        ...initialParams,
        ...params
      });
      
      setComments(result.comments || []);
      setPagination(result.pagination || {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0
      });
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat komentar';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  /**
   * Update comment status
   * 
   * @param {number} id - Comment ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated comment object
   */
  const updateStatus = useCallback(async (id, status) => {
    try {
      const comment = await updateCommentStatus(id, status);
      toast.success('Status komentar berhasil diperbarui');
      await fetchComments(); // Refresh list
      return comment;
    } catch (err) {
      const errorMessage = err.message || 'Gagal memperbarui status komentar';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchComments]);

  /**
   * Delete comment
   * 
   * @param {number} id - Comment ID
   */
  const remove = useCallback(async (id) => {
    try {
      await deleteComment(id);
      toast.success('Komentar berhasil dihapus');
      await fetchComments(); // Refresh list
    } catch (err) {
      const errorMessage = err.message || 'Gagal menghapus komentar';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchComments]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    pagination,
    fetchComments,
    updateCommentStatus: updateStatus,
    deleteComment: remove,
    setComments
  };
};

