// Konfigurasi axios dengan baseURL
import axios from 'axios';
import { handleApiError, isUnauthorizedError } from './errorHandler.js';

// Gunakan VITE_API_URL jika ada, jika tidak gunakan path relatif (untuk development)
const baseURL = import.meta.env.VITE_API_URL || '';

// Buat instance axios dengan baseURL
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - clear token (jika ada)
    if (isUnauthorizedError(error)) {
      // Pastikan localStorage tersedia (hanya di browser)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('token');
      }
    }
    
    // Format error dengan centralized handler
    // Error akan di-format dengan user-friendly message
    const formattedError = handleApiError(error, 'Terjadi kesalahan. Silakan coba lagi.', {
      url: error.config?.url,
      method: error.config?.method,
    });
    
    return Promise.reject(formattedError);
  }
);

export default api;

