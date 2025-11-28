/**
 * Authentication Middleware Module
 * 
 * This module provides middleware functions for:
 * - Token authentication (JWT)
 * - Admin authorization
 */

const jwt = require('jsonwebtoken');

// JWT secret key (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authentication Middleware
 * Verifies JWT token and adds user info to request
 * 
 * Usage: app.get('/protected-route', authenticateToken, handler)
 */
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  // Format: "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request object for use in route handlers
    req.user = decoded;
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Admin Authorization Middleware
 * Checks if authenticated user has admin role
 * 
 * Usage: app.get('/admin-route', authenticateToken, isAdmin, handler)
 * Note: Must be used AFTER authenticateToken middleware
 */
const isAdmin = (req, res, next) => {
  // Check if user exists and has admin role
  if (req.user && req.user.role === 'admin') {
    // User is admin, allow access
    next();
  } else {
    // User is not admin, deny access
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

// Export middleware functions
module.exports = {
  authenticateToken,
  isAdmin,
  JWT_SECRET
};

