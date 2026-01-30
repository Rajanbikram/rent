import axiosInstance from './axiosConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth API
export const authAPI = {
  // ✅ Seller Auth
  registerSeller: (userData) => axiosInstance.post('/auth/seller/register', userData),
  loginSeller: (credentials) => axiosInstance.post('/auth/seller/login', credentials),
  
  // ✅ User/Renter/Admin Auth
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  
  // ✅ Token Verification
  verify: () => axiosInstance.get('/auth/verify'),
  
  // Common
  logout: () => axiosInstance.post('/auth/logout'),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data)
};

// Admin API
export const adminAPI = {
  // Auth
  login: (credentials) => axiosInstance.post('/admin/auth/login', credentials),
  register: (userData) => axiosInstance.post('/admin/auth/register', userData),
  
  // Dashboard
  getDashboard: () => axiosInstance.get('/admin/dashboard'),
  
  // Users
  getAllUsers: (params) => axiosInstance.get('/admin/users/all', { params }),
  toggleUserStatus: (userId, type) => axiosInstance.put(`/admin/users/${userId}/toggle-status`, { type }),
  deleteUser: (userId, type) => axiosInstance.delete(`/admin/users/${userId}`, { data: { type } }),
  updateUserRole: (userId, role) => axiosInstance.put(`/admin/users/${userId}/role`, { role }),
  
  // Listings
  getListings: (params) => axiosInstance.get('/admin/listings', { params }),
  approveListing: (listingId) => axiosInstance.patch(`/admin/listings/${listingId}/approve`),
  rejectListing: (listingId) => axiosInstance.patch(`/admin/listings/${listingId}/reject`),
  deleteListing: (listingId) => axiosInstance.delete(`/admin/listings/${listingId}`),
  
  // Orders
  getOrders: (params) => axiosInstance.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, status) => axiosInstance.patch(`/admin/orders/${orderId}/status`, { status }),
  
  // Payments
  getPayments: (params) => axiosInstance.get('/admin/payments', { params }),
  getPaymentStats: () => axiosInstance.get('/admin/payments/stats'),
  updatePaymentStatus: (paymentId, status) => axiosInstance.patch(`/admin/payments/${paymentId}/status`, { status })
};

// Seller API
export const sellerAPI = {
  getDashboard: () => axiosInstance.get('/seller/dashboard'),
  getProfile: () => axiosInstance.get('/seller/profile'),
  updateProfile: (data) => axiosInstance.put('/seller/profile', data),
  getListings: () => axiosInstance.get('/seller/listings'),
  toggleListingStatus: (id) => axiosInstance.put(`/seller/listings/${id}/toggle-status`),
  getMessages: () => axiosInstance.get('/seller/messages'),
  replyToMessage: (id, reply) => axiosInstance.put(`/seller/messages/${id}/reply`, { reply }),
  markMessageRead: (id) => axiosInstance.put(`/seller/messages/${id}/read`),
  getRentalHistory: () => axiosInstance.get('/seller/rental-history'),
  getEarnings: () => axiosInstance.get('/seller/earnings')
};

// Rental API
export const rentalAPI = {
  // Rental Products
  getProducts: (params) => axiosInstance.get('/rental/products', { params }),
  getProductById: (id) => axiosInstance.get(`/rental/products/${id}`),
  createProduct: (data) => axiosInstance.post('/rental/products', data),
  updateProduct: (id, data) => axiosInstance.put(`/rental/products/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/rental/products/${id}`),
  
  // Rental Cart
  getCart: () => axiosInstance.get('/rental/cart'),
  addToCart: (data) => axiosInstance.post('/rental/cart', data),
  updateCartItem: (id, data) => axiosInstance.put(`/rental/cart/${id}`, data),
  removeFromCart: (id) => axiosInstance.delete(`/rental/cart/${id}`),
  clearCart: () => axiosInstance.delete('/rental/cart'),
  
  // Rental Favorites
  getFavorites: () => axiosInstance.get('/rental/favorites'),
  toggleFavorite: (productId) => axiosInstance.post('/rental/favorites/toggle', { productId }),
  
  // Rental Orders/Bookings
  getRentals: () => axiosInstance.get('/rental/rentals'),
  createRental: (data) => axiosInstance.post('/rental/rentals', data),
  updateRentalStatus: (id, status) => axiosInstance.put(`/rental/rentals/${id}/status`, { status }),
  renewRental: (id) => axiosInstance.put(`/rental/rentals/${id}/renew`)
};

// Product API
export const productAPI = {
  getAll: () => axiosInstance.get('/products'),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  create: (data) => axiosInstance.post('/products', data),
  update: (id, data) => axiosInstance.put(`/products/${id}`, data),
  delete: (id) => axiosInstance.delete(`/products/${id}`),
  search: (query) => axiosInstance.get(`/products/search?q=${query}`),
  getByCategory: (category) => axiosInstance.get(`/products/category/${category}`),
  getByLocation: (location) => axiosInstance.get(`/products/location/${location}`)
};

// Deal API
export const dealAPI = {
  getAll: () => axiosInstance.get('/deals'),
  getById: (id) => axiosInstance.get(`/deals/${id}`),
  create: (data) => axiosInstance.post('/deals', data),
  update: (id, data) => axiosInstance.put(`/deals/${id}`, data),
  delete: (id) => axiosInstance.delete(`/deals/${id}`),
  getActive: () => axiosInstance.get('/deals/active')
};

// Cart API
export const cartAPI = {
  getCart: () => axiosInstance.get('/cart'),
  addItem: (productId, quantity) => axiosInstance.post('/cart/items', { productId, quantity }),
  updateItem: (itemId, quantity) => axiosInstance.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => axiosInstance.delete(`/cart/items/${itemId}`),
  clearCart: () => axiosInstance.delete('/cart')
};

// Order API
export const orderAPI = {
  create: (orderData) => axiosInstance.post('/orders', orderData),
  getAll: () => axiosInstance.get('/orders'),
  getById: (id) => axiosInstance.get(`/orders/${id}`),
  updateStatus: (id, status) => axiosInstance.put(`/orders/${id}/status`, { status }),
  cancel: (id) => axiosInstance.delete(`/orders/${id}`)
};

// Wishlist API
export const wishlistAPI = {
  getAll: () => axiosInstance.get('/wishlist'),
  add: (productId) => axiosInstance.post('/wishlist', { productId }),
  remove: (productId) => axiosInstance.delete(`/wishlist/${productId}`)
};

export default axiosInstance;