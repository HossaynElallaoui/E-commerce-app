import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, User, Lock, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './Login.css'

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await login(formData.username, formData.password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="auth-container glass-panel"
      >
        <div className="auth-header">
          <div className="auth-icon-seal">
            <Sparkles size={32} color="#d4af37" />
          </div>
          <h1 className="serif">{t('login.title')}</h1>
          <p className="auth-subtitle">Access your private collection</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group-premium">
            <label className="serif">{t('login.username')}</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Ex: ArtCollector_99"
              />
            </div>
          </div>

          <div className="input-group-premium">
            <label className="serif">{t('login.password')}</label>
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-premium w-full"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t('login.button')}
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
            {t('login.noAccount')}{' '}
            <Link to="/register" className="gold-text-link serif italic">
              {t('login.register')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
