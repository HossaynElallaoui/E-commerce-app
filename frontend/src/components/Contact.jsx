import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MapPin, Phone, Mail, CheckCircle, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import './Contact.css'

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const { t } = useLanguage()

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true)
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="contact-page">
            <div className="max-width-container contact-shell">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="contact-info-block"
                >
                    <span className="editorial-category gold-text">{t('contact.category')}</span>
                    <h1 className="serif contact-title">{t('contact.title')} <br /> <span className="italic">{t('contact.highlight')}</span></h1>
                    <p className="contact-desc">
                        {t('contact.desc')}
                    </p>

                    <div className="contact-methods">
                        <div className="method">
                            <MapPin size={20} color="#d4af37" />
                            <div>
                                <h4 className="serif">{t('contact.hq')}</h4>
                                <p>127 Artisan Way, Geneva, CH</p>
                            </div>
                        </div>
                        <div className="method">
                            <Mail size={20} color="#d4af37" />
                            <div>
                                <h4 className="serif">{t('contact.digital')}</h4>
                                <p>curator@artisantreasures.com</p>
                            </div>
                        </div>
                        <div className="method">
                            <Phone size={20} color="#d4af37" />
                            <div>
                                <h4 className="serif">{t('contact.line')}</h4>
                                <p>+41 (0) 22 789 45 12</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="contact-form-block glass-panel"
                >
                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.form
                                key="form"
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmit}
                                className="contact-form-premium"
                            >
                                <div className="input-group-premium">
                                    <label className="serif">{t('contact.form.name')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ex: Alexander Art"
                                    />
                                </div>
                                <div className="input-group-premium">
                                    <label className="serif">{t('contact.form.email')}</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="curator@example.com"
                                    />
                                </div>
                                <div className="input-group-premium">
                                    <label className="serif">{t('contact.form.message')}</label>
                                    <textarea
                                        required
                                        rows="5"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder={t('contact.form.placeholder')}
                                    />
                                </div>
                                <button type="submit" className="btn-premium w-full" disabled={loading}>
                                    {loading ? t('contact.form.transmitting') : <>{t('contact.form.submit')} <Send size={18} /></>}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="contact-success"
                            >
                                <div className="success-icon-ring small">
                                    <CheckCircle size={40} color="#d4af37" />
                                </div>
                                <h2 className="serif">{t('contact.form.success')}</h2>
                                <p>{t('contact.form.successDesc')}</p>
                                <button className="btn-premium" onClick={() => setSubmitted(false)}>{t('contact.form.another')}</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}

export default Contact
