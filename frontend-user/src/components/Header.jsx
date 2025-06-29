// src/components/Header.jsx
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const navItems = [
  'Home', 'Nasional', 'Internasional', 'Ekonomi',
  'Olahraga', 'Teknologi', 'Otomotif', 'Hiburan', 'Gaya Hidup'
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-[#483AA0] text-white shadow-md">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-3 md:py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          <span className="text-pink-400">Winni</span><span className="text-white">Code</span>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:block relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Cari berita..."
            className="w-60 px-4 py-1.5 rounded-full text-sm text-gray-800 focus:outline-none"
          />
          <button type="submit">
            <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-xs" />
          </button>
        </form>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-lg"
          >
            <FaSearch />
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-xl"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <form onSubmit={handleSearchSubmit} className="md:hidden px-4 pb-3">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Cari berita..."
            className="w-full px-4 py-2 rounded-full text-sm text-gray-800 focus:outline-none"
          />
        </form>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center gap-6 text-sm font-medium py-2 bg-[#0E2148]">
        {navItems.map((item) => (
          <NavLink
            key={item}
            to={item === 'Home' ? '/' : `/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
            className={({ isActive }) =>
              `transition hover:text-pink-400 ${isActive ? 'text-pink-400' : ''}`
            }
          >
            {item}
          </NavLink>
        ))}
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col px-4 pb-4 space-y-2 bg-blue-700 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item}
              to={item === 'Home' ? '/' : `/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                `block transition hover:text-pink-400 ${isActive ? 'text-pink-400' : ''}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
