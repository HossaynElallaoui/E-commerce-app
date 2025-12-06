/**
 * Database Configuration Module
 * 
 * This module handles:
 * - SQLite database connection setup
 * - Table creation
 * - Initial data seeding (admin user and sample products)
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '../database.sqlite');

class SQLiteWrapper {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('Could not connect to database', err);
      else console.log('Connected to SQLite database');
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      // Simple query normalization
      const queryType = sql.trim().split(' ')[0].toUpperCase();

      if (queryType === 'SELECT' || queryType === 'PRAGMA') {
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            console.error('Query Error:', err.message, sql);
            reject(err);
          } else {
            resolve([rows, []]); // Mimic MySQL [rows, fields] return signature
          }
        });
      } else {
        this.db.run(sql, params, function (err) {
          if (err) {
            console.error('Query Error:', err.message, sql);
            reject(err);
          } else {
            // Mimic MySQL result header
            resolve([{
              insertId: this.lastID,
              affectedRows: this.changes,
              warningStatus: 0
            }, []]);
          }
        });
      }
    });
  }

  // Mimic pool.getConnection()
  async getConnection() {
    return this;
  }

  // Transaction methods
  beginTransaction() {
    return new Promise((resolve, reject) => {
      this.db.run('BEGIN TRANSACTION', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  commit() {
    return new Promise((resolve, reject) => {
      this.db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  rollback() {
    return new Promise((resolve, reject) => {
      this.db.run('ROLLBACK', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Mimic connection.release()
  release() { }

  // Mimic pool.end()
  end() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// Singleton instance
let dbInstance = null;

const createConnection = async () => {
  if (!dbInstance) {
    dbInstance = new SQLiteWrapper();
  }
  return dbInstance;
};

const getConnection = () => {
  if (!dbInstance) {
    dbInstance = new SQLiteWrapper();
  }
  return dbInstance;
};

const getTransactionConnection = async () => {
  return getConnection();
};

const initializeTables = async () => {
  const db = getConnection();

  try {
    // Enable foreign keys
    await db.query('PRAGMA foreign_keys = ON');

    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        stock INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cart table
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        session_id TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_amount DECIMAL(10, 2) NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        user_id INTEGER,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Order items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized (SQLite)');
  } catch (error) {
    console.error('❌ Error initializing tables:', error);
    throw error;
  }
};

const seedAdminUser = async () => {
  const db = getConnection();
  try {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    if (rows[0].count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        ['admin', 'admin@example.com', hashedPassword, 'admin']
      );
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
};

const seedSampleProducts = async () => {
  const db = getConnection();
  try {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM products");
    if (rows[0].count === 0) {
      const sampleProducts = [
        ['Authentic Beni Ourain Rug', 'Hand-knotted wool rug featuring traditional geometric Berber patterns. Soft, plush, and timeless.', 450.00, 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=800', 5],
        ['Hand-Painted Ceramic Tagine', 'Traditional clay cooking vessel for slow-cooked stews. Hand-painted with intricate Fes blue patterns.', 65.00, 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800', 15],
        ['Pure Organic Argan Oil', '100% pure cold-pressed Argan oil (100ml). The "Liquid Gold" of Morocco for hair and skin care.', 35.00, 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800', 50],
        ['Leather Babouche Slippers', 'Classic yellow pointed leather slippers. Handmade in the souks of Marrakech using soft, cured leather.', 40.00, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800', 25],
        ['Silver Mint Tea Service', 'Elegant silver-plated teapot with 6 artisanal glass cups and a serving tray. Perfect for the traditional tea ceremony.', 150.00, 'https://images.unsplash.com/photo-1565459075727-4cb442d8479e?auto=format&fit=crop&q=80&w=800', 10],
        ['Moroccan Leather Pouf', 'Hand-stitched leather ottoman in warm tan. Adds a bohemian touch to any living space.', 120.00, 'https://images.unsplash.com/photo-1589820296156-2454bb8a6d54?auto=format&fit=crop&q=80&w=800', 20],
        ['Brass Geometric Lantern', 'Intricately carved brass lantern that casts mesmerizing shadow patterns when lit.', 85.00, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800', 12],
        ['Thuya Wood Jewelry Box', 'Handcrafted from aromatic Thuya wood with lemon wood inlays. A masterpiece of Essaouira craftsmanship.', 55.00, 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=800', 30]
      ];

      for (const product of sampleProducts) {
        await db.query(
          "INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)",
          product
        );
      }
      console.log('✅ Traditional products seeded');
    }
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

const initializeDatabase = async () => {
  await createConnection();
  await initializeTables();
  await seedAdminUser();
  await seedSampleProducts();
};

const closeConnection = async () => {
  if (dbInstance) {
    await dbInstance.end();
  }
};

module.exports = {
  getConnection,
  getTransactionConnection,
  initializeDatabase,
  closeConnection
};
