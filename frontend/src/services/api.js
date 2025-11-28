import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generate a simple session ID (in production, use proper session management)
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const api = {
  // Authentication
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getCurrentUser: () => apiClient.get('/auth/me'),

  // Products (Public)
  getProducts: () => apiClient.get('/products'),
  getProduct: (id) => apiClient.get(`/products/${id}`),

  // Cart
  getCart: () => apiClient.get('/cart', {
    params: { sessionId: getSessionId() }
  }),
  addToCart: (productId, quantity = 1) => apiClient.post('/cart', {
    productId,
    quantity,
    sessionId: getSessionId()
  }),
  updateCartItem: (id, quantity) => apiClient.put(`/cart/${id}`, { quantity }),
  removeFromCart: (id) => apiClient.delete(`/cart/${id}`),
  clearCart: () => apiClient.delete('/cart', {
    params: { sessionId: getSessionId() }
  }),

  // Orders
  createOrder: (orderData) => apiClient.post('/orders', {
    ...orderData,
    sessionId: getSessionId()
  }),
  getOrders: () => apiClient.get('/orders'),
  getOrder: (id) => apiClient.get(`/orders/${id}`),

  // Admin - Products
  createProduct: (productData) => apiClient.post('/admin/products', productData),
  updateProduct: (id, productData) => apiClient.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),

  // Admin - Orders
  getAllOrders: () => apiClient.get('/admin/orders'),
  updateOrderStatus: (id, status) => apiClient.put(`/admin/orders/${id}/status`, { status })
};

