import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Route Component
// This ensures only authenticated users (or admins) can access certain routes
function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin is required but user is not admin, redirect to home
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and admin if required), show the protected content
  return children;
}

export default ProtectedRoute;

