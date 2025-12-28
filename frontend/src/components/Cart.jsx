import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { getProductImage } from '../utils/imageMapper'
import { useLanguage } from '../context/LanguageContext'
import './Cart.css'

function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await api.getCart()
      setCartItems(response.data || [])
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, delta) => {
    const item = cartItems.find(i => i.product_id === productId)
    if (!item) return
    const newQuantity = item.quantity + delta
    if (newQuantity < 1) return

    try {
      await api.updateCartItem(productId, newQuantity)
      fetchCart()
    } catch (error) {
      console.error('Failed to update cart:', error)
    }
  }

  const removeItem = async (itemId) => {
    try {
      await api.removeFromCart(itemId)
      fetchCart()
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)

  if (loading) return (
    <div className="cart-empty-state">
      <Loader2 className="animate-spin" size={48} color="#d4af37" />
    </div>
  )

  if (cartItems.length === 0) return (
    <div className="cart-empty-state">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel empty-card"
      >
        <ShoppingBag size={64} color="#d4af37" style={{ marginBottom: '24px', opacity: 0.5 }} />
        <h2 className="serif">Your treasure chest is empty</h2>
        <p>Return to our collection to find your next masterpiece.</p>
        <Link to="/" className="btn-premium" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '32px' }}>
          Explore Collection
        </Link>
      </motion.div>
    </div>
  )

  return (
    <div className="cart-page max-width-container">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="cart-main"
      >
        <div className="cart-header-luxury">
          <h1 className="serif">{t('cart.title')}</h1>
          <span className="cart-count-badge serif">{cartItems.length} {cartItems.length === 1 ? 'Object' : 'Objects'}</span>
        </div>

        <div className="cart-items-list">
          <AnimatePresence mode='popLayout'>
            {cartItems.map((item) => (
              <motion.div
                key={item.product_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="cart-item-luxury glass-panel"
              >
                <div className="item-image-shell">
                  <img src={getProductImage(item.name)} alt={item.name} />
                </div>

                <div className="item-details">
                  <h3 className="serif">{item.name}</h3>
                  <p className="item-category">Handcrafted Artifact</p>
                  <div className="item-controls">
                    <div className="qty-picker-premium">
                      <button onClick={() => updateQuantity(item.product_id, -1)}><Minus size={14} /></button>
                      <span className="serif">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, 1)}><Plus size={14} /></button>
                    </div>
                    <button className="remove-btn-luxury" onClick={() => removeItem(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="item-price-block">
                  <span className="serif price-tag">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="cart-summary-luxury glass-panel"
      >
        <h2 className="serif summary-title">Investment Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span className="serif">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipment (Global)</span>
          <span className="gold-text serif">Complimentary</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row total">
          <span className="serif">Total Investment</span>
          <span className="serif total-price">${totalPrice.toFixed(2)}</span>
        </div>

        <button
          className="btn-premium w-full checkout-btn"
          onClick={() => navigate('/checkout')}
        >
          Secure Checkout <ArrowRight size={18} />
        </button>
        <p className="secure-note">
          <ShieldCheck size={14} /> Artisanal Insurance Included
        </p>
      </motion.aside>
    </div>
  )
}

export default Cart
