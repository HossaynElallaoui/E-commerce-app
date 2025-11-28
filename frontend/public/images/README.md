# Product Images

This folder contains product images for the ecommerce website.

## Current Images

- `laptop.jpeg` - Laptop product image
- `smartphone.jpeg` - Smartphone product image
- `headphones.jpeg` - Headphones product image
- `keyboerd.png` - Keyboard product image (note: filename has typo)
- `mouse.jpg` - Mouse product image

## Adding New Images

1. Add your image file to this folder (`public/images/`)
2. Update `src/utils/imageMapper.js` to map product names to your new images
3. The image will automatically be used for products with matching names

## Image Requirements

- **Recommended format:** JPEG, PNG, or WebP
- **Recommended size:** 300x300px or larger (square aspect ratio works best)
- **File size:** Keep under 500KB for fast loading

## Usage

Images are automatically mapped to products based on product name in `imageMapper.js`.

Example:
```javascript
'Product Name': '/images/your-image.jpg'
```

Images are served from the `public` folder, so use paths starting with `/images/`.

