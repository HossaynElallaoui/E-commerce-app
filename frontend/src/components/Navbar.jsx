import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await api.getCart()
        const totalItems = response.data.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalItems)
      } catch (error) {
        // Silently fail - backend might not be running yet
        setCartCount(0)
      }
    }

    fetchCartCount()
    // Poll for cart updates every 2 seconds
    const interval = setInterval(fetchCartCount, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
            <img src="/images/logo.png" alt="Cisia" className="navbar-logo" />
            <span className="navbar-brand-text">CISIA ECOMMERCE</span>
          </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Products
          </Link>
          <Link to="/cart" className="navbar-link">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              {isAdmin() && (
                <Link to="/admin" className="navbar-link">
                  Admin Dashboard
                </Link>
              )}
              <span className="navbar-user">Hello, {user.username}</span>
              <button className="logout-nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

