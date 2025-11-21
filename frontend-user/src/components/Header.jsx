import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo/image2.png';

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Nasional", path: "/category/nasional" },
  { label: "International", path: "/category/international" },
  { label: "Ekonomi", path: "/category/ekonomi" },
  { label: "Olahraga", path: "/category/olahraga" },
  { label: "Teknologi", path: "/category/teknologi" },
  { label: "Otomotif", path: "/category/otomotif" },
  { label: "Hiburan", path: "/category/hiburan" },
  { label: "Kesehatan", path: "/category/kesehatan" }
];

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setSearchOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 w-full z-30 sticky top-0 shadow-sm">
      {/* Top Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>E-paper</span>
              <span>Subscribe</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span>SPH Rewards</span>
              <span>STClassifieds</span>
              <span>Advertise with us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => navigate('/')} className="block">
              <img
                src={logo}
                alt="Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </button>
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:block flex-1 max-w-lg mx-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </form>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              <FaSearch size={18} />
            </button>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="pb-4 lg:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </form>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-3 border-t border-gray-200">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setMenuOpen(false);
              }}
              className={`text-sm font-medium py-2 px-1 border-b-2 transition-colors ${
                isActive(link.path)
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-700 border-transparent hover:text-blue-600 hover:border-gray-300'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMenuOpen(false);
                  }}
                  className={`text-left py-2 px-4 text-sm font-medium rounded transition-colors ${
                    isActive(link.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
