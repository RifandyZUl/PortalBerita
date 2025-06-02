import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/admin/login.jsx';
import Dashboard from './pages/admin/dashboard.jsx';
import ManageNews from './pages/admin/ManageNews.jsx';
import ManageComments from './pages/admin/manageComments.jsx';
import Settings from './pages/admin/settings.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login */}
        <Route
          path="/"
          element={
            <div
              className="min-h-screen bg-cover bg-center flex justify-center items-center px-4"
              style={{ backgroundImage: `url('/image/Image.png')` }}
            >
              <Login />
            </div>
          }
        />

        {/* Admin Routes Protected + Layout */}
       <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="manage-news" element={<ManageNews />} />
  <Route path="manage-comments" element={<ManageComments />} />
  <Route path="settings" element={<Settings />} />
</Route>

      </Routes>
    </Router>
  );
}

export default App;
