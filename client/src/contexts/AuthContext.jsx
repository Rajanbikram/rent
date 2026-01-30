import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount (NO API call)
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const userRole = localStorage.getItem('userRole');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('✅ User loaded from localStorage:', userData.email, 'Role:', userRole);
      } catch (error) {
        console.error('❌ Error parsing stored user:', error);
        clearAuth();
      }
    } else {
      console.log('⚠️ No stored user data found');
    }
    
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      if (response.data.success || response.data.token) {
        const { token, data, admin } = response.data;
        const userData = data || admin;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        
        console.log('✅ Login successful:', userData.email, 'Role:', userData.role);
        
        return { success: true, user: userData };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      
      if (response.data.success || response.data.token) {
        const { token, data } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('user', JSON.stringify(data));
        
        // Update state
        setUser(data);
        
        return { success: true, user: data };
      }
      
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 User manually logging out...');
    clearAuth();
    window.location.href = '/login';
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    setUser(null);
    console.log('🧹 Auth data cleared');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;