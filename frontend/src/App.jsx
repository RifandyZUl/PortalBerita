// Import komponen halaman Login
import Login from './pages/login.jsx'; // Pastikan path sesuai dengan struktur foldermu

/**
 * Komponen utama aplikasi React (entry point).
 * Menampilkan halaman login dengan latar belakang bergambar.
 */
function App() {
  return (
    // Container penuh layar dengan background gambar
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center px-4"
      style={{ backgroundImage: `url('/image/Image.png')` }} // Gambar background (harus diletakkan di folder public/image)
    >
      {/* Menampilkan komponen login di tengah layar */}
      <Login />
    </div>
  );
}

export default App;
