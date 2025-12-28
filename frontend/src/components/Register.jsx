import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './Login.css' // Reuse premium auth styles

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }
    setLoading(true)
    setError('')
    try {
      await register(formData.username, formData.email, formData.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="auth-container glass-panel"
      >
        <div className="auth-header">
          <div className="auth-icon-seal">
            <UserPlus size={32} color="#d4af37" />
          </div>
          <h1 className="serif">{t('register.title')}</h1>
          <p className="auth-subtitle">Join our exclusive guild of collectors</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group-premium">
            <label className="serif">{t('register.username')}</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Ex: Alexander Art"
              />
            </div>
          </div>

          <div className="input-group-premium">
            <label className="serif">{t('register.email')}</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ex: artisan@treasures.com"
              />
            </div>
          </div>

          <div className="input-group-premium">
            <label className="serif">{t('register.password')}</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="input-group-premium">
            <label className="serif">{t('register.confirmPassword')}</label>
            <div className="input-wrapper">
              <ShieldCheck size={18} className="input-icon" />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-premium w-full"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t('register.button')}
          </motion.button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-error"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="auth-footer">
          <p>
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="gold-text-link serif italic">
              {t('register.login')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
