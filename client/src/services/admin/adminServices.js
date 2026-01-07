import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ========== AXIOS INSTANCE ==========
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== AUTH SERVICES ==========
export const authService = {
  login: (credentials) => api.post('/auth/admin/login', credentials),
  logout: () => {
    localStorage.removeItem('admin_token');
    return Promise.resolve();
  },
  verifyToken: () => api.get('/auth/verify'),
};

// ========== USER SERVICES ==========
export const userService = {
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  banUser: (id) => api.patch(`/admin/users/${id}/ban`),
  unbanUser: (id) => api.patch(`/admin/users/${id}/unban`),
  resetPassword: (id) => api.post(`/admin/users/${id}/reset-password`),
  getLoginActivity: (id) => api.get(`/admin/users/${id}/activity`),
  searchUsers: (query) => api.get(`/admin/users/search?q=${query}`),
};

// ========== LISTING SERVICES ==========
export const listingService = {
  getAllListings: () => api.get('/admin/listings'),
  getListingById: (id) => api.get(`/admin/listings/${id}`),
  approveListing: (id) => api.patch(`/admin/listings/${id}/approve`),
  rejectListing: (id, reason) => api.patch(`/admin/listings/${id}/reject`, { reason }),
  deleteListing: (id) => api.delete(`/admin/listings/${id}`),
  filterListings: (status) => api.get(`/admin/listings?status=${status}`),
};

// ========== ORDER SERVICES ==========
export const orderService = {
  getAllOrders: () => api.get('/admin/orders'),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  filterOrders: (status) => api.get(`/admin/orders?status=${status}`),
};

// ========== PAYMENT SERVICES ==========
export const paymentService = {
  getAllPayments: () => api.get('/admin/payments'),
  getPaymentById: (id) => api.get(`/admin/payments/${id}`),
  calculateVAT: (amount) => {
    const vatRate = 0.13; // Nepal VAT 13%
    const vat = Math.round(amount * vatRate);
    return { base: amount, vat, total: amount + vat };
  },
};

// ========== VERIFICATION SERVICES ==========
export const verificationService = {
  getAllVerifications: () => api.get('/admin/verifications'),
  getVerificationById: (id) => api.get(`/admin/verifications/${id}`),
  approveVerification: (id) => api.patch(`/admin/verifications/${id}/approve`),
  rejectVerification: (id, reason) => api.patch(`/admin/verifications/${id}/reject`, { reason }),
};

// ========== PROMO SERVICES ==========
export const promoService = {
  getAllPromos: () => api.get('/admin/promos'),
  createPromo: (data) => api.post('/admin/promos', data),
  updatePromo: (id, data) => api.patch(`/admin/promos/${id}`, data),
  togglePromo: (id) => api.patch(`/admin/promos/${id}/toggle`),
  deletePromo: (id) => api.delete(`/admin/promos/${id}`),
};

// ========== ANALYTICS SERVICES ==========
export const analyticsService = {
  getDashboardStats: () => api.get('/admin/analytics/dashboard'),
  getUserGrowth: () => api.get('/admin/analytics/user-growth'),
  getRevenueStats: () => api.get('/admin/analytics/revenue'),
  getCategoryDistribution: () => api.get('/admin/analytics/categories'),
};

export default api;