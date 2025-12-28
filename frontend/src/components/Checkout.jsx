import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ShieldCheck, CreditCard, Truck, MapPin, ChevronRight, Loader2, Sparkles, Lock, Globe, ShieldQuestion } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import './Checkout.css'

function Checkout() {
  const [step, setStep] = useState(1)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })
  const navigate = useNavigate()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.getCart()
        if (response.data.length === 0) navigate('/')
        setCartItems(response.data)
      } catch (error) {
        navigate('/')
      }
    }
    fetchCart()
  }, [navigate])

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment gateway processing
    setTimeout(async () => {
      setLoading(true)
      try {
        await api.createOrder({
          customerName: formData.name,
          customerEmail: formData.email,
          customerAddress: formData.address,
          city: formData.city,
          items: cartItems,
          total: totalPrice
        })
        navigate('/order-success')
      } catch (error) {
        console.error('Order failed:', error)
      } finally {
        setLoading(false)
        setIsProcessing(false)
      }
    }, 2500)
  }

  return (
    <div className="checkout-page max-width-container">
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gateway-overlay"
          >
            <div className="gateway-modal glass-panel">
              <Lock size={40} className="lock-icon gold-text" />
              <h2 className="serif">Secure Treasury Gateway</h2>
              <div className="processing-bar-wrapper">
                <motion.div
                  className="processing-bar"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
              </div>
              <p>Communicating with the secure vault...</p>
              <div className="gateway-badges">
                <span className="badge"><ShieldCheck size={14} /> TLS 1.3</span>
                <span className="badge"><Globe size={14} /> Global Node</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="checkout-stepper">
        <div className={`step-node ${step >= 1 ? 'active' : ''}`}>
          <span className="serif">01</span>
          <p>Acquisition Details</p>
        </div>
        <div className="step-line"></div>
        <div className={`step-node ${step >= 2 ? 'active' : ''}`}>
          <span className="serif">02</span>
          <p>Secure Payment</p>
        </div>
      </div>

      <div className="checkout-grid">
        <motion.form
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="checkout-form glass-panel"
          onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handlePlaceOrder}
        >
          <h2 className="serif form-section-title">
            {step === 1 ? <><MapPin size={24} /> Delivery Logistics</> : <><CreditCard size={24} /> Financial Settlement</>}
          </h2>

          <div className="premium-inputs-grid">
            {step === 1 ? (
              <>
                <div className="input-group-premium">
                  <label className="serif">Collector Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Legal Name"
                  />
                </div>
                <div className="input-group-premium">
                  <label className="serif">Digital Terminal (Email)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="input-group-premium full-width">
                  <label className="serif">Delivery Destination (Address)</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street, Studio, or Estate"
                  />
                </div>
                <div className="input-group-premium">
                  <label className="serif">Metropolis (City)</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City Name"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="payment-options-luxury">
                  <div className="payment-tab active">
                    <div className="card-logos-wrapper">
                      <span className="visa-logo">VISA</span>
                      <div className="mastercard-logo">
                        <span className="circle red"></span>
                        <span className="circle yellow"></span>
                      </div>
                    </div>
                    <span>Approved Selection</span>
                  </div>
                  <div className="payment-tab disabled">
                    <ShieldQuestion size={18} />
                    <span>Other Vaults</span>
                  </div>
                </div>

                <div className="input-group-premium full-width">
                  <label className="serif">Card Identification</label>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    placeholder="XXXX XXXX XXXX XXXX"
                  />
                  <p className="card-subtext italic">Any card and details will be automatically approved for testing.</p>
                </div>
                <div className="input-group-premium">
                  <label className="serif">Expiration</label>
                  <input
                    type="text"
                    required
                    maxLength="5"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="input-group-premium">
                  <label className="serif">Security Code (CVV)</label>
                  <input
                    type="password"
                    required
                    maxLength="4"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    placeholder="000"
                  />
                </div>
              </>
            )}
          </div>

          <div className="checkout-actions">
            {step === 2 && (
              <button type="button" className="btn-back" onClick={() => setStep(1)}>Modify Details</button>
            )}
            <button type="submit" className="btn-premium" disabled={loading || isProcessing}>
              {loading || isProcessing ? <Loader2 size={18} className="animate-spin" /> : (
                step === 1 ? <>Proceed to Payment <ChevronRight size={18} /></> : <>Finalize Order <Sparkles size={18} /></>
              )}
            </button>
          </div>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="order-summary-sidebar glass-panel"
        >
          <h3 className="serif sidebar-title">Treasures to be Dispatched</h3>
          <div className="mini-products-list">
            {cartItems.map(item => (
              <div key={item.product_id} className="mini-item">
                <span>{item.name} <span className="qty">x{item.quantity}</span></span>
                <span className="serif">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="final-total">
            <span className="serif">Total Value</span>
            <span className="serif gold-text">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="security-footer">
            <ShieldCheck size={14} color="#d4af37" />
            <span>End-to-End Encryption Enabled</span>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}

export default Checkout
