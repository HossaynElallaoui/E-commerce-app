import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        // Token is invalid or backend is not available, remove it
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    // Always set loading to false, even if backend is not available
    setLoading(false);
  };

  // Login function
  const login = async (username, password) => {
    try {
      const response = await api.login({ username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await api.register({ username, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed. Please try again.'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

