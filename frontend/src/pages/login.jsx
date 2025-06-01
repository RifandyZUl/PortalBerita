// Import hook useState dari React untuk menangani state lokal
import { useState } from 'react';

// Import komponen input field kustom
import InputField from '../components/InputField';

// Import fungsi login dari API untuk autentikasi admin
import { loginAdmin } from '../api/auth';

const Login = () => {
  // State untuk menyimpan input email dan password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State untuk menampilkan pesan error saat login gagal
  const [error, setError] = useState('');

  // Fungsi yang dijalankan saat form login disubmit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman default dari form
    setError(''); // Reset error jika sebelumnya ada

    try {
      // Memanggil fungsi login dan mendapatkan data token
      const data = await loginAdmin(email, password);

      // Menyimpan token di localStorage untuk kebutuhan autentikasi selanjutnya
      localStorage.setItem('token', data.token);

      // Redirect ke halaman dashboard admin setelah berhasil login
      window.location.href = '/admin/dashboard';
    } catch (err) {
      // Menangkap dan menampilkan error jika login gagal
      console.error('Login error:', err);

      // Menampilkan pesan error ke user
      setError(err.message || 'Terjadi kesalahan saat login.');
    }
  };

  return (
    // Container utama form login
    <div className="bg-white p-10 rounded-xl shadow-lg w-[800px] h-[520px] flex flex-col justify-start">
      {/* Judul halaman login */}
      <h2 className="text-3xl font-semibold mb-6 text-center">Sign In</h2>

      {/* Menampilkan pesan error jika ada */}
      {error && (
        <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
      )}

      {/* Form login */}
      <form onSubmit={handleSubmit} className="space-y-4 w-full px-10">
        {/* Input untuk email */}
        <InputField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Input untuk password */}
        <InputField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Tombol submit */}
        <button
          type="submit"
          className="w-full h-12 bg-[#2563EB] text-white text-2xl font-semibold rounded-lg hover:bg-blue-700 transition mt-6"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
