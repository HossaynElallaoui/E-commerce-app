/**
 * Image Mapper Utility
 * Maps product names to local image files
 * 
 * Add your images to: public/images/
 * Then map them here by product name
 */

// Map product names to image filenames
const productImageMap = {};

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

