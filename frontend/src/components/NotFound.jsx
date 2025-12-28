import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';
import './NotFound.css';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-luxury">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="not-found-content"
            >
                <div className="error-visual">
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="compass-icon"
                    >
                        <Compass size={80} strokeWidth={1} />
                    </motion.div>
                </div>

                <h1 className="error-code serif gold-text">404</h1>
                <h2 className="error-title serif">A Lost Treasure</h2>
                <p className="error-narrative serif">
                    It seems you've wandered into an uncharted corner of the gallery.
                    The masterpiece you seek may have been moved, or perhaps it never existed in this realm.
                </p>

                <div className="action-row">
                    <button
                        className="btn-premium fill"
                        onClick={() => navigate('/')}
                    >
                        <Home size={18} style={{ marginRight: '10px' }} />
                        Return to Main Gallery
                    </button>
                </div>
            </motion.div>

            <div className="ambient-background">
                <div className="glow-circle top"></div>
                <div className="glow-circle bottom"></div>
            </div>
        </div>
    );
}

export default NotFound;
