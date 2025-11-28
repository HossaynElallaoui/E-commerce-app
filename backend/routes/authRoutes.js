/**
 * Authentication Routes Module
 * 
 * Handles all authentication-related endpoints:
 * - User registration
 * - User login
 * - Get current user info
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');
const { authenticateToken, JWT_SECRET } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/register
 * Register a new customer account
 * 
 * Body: { username, email, password }
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password' });
    }

    const connection = getConnection();

    // Check if user already exists
    const [existingUsers] = await connection.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const [result] = await connection.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, 'customer']
    );

    // Generate JWT token for the new user
    const token = jwt.sign(
      { id: result.insertId, username, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response with token and user info
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.insertId, username, email, role: 'customer' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * POST /api/auth/login
 * Login user (admin or customer)
 * 
 * Body: { username, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password' });
    }

    const connection = getConnection();

    // Find user by username
    const [users] = await connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response with token and user info
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user info
 * 
 * Requires: Authentication token in Authorization header
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    
    // Get user info from database
    const [users] = await connection.query(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Export router
module.exports = router;

