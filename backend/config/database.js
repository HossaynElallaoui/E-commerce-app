/**
 * Database Configuration Module
 * 
 * This module handles:
 * - MySQL database connection setup
 * - Table creation
 * - Initial data seeding (admin user and sample products)
 * 
 * Uses path module for configuration file paths
 */

const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configuration from environment variables
// Using path module to reference config if needed
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool (better for handling multiple requests)
let pool = null;

/**
 * Create database connection pool
 * Pool allows multiple simultaneous connections efficiently
 */
const createConnection = async () => {
  try {
    // First, connect without database to create it if it doesn't exist
    const connectionWithoutDb = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Create database if it doesn't exist
    await connectionWithoutDb.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connectionWithoutDb.end();

    // Now create pool with database
    pool = mysql.createPool({
      ...dbConfig,
      multipleStatements: true // Allow multiple SQL statements
    });

    console.log('✅ Database connection pool created');
    return pool;
  } catch (error) {
    console.error('❌ Error creating database connection:', error);
    throw error;
  }
};

/**
 * Get database connection from pool
 * Use this for executing queries
 * Returns the connection pool which can be used for queries
 */
const getConnection = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call createConnection() first.');
  }
  return pool;
};

/**
 * Get a single connection from pool for transactions
 * Use this when you need to perform transactions
 * Remember to release the connection when done!
 */
const getTransactionConnection = async () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call createConnection() first.');
  }
  return await pool.getConnection();
};

/**
 * Initialize database tables
 * Creates all necessary tables if they don't exist
 */
const initializeTables = async () => {
  const connection = getConnection();

  try {
    // Users table - Stores admin and customer accounts
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cart table (created after products and users tables)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        quantity INT DEFAULT 1,
        session_id VARCHAR(255),
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_session (session_id),
        INDEX idx_product (product_id)
      )
    `);

    // Orders table (created after users table)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        total_amount DECIMAL(10, 2) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        customer_address TEXT NOT NULL,
        user_id INT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user (user_id),
        INDEX idx_status (status)
      )
    `);

    // Order items table (created after orders and products tables)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_order (order_id),
        INDEX idx_product (product_id)
      )
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Error initializing tables:', error);
    throw error;
  }
};

/**
 * Seed default admin user
 * Creates admin account if no admin exists
 */
const seedAdminUser = async () => {
  const connection = getConnection();

  try {
    // Check if admin exists
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );

    if (rows[0].count === 0) {
      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Insert admin user
      await connection.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        ['admin', 'admin@example.com', hashedPassword, 'admin']
      );

      console.log('Default admin account created:');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('⚠️  IMPORTANT: Change this password in production!');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  }
};

/**
 * Seed sample products
 * Inserts sample products if database is empty
 */
const seedSampleProducts = async () => {
  const connection = getConnection();

  try {
    // Check if products exist
    const [rows] = await connection.query("SELECT COUNT(*) as count FROM products");

    if (rows[0].count === 0) {
      const sampleProducts = [
        ['Laptop', 'High-performance laptop for work and gaming', 999.99, '/images/laptop.jpeg', 10],
        ['Smartphone', 'Latest smartphone with advanced features', 699.99, '/images/smartphone.jpeg', 15],
        ['Headphones', 'Wireless noise-cancelling headphones', 199.99, '/images/headphones.jpeg', 20],
        ['Keyboard', 'Mechanical gaming keyboard', 129.99, '/images/keyboerd.png', 25],
        ['Mouse', 'Ergonomic wireless mouse', 49.99, '/images/mouse.jpg', 30]
      ];

      // Insert all sample products
      for (const product of sampleProducts) {
        await connection.query(
          "INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)",
          product
        );
      }

      console.log('✅ Sample products inserted');
    }
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

/**
 * Initialize database
 * Sets up connection, tables, and seeds initial data
 */
const initializeDatabase = async () => {
  try {
    // Create connection pool
    await createConnection();
    
    // Initialize tables
    await initializeTables();
    
    // Seed data
    await seedAdminUser();
    await seedSampleProducts();
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

/**
 * Close database connection pool
 * Call this when shutting down the application
 */
const closeConnection = async () => {
  if (pool) {
    await pool.end();
    console.log('✅ Database connection closed');
  }
};

// Export database functions and connection getters
module.exports = {
  getConnection,
  getTransactionConnection,
  initializeDatabase,
  closeConnection,
  // Export config path using path module (for reference)
  configPath: path.join(__dirname, '..', '.env')
};
