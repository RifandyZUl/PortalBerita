import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(emailOrUsername, password);
      navigate('/admin/dashboard');
    } catch {
      // Error sudah di-handle di hook dengan toast
    }
  };

  return (
    <div
      className="w-full min-h-screen flex justify-center items-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url('/image/Image.png')` }}
    >
      <div className="bg-white rounded shadow-md w-full max-w-xl px-10 py-10">
        <h2 className="text-2xl font-semibold text-center mb-8">Sign In</h2>

        {authError && (
          <div className="mb-4 text-red-600 text-sm text-center">{authError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium mb-1">
              Email / Username
            </label>
            <input
              id="emailOrUsername"
              type="text"
              className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-full hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
