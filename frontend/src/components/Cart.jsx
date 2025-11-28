import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { getProductImage } from '../utils/imageMapper'
import './Cart.css'

function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await api.getCart()
      setCartItems(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load cart. Please try again later.')
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(id)
      return
    }

    try {
      await api.updateCartItem(id, newQuantity)
      fetchCart()
    } catch (err) {
      alert('Failed to update quantity. Please try again.')
      console.error('Error updating cart:', err)
    }
  }

  const handleRemoveItem = async (id) => {
    try {
      await api.removeFromCart(id)
      fetchCart()
    } catch (err) {
      alert('Failed to remove item. Please try again.')
      console.error('Error removing from cart:', err)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1 className="cart-header">Shopping Cart</h1>
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <img 
            src={getProductImage(item.name, item.image_url)} 
            alt={item.name}
            className="cart-item-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300';
            }}
          />
          <div className="cart-item-details">
            <h3 className="cart-item-name">{item.name}</h3>
            <p className="cart-item-price">${parseFloat(item.price).toFixed(2)} each</p>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              <input
                type="number"
                className="quantity-input"
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                min="1"
              />
              <button 
                className="quantity-btn"
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
              <button 
                className="remove-btn"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
          <div className="cart-item-total">
            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <div className="cart-total">
          Total: ${calculateTotal().toFixed(2)}
        </div>
        <button 
          className="checkout-btn"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart

