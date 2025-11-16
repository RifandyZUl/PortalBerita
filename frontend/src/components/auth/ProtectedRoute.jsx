import { Navigate } from 'react-router-dom';
import { getToken } from '../../utils/token';

const ProtectedRoute = ({ children }) => {
  const token = getToken();

  // Check if token exists and is not empty string
  if (!token || token.trim() === '') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
