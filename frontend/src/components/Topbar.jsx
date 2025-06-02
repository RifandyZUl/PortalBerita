import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { removeToken } from '../../src/utils/token'; // ← gunakan helper

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken(); // ← konsisten dengan helper
    navigate('/');
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">News Portal Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium text-gray-800">Admin User</p>
          <p className="text-sm text-gray-500">admin@example.com</p>
        </div>
        <img
          src="/image/profile.jpg"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
