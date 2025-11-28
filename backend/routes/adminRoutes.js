/**
 * Admin Routes Module
 * 
 * Handles all admin-only endpoints:
 * - Product management (create, update, delete)
 * - Order management (view all, update status)
 * 
 * All routes require authentication and admin role
 */

const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Apply authentication and admin check to all routes in this module
router.use(authenticateToken);
router.use(isAdmin);

/**
 * POST /api/admin/products
 * Create a new product (Admin only)
 * 
 * Body: { name, description, price, image_url, stock }
 * Returns: Created product object
 */
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, image_url, stock } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const connection = getConnection();

    // Insert new product
    const [result] = await connection.query(
      "INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)",
      [name, description || '', price, image_url || '', stock || 0]
    );

    // Get the created product to return
    const [products] = await connection.query(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(products[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
});

/**
 * PUT /api/admin/products/:id
 * Update an existing product (Admin only)
 * 
 * Params: id - Product ID
 * Body: { name, description, price, image_url, stock } (all optional)
 * Returns: Updated product object
 */
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, stock } = req.body;
    const connection = getConnection();

    // Check if product exists
    const [existingProducts] = await connection.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = existingProducts[0];

    // Update product (only update provided fields)
    await connection.query(
      "UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock = ? WHERE id = ?",
      [
        name !== undefined ? name : product.name,
        description !== undefined ? description : product.description,
        price !== undefined ? price : product.price,
        image_url !== undefined ? image_url : product.image_url,
        stock !== undefined ? stock : product.stock,
        id
      ]
    );

    // Get updated product to return
    const [updatedProducts] = await connection.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    res.json(updatedProducts[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
});

/**
 * DELETE /api/admin/products/:id
 * Delete a product (Admin only)
 * 
 * Params: id - Product ID
 * Returns: Success message
 */
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = getConnection();

    // Check if product exists
    const [existingProducts] = await connection.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete product
    await connection.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

/**
 * GET /api/admin/orders
 * Get all orders (Admin only)
 * 
 * Returns: Array of all orders
 */
router.get('/orders', async (req, res) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * PUT /api/admin/orders/:id/status
 * Update order status (Admin only)
 * 
 * Params: id - Order ID
 * Body: { status }
 * Returns: Success message
 */
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const connection = getConnection();

    // Update order status
    const [result] = await connection.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

// Export router
module.exports = router;
