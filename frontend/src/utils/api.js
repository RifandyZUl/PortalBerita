// Konfigurasi axios dengan baseURL
import axios from 'axios';
import { handleApiError, isUnauthorizedError } from './errorHandler.js';

// Gunakan VITE_API_URL jika ada, jika tidak cek apakah di production
// Di production (Vercel), gunakan Railway URL, di development gunakan localhost
const getBaseURL = () => {
  // Jika VITE_API_URL sudah di-set, gunakan itu
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Production Vercel Backend URL
  if (import.meta.env.MODE === 'production' || (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'))) {
    return 'https://portal-berita-backend-pi.vercel.app';
  }
  
  // Default untuk development
  return 'http://localhost:5000';
};

const baseURL = getBaseURL();

// Buat instance axios dengan baseURL
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    // Pastikan localStorage tersedia (hanya di browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - clear token
    if (isUnauthorizedError(error)) {
      // Pastikan localStorage tersedia (hanya di browser)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('token');
        // Optional: Redirect to login (uncomment jika diperlukan)
        // if (window.location.pathname !== '/admin/login') {
        //   window.location.href = '/admin/login';
        // }
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

