import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import './Checkout.css'

function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: ''
  })

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await api.getCart()
      setCartItems(response.data)
      if (response.data.length === 0) {
        navigate('/cart')
      }
      setError(null)
    } catch (err) {
      setError('Failed to load cart. Please try again later.')
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.customerName || !formData.customerEmail || !formData.customerAddress) {
      setError('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      await api.createOrder(formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (err) {
      setError('Failed to place order. Please try again.')
      console.error('Error creating order:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
  }

  if (loading) {
    return <div className="loading">Loading checkout...</div>
  }

  if (success) {
    return (
      <div className="checkout-container">
        <div className="success-message">
          <h2>Order Placed Successfully! 🎉</h2>
          <p>Thank you for your purchase. You will be redirected to the home page shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-header">Checkout</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} className="order-summary-item">
            <span>{item.name} x {item.quantity}</span>
            <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="order-total">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerName" className="form-label">
            Full Name *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            className="form-input"
            value={formData.customerName}
            onChange={handleInputChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail" className="form-label">
            Email *
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            className="form-input"
            value={formData.customerEmail}
            onChange={handleInputChange}
            required
            placeholder="john@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerAddress" className="form-label">
            Shipping Address *
          </label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            className="form-textarea"
            value={formData.customerAddress}
            onChange={handleInputChange}
            required
            placeholder="123 Main St, City, State, ZIP Code"
          />
        </div>

        <button 
          type="submit" 
          className="submit-order-btn"
          disabled={submitting}
        >
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}

export default Checkout

