/**
 * Auth Service
 * 
 * Service layer untuk Authentication API calls.
 * Menangani semua komunikasi dengan backend untuk Auth endpoints.
 * 
 * @module services/auth.service
 */

import api from '../utils/api.js';
import { handleApiError } from '../utils/errorHandler.js';

/**
 * Login admin
 * 
 * @param {string} emailOrUsername - Email or username
 * @param {string} password - Password
 * @returns {Promise<Object>} { token }
 * @throws {Error} Jika login gagal
 */
export const loginAdmin = async (emailOrUsername, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      emailOrUsername,
      password,
    });
    return response.data?.data || response.data;
  } catch (error) {
    // Error sudah di-format oleh axios interceptor
    // Tapi kita bisa customize message untuk auth
    throw handleApiError(error, 'Login gagal. Periksa email/username dan password Anda.', {
      service: 'auth',
      operation: 'login',
    });
  }
};

