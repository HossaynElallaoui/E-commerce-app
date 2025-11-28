/**
 * Main Server Entry Point
 * 
 * This is the main application file that:
 * - Sets up Express server
 * - Configures middleware
 * - Connects routes
 * - Handles errors
 * - Starts the server
 * 
 * All major functionality is separated into modules:
 * - Database: config/database.js
 * - Routes: routes/*.js
 * - Middleware: middleware/*.js
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database configuration
const { initializeDatabase, closeConnection } = require('./config/database');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import error handlers
const { handleRedirects, handle404, handle500 } = require('./middleware/errorHandlers');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// CORS - Allow cross-origin requests
app.use(cors());

// Body Parser - Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 301 Redirects (must be before 404 handler)
app.use(handleRedirects);

// 404 Not Found (must be after all routes)
app.use(handle404);

// 500 Internal Server Error (must be last)
app.use(handle500);

// ============================================
// SERVER INITIALIZATION
// ============================================

/**
 * Start the server
 * Initializes database and then starts listening
 */
const startServer = async () => {
  try {
    // Initialize database (create tables, seed data)
    await initializeDatabase();

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Default Admin Credentials:`);
      console.log(`Username: admin`);
      console.log(`Password: admin123`);
      console.log(`Change admin password in production!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

// Handle graceful shutdown (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await closeConnection();
    process.exit(0);
  } catch (error) {
    console.error('Error closing database:', error);
    process.exit(1);
  }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
