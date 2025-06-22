import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Newspaper, MessageSquare, Settings } from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Manage News', path: '/admin/manage-news', icon: <Newspaper size={18} /> },
    { name: 'Manage Categories', path: '/admin/manage-categories', icon: <Newspaper size={18} /> },
    { name: 'Manage Comments', path: '/admin/manage-comments', icon: <MessageSquare size={18} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> }
  ];

  return (
    <aside>
      {/* Tombol close muncul hanya di mobile */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button onClick={onClose}>
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-8 hidden lg:block">Admin Panel</h2>

      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg hover:bg-blue-700 transition ${
                isActive ? 'bg-blue-700' : ''
              }`
            }
          >
            <span className="mr-3">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
