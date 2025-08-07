import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo/image2.png';

const navLinks = [
  "Home", "Nasional", "International", "Ekonomi",
  "Olahraga", "Teknologi", "Otomotif", "Hiburan", "Kesehatan"
];

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setSearchOpen(false);
    }
  };

  const getPath = (link) => {
    return link === 'Home' ? '/' : `/category/${link.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <header className="bg-black text-white w-full z-30 shadow-md">
      {/* Top Section */}
      <div className="flex items-center justify-between px-4 py-4 max-w-[1500px] mx-auto">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="w-[170px] h-auto object-contain"
        />

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:block w-[400px] max-w-full"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Cari tokoh, topik atau peristiwa"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full rounded-xl bg-[#555] text-gray-200 px-4 py-2 pl-4 pr-10 placeholder-gray-300 focus:outline-none border border-[#888]"
            />
            <button type="submit">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg" />
            </button>
          </div>
        </form>

        {/* Mobile Icons */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setSearchOpen(!searchOpen)}>
            <FaSearch size={18} />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Cari tokoh, topik atau peristiwa"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full rounded-xl bg-[#555] text-gray-200 px-4 py-2 pl-4 pr-10 placeholder-gray-300 focus:outline-none border border-[#888]"
            />
            <button type="submit">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg" />
            </button>
          </form>
        </div>
      )}

      {/* Divider */}
      <div className="border-b border-[#434343]" />

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-center gap-6 px-4 py-2 text-sm font-semibold">
        {navLinks.map((link) => (
          <button
            key={link}
            onClick={() => navigate(getPath(link))}
            className="text-white hover:text-[#CC66DA] transition-colors"
          >
            {link}
          </button>
        ))}
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden px-6 py-3 bg-[#111] flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => {
                navigate(getPath(link));
                setMenuOpen(false);
              }}
              className="text-white py-2 border-b border-gray-700 text-left hover:text-[#27fc0b] transition"
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
