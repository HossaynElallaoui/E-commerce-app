import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, LogOut, User, Menu, X, LayoutDashboard, Globe, Sparkles } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './Navbar.css'

function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const { user, logout, isAdmin } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await api.getCart()
        const totalItems = response.data.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalItems)
      } catch (error) {
        setCartCount(0)
      }
    }

    fetchCartCount()
    const interval = setInterval(fetchCartCount, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { path: '/', label: t('nav.products') },
    { path: '/about', label: t('nav.story') },
    { path: '/contact', label: t('nav.contact') },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="navbar"
    >
      <div className="navbar-container">
        {/* Left: Logo */}
        <Link to="/" className="navbar-brand">
          <motion.div
            className="navbar-logo-container"
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <Sparkles size={24} color="#d4af37" className="navbar-logo-icon" />
          </motion.div>
          <motion.span
            className="navbar-brand-text serif italic"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Artisan Treasures
          </motion.span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="navbar-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-pill-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>{link.label}</span>
              {location.pathname === link.path && (
                <motion.div
                  layoutId="pill-bg"
                  className="pill-background"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="navbar-actions">
          <div className="lang-select-wrapper">
            <Globe size={14} style={{ position: 'absolute', left: '10px', pointerEvents: 'none', opacity: 0.6 }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select"
              style={{ paddingLeft: '28px' }}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>
          </div>

          <Link to="/cart" className="action-icon-btn" aria-label="Cart">
            <ShoppingCart size={18} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0, y: 5 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: 5 }}
                  className="cart-badge"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {user ? (
            <div className="user-menu">
              {isAdmin() && (
                <Link to="/admin" className="admin-link">
                  <LayoutDashboard size={14} />
                  {t('nav.dashboard')}
                </Link>
              )}
              <span className="user-greeting">{t('nav.greeting')} {user.username}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="logout-btn-small"
                onClick={handleLogout}
                title={t('nav.logout')}
              >
                <LogOut size={14} />
              </motion.button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-link">{t('nav.login')}</Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="register-btn">{t('nav.register')}</Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
