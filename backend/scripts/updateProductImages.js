/**
 * Script to update product images in database
 * Run this once to update existing products with local image paths
 * 
 * Usage: node scripts/updateProductImages.js
 */

const { getConnection, initializeDatabase } = require('../config/database');

const imageMap = {
  'Laptop': '/images/laptop.jpeg',
  'Smartphone': '/images/smartphone.jpeg',
  'Headphones': '/images/headphones.jpeg',
  'Keyboard': '/images/keyboerd.png',
  'Mouse': '/images/mouse.jpg'
};

const updateProductImages = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    const connection = getConnection();

    console.log('🔄 Updating product images...\n');

    // Get all products
    const [products] = await connection.query('SELECT id, name, image_url FROM products');

    for (const product of products) {
      const newImageUrl = imageMap[product.name];
      
      if (newImageUrl) {
        // Update product image
        await connection.query(
          'UPDATE products SET image_url = ? WHERE id = ?',
          [newImageUrl, product.id]
        );
        console.log(`✅ Updated ${product.name}: ${product.image_url} → ${newImageUrl}`);
      } else {
        console.log(`⚠️  No image mapping found for: ${product.name}`);
      }
    }

    console.log('\n✅ All product images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating product images:', error);
    process.exit(1);
  }
};

// Run the update
updateProductImages();

