/**
 * Error Handling Middleware Module
 * 
 * This module provides error handling middleware for:
 * - 301 Redirects (moved resources)
 * - 404 Not Found (route not found)
 * - 500 Internal Server Error (server errors)
 */

/**
 * 301 Redirect Handler
 * Handles permanent redirects for moved resources
 * 
 * Example: Redirect old API paths to new ones
 */
const handleRedirects = (req, res, next) => {
  // Example: Redirect old singular endpoint to plural
  if (req.path === '/api/product' && req.method === 'GET') {
    return res.redirect(301, '/api/products');
  }
  
  // Add more redirects here as needed
  // if (req.path === '/old-path' && req.method === 'GET') {
  //   return res.redirect(301, '/new-path');
  // }
  
  // Continue to next middleware if no redirect needed
  next();
};

/**
 * 404 Not Found Handler
 * Handles requests to routes that don't exist
 * 
 * This should be placed AFTER all route definitions
 */
const handle404 = (req, res) => {
  res.status(404).json({
    error: '404 - Not Found',
    message: `The route ${req.method} ${req.path} does not exist.`,
    availableRoutes: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/me'
      ],
      products: [
        'GET /api/products',
        'GET /api/products/:id'
      ],
      cart: [
        'GET /api/cart',
        'POST /api/cart',
        'PUT /api/cart/:id',
        'DELETE /api/cart/:id',
        'DELETE /api/cart'
      ],
      orders: [
        'POST /api/orders',
        'GET /api/orders',
        'GET /api/orders/:id'
      ],
      admin: [
        'POST /api/admin/products',
        'PUT /api/admin/products/:id',
        'DELETE /api/admin/products/:id',
        'GET /api/admin/orders',
        'PUT /api/admin/orders/:id/status'
      ]
    }
  });
};

/**
 * 500 Internal Server Error Handler
 * Catches and handles all server errors
 * 
 * This should be the LAST error handler middleware
 * Note: Must have 4 parameters (err, req, res, next) for Express to recognize it as error handler
 */
const handle500 = (err, req, res, next) => {
  // Log error for debugging
  console.error('Server Error:', err);

  // Send error response
  res.status(500).json({
    error: '500 - Internal Server Error',
    message: 'Something went wrong on the server. Please try again later.',
    // Only show error details in development mode
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
};

// Export error handlers
module.exports = {
  handleRedirects,
  handle404,
  handle500
};

