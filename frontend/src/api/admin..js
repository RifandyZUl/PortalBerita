// frontend/api/admin.js
export const getAdminDashboard = async () => {
  const token = localStorage.getItem('token');

  const res = await fetch('http://localhost:5000/api/admin/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Gagal mengambil data dashboard');
  
  return res.json();
};
