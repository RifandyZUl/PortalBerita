import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { removeToken, getToken } from '../utils/token';
import api from '../utils/api';

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get('/api/admin/profile');
        if (res.data?.admin) {
          setAdmin(res.data.admin);
        } else {
          console.error('Gagal ambil admin:', res.data?.message);
        }
      } catch (err) {
        console.error('Gagal mengambil data admin:', err);
      }
    };

    fetchAdmin();
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      {/* Kiri */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-800">News Portal Admin</h1>
      </div>

      {/* Kanan */}
      <div className="flex items-center gap-4">
        {admin && (
          <>
            <div className="text-right hidden sm:block">
              <p className="font-medium text-gray-800">{admin.firstName || 'Admin'} {admin.lastName || ''}</p>
              <p className="text-sm text-gray-500">{admin.email}</p>
            </div>
            <img
              src={admin.photo}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border"
            />
          </>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
