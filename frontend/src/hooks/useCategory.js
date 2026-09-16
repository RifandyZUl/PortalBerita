/**
 * useCategory Hook
 * 
 * Custom React hook untuk manage category state dan operations.
 * Menggunakan category service untuk API calls.
 * 
 * @module hooks/useCategory
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/category.service.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for category management
 * 
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} Category state and operations
 */
export const useCategory = (initialParams = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  });

  /**
   * Fetch categories with filters
   * 
   * @param {Object} params - Query parameters
   */
  const fetchCategories = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAllCategories({
        ...initialParams,
        ...params
      });
      
      setCategories(result.data || []);
      setPagination(result.pagination || {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0
      });
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat kategori';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  /**
   * Create new category
   * 
   * @param {Object} data - Category data
   * @returns {Promise<Object>} Created category object
   */
  const create = useCallback(async (data) => {
    try {
      const category = await createCategory(data);
      toast.success('Kategori berhasil dibuat');
      await fetchCategories(); // Refresh list
      return category;
    } catch (err) {
      const errorMessage = err.message || 'Gagal membuat kategori';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchCategories]);

  /**
   * Update category
   * 
   * @param {number} id - Category ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated category object
   */
  const update = useCallback(async (id, data) => {
    try {
      const category = await updateCategory(id, data);
      toast.success('Kategori berhasil diperbarui');
      await fetchCategories(); // Refresh list
      return category;
    } catch (err) {
      const errorMessage = err.message || 'Gagal memperbarui kategori';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchCategories]);

  /**
   * Delete category
   * 
   * @param {number} id - Category ID
   */
  const remove = useCallback(async (id) => {
    try {
      await deleteCategory(id);
      toast.success('Kategori berhasil dihapus');
      await fetchCategories(); // Refresh list
    } catch (err) {
      const errorMessage = err.message || 'Gagal menghapus kategori';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchCategories]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    pagination,
    fetchCategories,
    createCategory: create,
    updateCategory: update,
    deleteCategory: remove,
    setCategories
  };
};

