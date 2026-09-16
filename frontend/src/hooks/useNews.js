/**
 * useNews Hook
 * 
 * Custom React hook untuk manage news state dan operations.
 * Menggunakan news service untuk API calls.
 * 
 * @module hooks/useNews
 */

import { useState, useEffect, useCallback } from 'react';
import { getAllNews, createNews, updateNews, deleteNews } from '../services/news.service.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for news management
 * 
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} News state and operations
 */
export const useNews = (initialParams = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  /**
   * Fetch articles with filters
   * 
   * @param {Object} params - Query parameters
   */
  const fetchArticles = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAllNews({
        ...initialParams,
        ...params
      });
      
      setArticles(result.articles || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: Math.ceil((result.total || 0) / (result.limit || 10))
      });
    } catch (err) {
      // Error sudah di-format oleh error handler
      const errorMessage = err.message || 'Gagal memuat artikel';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  /**
   * Create new news article
   * 
   * @param {FormData} formData - News data
   * @returns {Promise<Object>} Created news object
   */
  const create = useCallback(async (formData) => {
    try {
      const news = await createNews(formData);
      toast.success('Artikel berhasil dibuat');
      return news;
    } catch (err) {
      const errorMessage = err.message || 'Gagal membuat artikel';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Update news article
   * 
   * @param {number} id - News ID
   * @param {FormData} formData - Update data
   * @returns {Promise<Object>} Updated news object
   */
  const update = useCallback(async (id, formData) => {
    try {
      const news = await updateNews(id, formData);
      toast.success('Artikel berhasil diperbarui');
      return news;
    } catch (err) {
      const errorMessage = err.message || 'Gagal memperbarui artikel';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Delete news article
   * 
   * @param {number} id - News ID
   */
  const remove = useCallback(async (id) => {
    try {
      await deleteNews(id);
      toast.success('Artikel berhasil dihapus');
      // Refresh list
      await fetchArticles();
    } catch (err) {
      const errorMessage = err.message || 'Gagal menghapus artikel';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchArticles]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    pagination,
    fetchArticles,
    createNews: create,
    updateNews: update,
    deleteNews: remove,
    setArticles
  };
};

