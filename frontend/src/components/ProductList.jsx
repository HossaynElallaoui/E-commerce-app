
import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { getProductImage } from '../utils/imageMapper'
import { useLanguage } from '../context/LanguageContext'
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState({})
  const { t } = useLanguage()

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
    return <div className="loading">{t('products.loading')}</div>
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-message" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>⚠️ {t('common.error')}</h2>
          <p style={{ marginTop: '1rem' }}>
            {error}
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
            {t('common.retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {t('hero.title')} <br />
            <span className="highlight">{t('hero.highlight')}</span>
          </h1>
          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>
          <button className="hero-cta-btn" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
            {t('hero.cta')} →
          </button>
        </div>
        <div className="hero-image-container">
          <img src="/images/smartphone.jpeg" alt="Featured Artisan Product" className="hero-image" />
        </div>
      </section>

      <h2 className="page-title" id="products">{t('products.title')}</h2>
      {products.length === 0 && !loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{t('products.empty')}</p>
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
                  console.error(`Failed to load image for ${product.name}: `, e.target.src);
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
                    {addingToCart[product.id]
                      ? t('products.adding')
                      : parseInt(product.stock) === 0
                        ? t('products.outOfStock')
                        : t('products.addToCart')}
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

