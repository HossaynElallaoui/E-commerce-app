import { motion } from 'framer-motion'
import { Sparkles, Heart, Globe, Users } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import './About.css'

function About() {
    const { t } = useLanguage()

    const stats = [
        { icon: <Globe size={24} />, label: t('about.stats.artisans'), value: '250+' },
        { icon: <Users size={24} />, label: t('about.stats.curators'), value: '12' },
        { icon: <Heart size={24} />, label: t('about.stats.impact'), value: '100%' },
    ]

    return (
        <div className="about-page">
            {/* Editorial Header */}
            <section className="editorial-header max-width-container">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="editorial-category gold-text"
                >
                    {t('about.category')}
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="serif editorial-title"
                >
                    {t('about.title')} <br />
                    <span className="italic">{t('about.highlight')}</span>
                </motion.h1>
            </section>

            {/* Main Journal Story */}
            <section className="journal-story max-width-container">
                <div className="journal-grid">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="journal-text"
                    >
                        <h2 className="serif">{t('about.promiseTitle')}</h2>
                        <p>{t('about.promiseP1')}</p>
                        <p>{t('about.promiseP2')}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="journal-visual glass-panel"
                    >
                        <img src="/images/hero-artisan.jpg" alt="Artisan working" />
                        <div className="img-caption serif italic">{t('about.caption')}</div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="impact-stats max-width-container">
                <div className="stats-grid">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="stat-card"
                        >
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-value serif">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Closing Statement */}
            <section className="manifesto-section">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="manifesto-box glass-panel"
                >
                    <Sparkles color="#d4af37" size={32} />
                    <h2 className="serif">"{t('about.manifesto')}"</h2>
                    <p>{t('about.join')}</p>
                </motion.div>
            </section>
        </div>
    )
}

export default About
