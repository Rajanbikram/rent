import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Seller API ← ADD THIS SECTION
export const sellerAPI = {
  getDashboard: () => api.get('/seller/dashboard'),
  getProfile: () => api.get('/seller/profile'),
  updateProfile: (data) => api.put('/seller/profile', data),
  getListings: () => api.get('/seller/listings'),
  toggleListingStatus: (id) => api.put(`/seller/listings/${id}/toggle-status`),
  getMessages: () => api.get('/seller/messages'),
  replyToMessage: (id, reply) => api.put(`/seller/messages/${id}/reply`, { reply }),
  markMessageRead: (id) => api.put(`/seller/messages/${id}/read`),
  getRentalHistory: () => api.get('/seller/rental-history'),
  getEarnings: () => api.get('/seller/earnings')
};

// Product API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getByLocation: (location) => api.get(`/products/location/${location}`)
};

// Deal API
export const dealAPI = {
  getAll: () => api.get('/deals'),
  getById: (id) => api.get(`/deals/${id}`),
  create: (data) => api.post('/deals', data),
  update: (id, data) => api.put(`/deals/${id}`, data),
  delete: (id) => api.delete(`/deals/${id}`),
  getActive: () => api.get('/deals/active')
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity) => api.post('/cart/items', { productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart')
};

// Order API
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.delete(`/orders/${id}`)
};

// Wishlist API
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`)
};

export default api;