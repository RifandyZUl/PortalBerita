// Konfigurasi axios dengan baseURL
import axios from 'axios';

// Gunakan VITE_API_URL jika ada, jika tidak cek apakah di production
// Di production (Vercel), gunakan Railway URL, di development gunakan localhost
const getBaseURL = () => {
  // Jika VITE_API_URL sudah di-set, gunakan itu
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Jika di production (Vercel), gunakan Railway URL
  if (import.meta.env.MODE === 'production' || (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'))) {
    return 'https://portalberitaa.up.railway.app';
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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Don't redirect automatically, let the component handle it
    }
    
    return Promise.reject(error);
  }
);

export default api;

