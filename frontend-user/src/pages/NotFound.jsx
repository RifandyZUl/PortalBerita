import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Halaman tidak ditemukan</p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
