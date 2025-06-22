import { NavLink, Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Header = () => {
  const navItems = ['Home', 'Nasional', 'Internasional', 'Ekonomi', 'Olahraga', 'Teknologi', 'Otomotif', 'Hiburan', 'Gaya Hidup'];

  return (
    <>
      {/* Baris atas: Logo dan Search */}
      <div className="bg-[#1C1C94] text-white px-4 py-2 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg tracking-wide">
          <span className="text-pink-400">Winni</span>Code
        </Link>
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Masukkan Pencarian"
            className="rounded-full px-3 py-1 text-sm text-gray-900 w-60"
          />
          <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-xs" />
        </div>
      </div>

      {/* Baris kedua: Navigation */}
      <nav className="bg-black text-white text-sm font-semibold">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center space-x-6">
            {navItems.map((item) => (
            <NavLink
                key={item}
                to={item === 'Home' ? '/' : `/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={({ isActive }) =>
                `hover:text-red-400 transition ${isActive ? 'text-red-400' : ''}`
                }
            >
                {item}
            </NavLink>
            ))}
        </div>
        </nav>

    </>
  );
};

export default Header;
