// Konfigurasi axios dengan baseURL
import axios from 'axios';

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
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

