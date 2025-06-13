// src/api/auth.js
import axios from 'axios';

export const loginAdmin = async (emailOrUsername, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      emailOrUsername,
      password,
    });
    return response.data;
  } catch (err) {
    console.error('❌ LOGIN ERROR:', err); // 👈 tambahkan log ini

    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }

    // Jika tidak ada pesan dari server
    throw new Error('Login gagal. Silakan coba lagi.');
  }
};
