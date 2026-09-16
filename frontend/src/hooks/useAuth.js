/**
 * useAuth Hook
 * 
 * Custom React hook untuk manage authentication state dan operations.
 * Menggunakan auth service untuk API calls.
 * 
 * @module hooks/useAuth
 */

import { useState, useCallback } from 'react';
import { loginAdmin } from '../services/auth.service.js';
import { setToken, getToken, removeToken } from '../utils/token.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for authentication
 * 
 * @returns {Object} Auth state and operations
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  /**
   * Login function
   * 
   * @param {string} emailOrUsername - Email or username
   * @param {string} password - Password
   * @returns {Promise<Object>} Login result
   */
  const login = useCallback(async (emailOrUsername, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginAdmin(emailOrUsername, password);
      
      if (result.token) {
        setToken(result.token);
        setIsAuthenticated(true);
        toast.success('Login berhasil');
        return result;
      } else {
        throw new Error('Token tidak ditemukan dalam response');
      }
    } catch (err) {
      // Error sudah di-format oleh error handler dengan user-friendly message
      const errorMessage = err.message || 'Login gagal';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    removeToken();
    setIsAuthenticated(false);
    toast.success('Logout berhasil');
  }, []);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    return !!token;
  }, []);

  return {
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
};

