import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getProductImage } from '../utils/imageMapper';
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
            setError('Failed to load order details. Please try again.');
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await api.updateOrderStatus(id, newStatus);
            fetchOrderDetails(); // Refresh data
            alert('Order status updated successfully!');
        } catch (err) {
            alert('Failed to update status. Please try again.');
            console.error('Error updating status:', err);
        }
    };

    if (loading) return <div className="loading">Loading order details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!order) return <div className="error-message">Order not found</div>;

    return (
        <div className="order-details-container">
            <button className="back-btn" onClick={() => navigate('/admin')}>
                ← Back to Dashboard
            </button>

            <div className="order-header">
                <h1>Order #{order.id}</h1>
                <div className="order-status-control">
                    <span className={`status-badge status-${order.status}`}>
                        {order.status.toUpperCase()}
                    </span>
                    <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        className="status-select-large"
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="order-grid">
                <div className="order-section customer-info">
                    <h2>Customer Information</h2>
                    <div className="info-group">
                        <label>Name</label>
                        <p>{order.customer_name}</p>
                    </div>
                    <div className="info-group">
                        <label>Email</label>
                        <p>{order.customer_email}</p>
                    </div>
                    <div className="info-group">
                        <label>Shipping Address</label>
                        <p className="address-text">{order.customer_address}</p>
                    </div>
                    <div className="info-group">
                        <label>Order Date</label>
                        <p>{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                </div>

                <div className="order-section order-items">
                    <h2>Order Items</h2>
                    <div className="items-list">
                        {order.items && order.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <img
                                    src={getProductImage(item.name, item.image_url)}
                                    alt={item.name}
                                    className="item-image"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/100';
                                    }}
                                />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">${parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                                </div>
                                <div className="item-total">
                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="order-summary-footer">
                        <div className="total-row">
                            <span>Total Amount</span>
                            <span className="total-amount">${parseFloat(order.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
