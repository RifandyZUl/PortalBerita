// src/api/auth.js
import axios from 'axios';

// Gunakan VITE_API_URL jika ada, jika tidak cek apakah di production
// Di production (Vercel), gunakan Railway URL, di development gunakan localhost
const getBaseURL = () => {
  // Jika VITE_API_URL sudah di-set, gunakan itu
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Jika di production (Vercel), gunakan Railway URL
  if (import.meta.env.MODE === 'production' || window.location.hostname.includes('vercel.app')) {
    return 'https://portalberitaa.up.railway.app';
  }
  
  // Default untuk development
  return 'http://localhost:5000';
};

const baseURL = getBaseURL();

// Debug: Log API URL yang digunakan
console.log('🔗 API Base URL:', baseURL);
console.log('🔗 VITE_API_URL env:', import.meta.env.VITE_API_URL);
console.log('🔗 MODE:', import.meta.env.MODE);
console.log('🔗 Hostname:', window.location.hostname);

export const loginAdmin = async (emailOrUsername, password) => {
  try {
    const loginURL = `${baseURL}/api/auth/login`;
    console.log('🔗 Login URL:', loginURL);
    
    const response = await axios.post(loginURL, {
      emailOrUsername,
      password,
    });
    return response.data;
  } catch (err) {
    console.error('❌ LOGIN ERROR:', err);
    console.error('❌ Request URL:', err.config?.url);

    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }

    // Jika tidak ada pesan dari server
    throw new Error('Login gagal. Silakan coba lagi.');
  }
};
