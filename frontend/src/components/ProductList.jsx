import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { getProductImage } from '../utils/imageMapper'
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.getProducts()
      // Log products for debugging
      console.log('Products loaded:', response.data)
      setProducts(response.data)
      setError(null)
    } catch (err) {
      const errorMessage = err.response?.status === 404 || err.code === 'ECONNREFUSED'
        ? 'Backend server is not running. Please start the backend server on port 5000.'
        : 'Failed to load products. Please try again later.'
      setError(errorMessage)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart({ ...addingToCart, [productId]: true })
      await api.addToCart(productId, 1)
      // Show success feedback (you could add a toast notification here)
    } catch (err) {
      alert('Failed to add item to cart. Please try again.')
      console.error('Error adding to cart:', err)
    } finally {
      setAddingToCart({ ...addingToCart, [productId]: false })
    }
  }

  if (loading) {
    return <div className="loading">Loading products...</div>
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-message" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>⚠️ {error}</h2>
          <p style={{ marginTop: '1rem' }}>
            Make sure the backend server is running on <strong>http://localhost:5000</strong>
          </p>
          <button 
            onClick={fetchProducts} 
            style={{ 
              marginTop: '1rem', 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <h1 className="page-title">Our Products</h1>
      {products.length === 0 && !loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No products available. Please add products from the admin dashboard.</p>
        </div>
      ) : (
        <div className="products-container">
          {products.map(product => (
          <div key={product.id} className="product-card">
            <img 
              src={getProductImage(product.name, product.image_url)} 
              alt={product.name}
              className="product-image"
              onError={(e) => {
                // Fallback if image fails to load
                console.error(`Failed to load image for ${product.name}:`, e.target.src);
                e.target.src = 'https://via.placeholder.com/300';
              }}
              onLoad={() => {
                console.log(`Image loaded successfully for ${product.name}`);
              }}
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingToCart[product.id] || parseInt(product.stock) === 0}
                >
                  {addingToCart[product.id] ? 'Adding...' : parseInt(product.stock) === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}

export default ProductList

