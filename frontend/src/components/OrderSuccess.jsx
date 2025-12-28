import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, Sparkles, ShoppingBag, Download, Share2 } from 'lucide-react'
import './OrderSuccess.css'

function OrderSuccess() {
    const navigate = useNavigate()
    const orderId = `AT-${Math.floor(Math.random() * 90000) + 10000}`

    return (
        <div className="order-success-luxury">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="success-content-wrapper glass-panel"
            >
                <div className="success-header">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="success-icon-seal"
                    >
                        <CheckCircle size={80} color="#d4af37" strokeWidth={1} />
                    </motion.div>
                    <h1 className="serif gold-text">Acquisition Complete</h1>
                    <p className="subtitle">Your narrative continues. The artisan treasures have been reserved for you.</p>
                </div>

                <div className="order-certificate">
                    <div className="cert-header">
                        <Sparkles size={20} color="#d4af37" />
                        <span className="serif">Official Verification</span>
                    </div>
                    <div className="cert-body">
                        <div className="cert-row">
                            <span className="label">Reference ID</span>
                            <span className="value serif">{orderId}</span>
                        </div>
                        <div className="cert-row">
                            <span className="label">Status</span>
                            <span className="value status-pill">Authenticated</span>
                        </div>
                        <div className="cert-row">
                            <span className="label">Logistic Batch</span>
                            <span className="value">Direct Artisan Courier</span>
                        </div>
                    </div>
                </div>

                <div className="success-actions">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-premium"
                        onClick={() => navigate('/')}
                    >
                        Explore More Treasures <ArrowRight size={18} />
                    </motion.button>

                    <div className="secondary-actions">
                        <button className="btn-ghost">
                            <Download size={18} /> Receipt
                        </button>
                        <button className="btn-ghost">
                            <Share2 size={18} /> Share
                        </button>
                    </div>
                </div>

                <div className="success-footer">
                    <ShoppingBag size={18} />
                    <span>Thank you for supporting global craftsmanship</span>
                </div>
            </motion.div>

            <div className="ambient-particles">
                {/* Placeholder for future particle effects if needed */}
            </div>
        </div>
    )
}

export default OrderSuccess
