// frontend/api/admin.js
import { getBaseURL } from '../utils/getBaseURL';

export const getAdminDashboard = async () => {
  const baseURL = getBaseURL();
  const token = localStorage.getItem('token');

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
