/**
 * Image Mapper Utility
 * Maps product names to local image files
 * 
 * Add your images to: public/images/
 * Then map them here by product name
 */

// Map product names to image filenames
const productImageMap = {
  'Authentic Beni Ourain Rug': '/images/rug-berber.jpg',
  'Hand-Painted Ceramic Tagine': '/images/tagine-ceramic.jpg',
  'Pure Organic Argan Oil': '/images/argan-oil.jpg',
  'Leather Babouche Slippers': '/images/babouche-leather.jpg',
  'Silver Mint Tea Service': '/images/tea-service.jpg',
  'Moroccan Leather Pouf': 'https://images.unsplash.com/photo-1589820296156-2454bb8a6d54?auto=format&fit=crop&q=80&w=800',
  'Brass Geometric Lantern': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
  'Thuya Wood Jewelry Box': 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=800',
  'Laptop': '/images/laptop.jpeg',
  'Smartphone': '/images/smartphone.jpeg',
  'Headphones': '/images/headphones.jpeg',
  'Keyboard': '/images/keyboerd.png',
  'Mouse': '/images/mouse.jpg'
};

/**
 * Get image path for a product
 * @param {string} productName - Name of the product
 * @param {string} imageUrl - Optional image URL from database
 * @returns {string} Image path
 */
export const getProductImage = (productName, imageUrl = null) => {
  // If database has an image URL, use it (for admin-uploaded images)
  if (imageUrl && imageUrl.trim() !== '' && imageUrl !== 'https://via.placeholder.com/300') {
    // If it's already a local path, return as is
    if (imageUrl.startsWith('/images/')) {
      return imageUrl;
    }
    // If it's a full URL (http/https), use it
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      // Only use external URLs if they're not placeholders
      if (!imageUrl.includes('placeholder')) {
        return imageUrl;
      }
    }
  }

  // Use the mapped local image based on product name (case-insensitive)
  const normalizedName = productName ? productName.trim() : '';
  const mappedImage = productImageMap[normalizedName] ||
    productImageMap[normalizedName.toLowerCase()] ||
    productImageMap[normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1).toLowerCase()];

  if (mappedImage) {
    return mappedImage;
  }

  // Fallback to placeholder if no match found
  console.warn(`No image mapped for product: ${productName}`);
  return 'https://via.placeholder.com/300';
};

/**
 * Get all available product images
 * Useful for admin to see what images are available
 */
export const getAvailableImages = () => {
  return Object.values(productImageMap);
};

