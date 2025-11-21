// frontend/api/admin.js
import { getBaseURL } from '../utils/getBaseURL';

export const getAdminDashboard = async () => {
  const baseURL = getBaseURL();
  // Pastikan localStorage tersedia (hanya di browser)
  const token = typeof window !== 'undefined' && window.localStorage 
    ? localStorage.getItem('token') 
    : null;

  const res = await fetch(`${baseURL}/api/admin/dashboard`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Gagal mengambil data dashboard');
  
  return res.json();
};
