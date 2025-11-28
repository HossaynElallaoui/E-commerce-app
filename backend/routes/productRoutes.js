/**
 * Product Routes Module
 * 
 * Handles all public product-related endpoints:
 * - Get all products
 * - Get single product by ID
 */

const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/database');

/**
 * GET /api/products
 * Get all products
 * 
 * Returns: Array of all products
 */
router.get('/', async (req, res) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    
    // Update image URLs to use local images if they're placeholders
    const updatedRows = rows.map(product => {
      if (product.image_url && product.image_url.includes('placeholder')) {
        // Map product names to local images
        const imageMap = {
          'Laptop': '/images/laptop.jpeg',
          'Smartphone': '/images/smartphone.jpeg',
          'Headphones': '/images/headphones.jpeg',
          'Keyboard': '/images/keyboerd.png',
          'Mouse': '/images/mouse.jpg'
        };
        
        if (imageMap[product.name]) {
          product.image_url = imageMap[product.name];
        }
      }
      return product;
    });
    
    res.json(updatedRows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/products/:id
 * Get single product by ID
 * 
 * Params: id - Product ID
 * Returns: Single product object
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = getConnection();
    
    const [rows] = await connection.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = rows[0];
    
    // Update image URL if it's a placeholder
    if (product.image_url && product.image_url.includes('placeholder')) {
      const imageMap = {
        'Laptop': '/images/laptop.jpeg',
        'Smartphone': '/images/smartphone.jpeg',
        'Headphones': '/images/headphones.jpeg',
        'Keyboard': '/images/keyboerd.png',
        'Mouse': '/images/mouse.jpg'
      };
      
      if (imageMap[product.name]) {
        product.image_url = imageMap[product.name];
      }
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export router
module.exports = router;
