import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShoppingCart, ArrowRight, Loader2, AlertCircle, Sparkles, ShieldCheck, Heart } from 'lucide-react'
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
      setProducts(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }))
    try {
      await api.addToCart(product.id, 1)
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }))
    }
  }

  if (loading) return (
    <div className="loading-overlay">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="loader-content"
      >
        <Sparkles size={48} color="#d4af37" />
        <p className="serif">{t('products.loading')}</p>
      </motion.div>
    </div>
  )

  return (
    <div className="artisan-container">
      {/* Luxury Hero Section */}
      <section className="luxury-hero">
        <div className="hero-grid">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="hero-text-block"
          >
            <span className="hero-tagline">{t('hero.certified')}</span>
            <h1 className="hero-title serif">
              {t('hero.title')} <br />
              <span className="gold-text italic">{t('hero.highlight')}</span>
            </h1>
            <p className="hero-description">
              {t('hero.subtitle')}
            </p>
            <div className="hero-actions">
              <button className="btn-premium" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                {t('hero.cta')}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="hero-visual"
          >
            <div className="luxury-frame">
              <img src="/images/hero-artisan.jpg" alt="Artisan Craft" className="hero-big-img" />
              <div className="frame-border"></div>
            </div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="floating-card"
            >
              <ShieldCheck color="#d4af37" size={20} />
              <span>{t('hero.certified')}</span>
            </motion.div>
          </motion.div>
        </div>
        <div className="hero-overlay-gradient"></div>
      </section>

      {/* Narrative Story Section */}
      <section className="narrative-section max-width-container">
        <div className="narrative-grid">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="narrative-content"
          >
            <h2 className="serif">{t('narrative.title')}</h2>
            <p>{t('narrative.desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Product Catalog */}
      <section id="catalog" className="catalog-section max-width-container">
        <div className="catalog-header">
          <h2 className="serif gold-text">{t('products.title')}</h2>
          <div className="catalog-line"></div>
        </div>

        <div className="products-grid">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="luxury-card"
            >
              <div className="card-image-wrapper">
                <img src={getProductImage(product.name, product.image_url)} alt={product.name} />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="wishlist-btn"
                >
                  <Heart size={18} />
                </motion.button>
              </div>

              <div className="card-content">
                <h3 className="serif">{product.name}</h3>
                <p className="card-desc">{product.description}</p>
                <div className="card-footer">
                  <span className="price">${parseFloat(product.price).toFixed(2)}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={addingToCart[product.id] || parseInt(product.stock) === 0}
                    onClick={() => handleAddToCart(product)}
                    className="add-btn"
                  >
                    {addingToCart[product.id] ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (parseInt(product.stock) === 0 ? t('products.outOfStock') : (
                      <>
                        <span>{t('products.addToCart')}</span>
                        <ShoppingCart size={14} />
                      </>
                    ))}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductList
