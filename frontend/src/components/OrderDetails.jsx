import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getProductImage } from '../utils/imageMapper';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, MapPin, Calendar, Package, CreditCard } from 'lucide-react';
import './OrderDetails.css';

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await api.getOrder(id);
            setOrder(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load order details.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await api.updateOrderStatus(id, newStatus);
            fetchOrderDetails();
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    if (loading) return <div className="luxury-loading serif">Retrieving Acquisition Details...</div>;
    if (error) return <div className="luxury-error-page serif">{error}</div>;
    if (!order) return <div className="luxury-error-page serif">Treasure Record Not Found</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-curation-view"
        >
            <div className="view-content-wrapper">
                <header className="curation-header">
                    <button className="btn-back-luxury" onClick={() => navigate('/admin')}>
                        <ArrowLeft size={16} />
                        <span>Command Center</span>
                    </button>

                    <div className="title-block">
                        <span className="subtitle gold-text">Acquisition Certificate</span>
                        <h1 className="serif">Acquisition #{order.id}</h1>
                    </div>

                    <div className="status-control-panel glass-panel">
                        <span className="label">Current Condition</span>
                        <div className="status-selector-wrapper">
                            <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(e.target.value)}
                                className={`luxury-status-select-large status-${order.status}`}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </header>

                <div className="curation-grid-layout">
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="curation-card glass-panel subscriber-info"
                    >
                        <h2 className="serif card-title">Subscriber Details</h2>
                        <div className="info-item">
                            <User size={16} className="gold-text" />
                            <div className="item-text">
                                <label>Patron Name</label>
                                <p>{order.customer_name}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Mail size={16} className="gold-text" />
                            <div className="item-text">
                                <label>Communication</label>
                                <p>{order.customer_email}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <MapPin size={16} className="gold-text" />
                            <div className="item-text">
                                <label>Destination</label>
                                <p className="address-display">{order.customer_address}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Calendar size={16} className="gold-text" />
                            <div className="item-text">
                                <label>Date of Acquisition</label>
                                <p>{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="curation-card glass-panel acquisitions-list"
                    >
                        <h2 className="serif card-title">Collection Overview</h2>
                        <div className="acquired-items">
                            {order.items && order.items.map((item, index) => (
                                <div key={index} className="acquired-item-row">
                                    <div className="item-thumb">
                                        <img
                                            src={getProductImage(item.name, item.image_url)}
                                            alt={item.name}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                                        />
                                    </div>
                                    <div className="item-meta">
                                        <h3 className="serif">{item.name}</h3>
                                        <p className="item-qty">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="item-valuation serif">
                                        ${parseFloat(item.price).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="valuation-footer">
                            <div className="total-valuation-row">
                                <div className="label-block">
                                    <CreditCard size={18} className="gold-text" />
                                    <span className="serif">Total Asset Value</span>
                                </div>
                                <span className="total-amount gold-text serif">
                                    ${parseFloat(order.total_amount).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>
        </motion.div>
    );
}

export default OrderDetails;
