/**
 * useCategory Hook
 * 
 * Custom React hook untuk manage category state dan operations (Public).
 * Menggunakan category service untuk API calls.
 * 
 * @module hooks/useCategory
 */

import { useState, useEffect, useCallback } from 'react';
import { getAllCategories } from '../services/category.service.js';

/**
 * Custom hook for fetching categories
 * 
 * @param {Object} params - Query parameters
 * @returns {Object} Category state and operations
 */
export const useCategory = (params = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllCategories({ ...params, ...newParams });
      setCategories(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat kategori';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    setCategories
  };
};

