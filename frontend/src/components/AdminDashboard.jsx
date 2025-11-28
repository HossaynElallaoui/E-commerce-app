import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getProductImage } from '../utils/imageMapper';
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
      alert('Product created successfully!');
    } catch (err) {
      alert('Failed to create product. Please try again.');
      console.error('Error creating product:', err);
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
      alert('Product updated successfully!');
    } catch (err) {
      alert('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
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
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.deleteProduct(id);
      fetchData();
      alert('Product deleted successfully!');
    } catch (err) {
      alert('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchData();
      alert('Order status updated successfully!');
    } catch (err) {
      alert('Failed to update order status. Please try again.');
      console.error('Error updating order status:', err);
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
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <span className="welcome-text">Welcome, {user?.username}!</span>
          <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="products-section">
          <div className="section-header">
            <h2>Manage Products</h2>
            <button
              className="add-product-btn"
              onClick={() => {
                resetForm();
                setShowProductForm(true);
              }}
            >
              + Add New Product
            </button>
          </div>

          {showProductForm && (
            <div className="product-form-card">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="admin-product-card">
                <img
                  src={getProductImage(product.name, product.image_url)}
                  alt={product.name}
                  className="admin-product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300';
                  }}
                />
                <div className="admin-product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-details">
                    <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
                    <span className="product-stock">Stock: {product.stock}</span>
                  </div>
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2>All Orders</h2>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.customer_email}</td>
                    <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="no-orders">No orders yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

