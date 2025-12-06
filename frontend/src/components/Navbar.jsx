import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './Navbar.css'

function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const { user, logout, isAdmin } = useAuth()
  const { language, setLanguage, t } = useLanguage()
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
      <div className="navbar-container">
        {/* Left: Logo */}
        <Link to="/" className="navbar-brand">
          <img src="/images/logo.png" alt="Artisan Treasures" className="navbar-logo" />
          <span className="navbar-brand-text">Artisan Treasures</span>
        </Link>

        {/* Center: Navigation Links (Pill) */}
        <div className="navbar-center">
          <Link to="/" className="nav-pill-link">{t('nav.products')}</Link>
          <Link to="/about" className="nav-pill-link">{t('nav.story')}</Link>
          <Link to="/contact" className="nav-pill-link">{t('nav.contact')}</Link>
        </div>

        {/* Right: Actions (Cart, Auth, Lang) */}
        <div className="navbar-actions">
          {/* Language Switcher */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="lang-select"
          >
            <option value="en">🇺🇸 EN</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="ar">🇲🇦 AR</option>
          </select>

          <Link to="/cart" className="action-icon-btn" aria-label="Cart">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              {isAdmin() && (
                <Link to="/admin" className="admin-link">
                  {t('nav.dashboard')}
                </Link>
              )}
              <span className="user-greeting">{t('nav.greeting')}, {user.username}</span>
              <button className="logout-btn-small" onClick={handleLogout}>
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-link">{t('nav.login')}</Link>
              <Link to="/register" className="register-btn">{t('nav.register')}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

