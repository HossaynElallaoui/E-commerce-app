import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getProductImage } from '../utils/imageMapper';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  LogOut,
  Settings,
  TrendingUp,
  Box,
  Clock
} from 'lucide-react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    stock: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        api.getProducts(),
        api.getAllOrders()
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        stock: parseInt(formData.stock) || 0
      });
      resetForm();
      fetchData();
    } catch (err) {
      alert('Failed to create product.');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.updateProduct(editingProduct.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        stock: parseInt(formData.stock) || 0
      });
      resetForm();
      fetchData();
    } catch (err) {
      alert('Failed to update product.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url || '',
      stock: product.stock
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Archive this treasure from the collection?')) return;
    try {
      await api.deleteProduct(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchData();
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      stock: ''
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="admin-loader"
        />
        <p className="serif">Accessing Curator's Command...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-dashboard-container"
    >
      <div className="curator-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon-gold">
            <Settings size={24} />
          </div>
          <h2 className="serif">Command</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            <span>Collection</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={20} />
            <span>Acquisitions</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={18} />
            <span>Resign</span>
          </button>
        </div>
      </div>

      <main className="admin-main-content">
        <header className="admin-view-header">
          <div className="header-labels">
            <span className="subtitle gold-text">Curator Privileges</span>
            <h1 className="serif">
              {activeTab === 'products' ? 'Master Collection' : 'Member Acquisitions'}
            </h1>
          </div>

          <div className="admin-brief-stats">
            <div className="stat-pill glass-panel">
              <Box size={14} className="gold-text" />
              <span>{products.length} Treasures</span>
            </div>
            <div className="stat-pill glass-panel">
              <TrendingUp size={14} className="gold-text" />
              <span>{orders.length} Orders</span>
            </div>
          </div>
        </header>

        {error && <div className="admin-error-banner">{error}</div>}

        <AnimatePresence mode="wait">
          {activeTab === 'products' ? (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="collection-view"
            >
              <div className="view-actions">
                <button
                  className="btn-premium action-add"
                  onClick={() => setShowProductForm(true)}
                >
                  <Plus size={18} />
                  <span>New Acquisition</span>
                </button>
              </div>

              {showProductForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="product-curation-form glass-panel"
                >
                  <h3 className="serif">{editingProduct ? 'Refine Treasure' : 'Curate New Item'}</h3>
                  <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
                    <div className="luxury-form-grid">
                      <div className="input-field">
                        <label>Item Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} required />
                      </div>
                      <div className="input-field">
                        <label>Value ($)</label>
                        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required />
                      </div>
                      <div className="input-field full">
                        <label>Provenance / Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} />
                      </div>
                      <div className="input-field">
                        <label>Gallery URL</label>
                        <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} />
                      </div>
                      <div className="input-field">
                        <label>Inventory Count</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" />
                      </div>
                    </div>
                    <div className="form-submit-row">
                      <button type="submit" className="btn-premium fill">
                        {editingProduct ? 'Save Refinements' : 'Authorize Acquisition'}
                      </button>
                      <button type="button" className="btn-ghost" onClick={resetForm}>Cancel</button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="curation-grid">
                {products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="curation-item-card glass-panel"
                  >
                    <div className="item-preview">
                      <img src={getProductImage(product.name, product.image_url)} alt={product.name} />
                      <div className="item-status-overlay">
                        <span className="stock-tag">{product.stock} in Vault</span>
                      </div>
                    </div>
                    <div className="item-curation-info">
                      <h4 className="serif">{product.name}</h4>
                      <p className="item-price-gold">${parseFloat(product.price).toLocaleString()}</p>
                      <div className="curation-actions">
                        <button className="icon-action-gold" onClick={() => handleEditProduct(product)}>
                          <Edit3 size={16} />
                        </button>
                        <button className="icon-action-red" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="acquisitions-view"
            >
              <div className="luxury-table-container glass-panel">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      <th className="serif">Ref</th>
                      <th className="serif">Acquired By</th>
                      <th className="serif">Investment</th>
                      <th className="serif">Condition</th>
                      <th className="serif">Date</th>
                      <th className="serif">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <td className="gold-text">#{order.id}</td>
                        <td className="member-cell">
                          <span className="member-name">{order.customer_name}</span>
                          <span className="member-email">{order.customer_email}</span>
                        </td>
                        <td className="price-cell">${parseFloat(order.total_amount).toLocaleString()}</td>
                        <td>
                          <div className="status-dropdown-container">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`luxury-status-select status-${order.status}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <Clock size={12} className="status-clock" />
                          </div>
                        </td>
                        <td className="date-cell">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn-view-treasure"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            <ExternalLink size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div className="empty-vault">
                    <ShoppingBag size={48} className="muted-icon" />
                    <p className="serif">No acquisitions recorded yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

export default AdminDashboard;

