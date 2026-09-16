/**
 * useNews Hook
 * 
 * Custom React hook untuk manage news state dan operations (Public).
 * Menggunakan news service untuk API calls.
 * 
 * @module hooks/useNews
 */

import { useState, useCallback } from 'react';
import {
  getPublishedNews,
  getNewsBySlug,
  getPopularNews,
  searchNews,
  incrementViews
} from '../services/news.service.js';

/**
 * Custom hook for fetching published news
 * 
 * @param {Object} params - Query parameters
 * @returns {Object} News state and operations
 */
export const usePublishedNews = (params = {}) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getPublishedNews({ ...params, ...newParams });
      setNews(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat berita';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [params]);

  return {
    news,
    loading,
    error,
    fetchNews,
    setNews
  };
};

/**
 * Custom hook for fetching single news by slug
 * 
 * @returns {Object} News state and operations
 */
export const useNewsDetail = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNewsBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getNewsBySlug(slug);
      setNews(data);
      
      // Increment views
      if (data.id) {
        incrementViews(data.id);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat detail berita';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    news,
    loading,
    error,
    fetchNewsBySlug
  };
};

/**
 * Custom hook for fetching popular news
 * 
 * @param {number} limit - Number of results
 * @returns {Object} News state and operations
 */
export const usePopularNews = (limit = 5) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPopularNews = useCallback(async (newLimit = limit) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getPopularNews(newLimit);
      setNews(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat berita populer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [limit]);

  return {
    news,
    loading,
    error,
    fetchPopularNews,
    setNews
  };
};

/**
 * Custom hook for searching news
 * 
 * @returns {Object} Search state and operations
 */
export const useSearchNews = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (keyword, params = {}) => {
    if (!keyword || keyword.trim().length < 2) {
      setError('Masukkan kata kunci minimal 2 huruf');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await searchNews(keyword.trim(), params);
      setResults(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Gagal mencari berita';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    search,
    setResults
  };
};

