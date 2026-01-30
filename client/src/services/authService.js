import axiosInstance from './axiosConfig';

const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/admin/auth/login', { email, password });
      
      if (response.data.token) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.admin));
        localStorage.setItem('userRole', response.data.admin.role);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // Register
  register: async (name, email, password) => {
    try {
      const response = await axiosInstance.post('/admin/auth/register', { name, email, password, role: 'admin' });
      
      if (response.data.token) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.admin));
        localStorage.setItem('userRole', response.data.admin.role);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  },

  // Get user from localStorage (synchronous)
  getUser: () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user is renter
  isRenter: () => {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'renter';
  },

  // Get current user from API
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/admin/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get user' };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await axiosInstance.get('/auth/verify');
      return response.data;
    } catch (error) {
      return { success: false };
    }
  }
};

export default authService;