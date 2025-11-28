/**
 * Order Routes Module
 * 
 * Handles all order-related endpoints:
 * - Create new order
 * - Get all orders
 * - Get single order with items
 */

const express = require('express');
const router = express.Router();
const { getConnection, getTransactionConnection } = require('../config/database');

/**
 * POST /api/orders
 * Create a new order from cart items
 * 
 * Body: { customerName, customerEmail, customerAddress, sessionId }
 * Returns: Order info with ID and total amount
 */
router.post('/', async (req, res) => {
  let transactionConnection = null;
  
  try {
    const { customerName, customerEmail, customerAddress, sessionId } = req.body;
    const session = sessionId || 'default';
    const connection = getConnection();

    // Get all items from cart
    const [cartItems] = await connection.query(
      `SELECT c.*, p.price, p.name 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.session_id = ?`,
      [session]
    );

    // Check if cart is empty
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Get a dedicated connection for transaction
    transactionConnection = await getTransactionConnection();

    // Start transaction
    await transactionConnection.beginTransaction();

    try {
      // Create order record
      const [orderResult] = await transactionConnection.query(
        "INSERT INTO orders (total_amount, customer_name, customer_email, customer_address, status) VALUES (?, ?, ?, ?, ?)",
        [totalAmount, customerName, customerEmail, customerAddress, 'pending']
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of cartItems) {
        await transactionConnection.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.product_id, item.quantity, item.price]
        );
      }

      // Clear cart after order is created
      await transactionConnection.query(
        "DELETE FROM cart WHERE session_id = ?",
        [session]
      );

      // Commit transaction
      await transactionConnection.commit();

      // Return success response
      res.json({ 
        id: orderId, 
        totalAmount, 
        message: 'Order created successfully' 
      });
    } catch (error) {
      // Rollback transaction on error
      await transactionConnection.rollback();
      throw error;
    } finally {
      // Release connection back to pool
      if (transactionConnection) {
        transactionConnection.release();
      }
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message || 'Error creating order' });
  }
});

/**
 * GET /api/orders
 * Get all orders
 * 
 * Returns: Array of all orders
 */
router.get('/', async (req, res) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/:id
 * Get single order with all items
 * 
 * Params: id - Order ID
 * Returns: Order object with items array
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = getConnection();

    // Get order details
    const [orders] = await connection.query(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Get order items with product details
    const [items] = await connection.query(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    // Return order with items
    res.json({ ...order, items });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export router
module.exports = router;
