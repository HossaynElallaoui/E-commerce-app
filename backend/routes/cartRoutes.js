/**
 * Cart Routes Module
 * 
 * Handles all cart-related endpoints:
 * - Get cart items
 * - Add item to cart
 * - Update cart item quantity
 * - Remove item from cart
 * - Clear entire cart
 */

const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/database');

/**
 * GET /api/cart
 * Get all items in cart for a session
 * 
 * Query: sessionId - Session identifier (optional, defaults to 'default')
 * Returns: Array of cart items with product details
 */
router.get('/', async (req, res) => {
  try {
    const sessionId = req.query.sessionId || 'default';
    const connection = getConnection();
    
    const [rows] = await connection.query(
      `SELECT c.*, p.name, p.price, p.image_url, p.stock 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.session_id = ?`,
      [sessionId]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/cart
 * Add item to cart or update quantity if already exists
 * 
 * Body: { productId, quantity, sessionId }
 * Returns: Cart item info
 */
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, sessionId } = req.body;
    const session = sessionId || 'default';
    const connection = getConnection();

    // Check if item already exists in cart
    const [existingItems] = await connection.query(
      "SELECT * FROM cart WHERE product_id = ? AND session_id = ?",
      [productId, session]
    );

    if (existingItems.length > 0) {
      // Item exists, update quantity
      const newQuantity = existingItems[0].quantity + (quantity || 1);
      await connection.query(
        "UPDATE cart SET quantity = ? WHERE id = ?",
        [newQuantity, existingItems[0].id]
      );
      
      res.json({ 
        id: existingItems[0].id, 
        productId, 
        quantity: newQuantity 
      });
    } else {
      // Item doesn't exist, insert new item
      const [result] = await connection.query(
        "INSERT INTO cart (product_id, quantity, session_id) VALUES (?, ?, ?)",
        [productId, quantity || 1, session]
      );
      
      res.json({ 
        id: result.insertId, 
        productId, 
        quantity: quantity || 1 
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/cart/:id
 * Update cart item quantity
 * 
 * Params: id - Cart item ID
 * Body: { quantity }
 * Returns: Updated cart item info
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const connection = getConnection();

    const [result] = await connection.query(
      "UPDATE cart SET quantity = ? WHERE id = ?",
      [quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ id, quantity });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/cart/:id
 * Remove specific item from cart
 * 
 * Params: id - Cart item ID
 * Returns: Success message
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = getConnection();

    const [result] = await connection.query(
      "DELETE FROM cart WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/cart
 * Clear entire cart for a session
 * 
 * Query: sessionId - Session identifier (optional, defaults to 'default')
 * Returns: Success message
 */
router.delete('/', async (req, res) => {
  try {
    const sessionId = req.query.sessionId || 'default';
    const connection = getConnection();

    await connection.query(
      "DELETE FROM cart WHERE session_id = ?",
      [sessionId]
    );

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export router
module.exports = router;
