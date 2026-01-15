import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useRental } from '../contexts/RentalContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { clearAllData, refetchUserData } = useRental();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔄 Attempting login...', { email: formData.email });
      
      // ✅ Clear old user data BEFORE login
      console.log('🧹 Clearing previous user data...');
      clearAllData();
      
      // ✅ NEW: Try to detect user role from database
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Full login response:', response.data);

      if (response.data.success) {
        const { token } = response.data;
        
        // ✅ Get user data and role from response
        let userData;
        let userRole;
        
        if (response.data.seller) {
          userData = response.data.seller;
          userRole = 'seller';
          console.log('👤 Seller login:', userData);
        } else if (response.data.user) {
          userData = response.data.user;
          userRole = userData.role; // admin or renter from DB
          console.log('👤 User login:', userData, 'Role:', userRole);
        } else if (response.data.admin) {
          userData = response.data.admin;
          userRole = 'admin';
          console.log('👤 Admin login:', userData);
        } else {
          console.error('❌ No user data in response!');
          setError('Invalid response from server');
          return;
        }
        
        console.log('🔑 Token:', token);
        console.log('👤 Role from DB:', userRole);
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', userRole);
        
        // For admin, also store admin_token
        if (userRole === 'admin') {
          localStorage.setItem('admin_token', token);
        }
        
        console.log('💾 Saved to localStorage');
        
        // Navigate based on role from database
        console.log(`🚀 Navigating to ${userRole} dashboard...`);
        
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'seller') {
          navigate('/seller/dashboard');
        } else if (userRole === 'renter') {
          navigate('/rental');
          
          // Refetch user data after navigation
          setTimeout(() => {
            console.log('🔄 Triggering data refetch for renter...');
            refetchUserData();
          }, 500);
        } else {
          navigate('/');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <h1>RENTEASY NEPAL</h1>
          <p>Your trusted furniture rental partner</p>
        </div>

        <h2 className="login-welcome">WELCOME BACK</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="**********"
              required
            />
          </div>

          {error && (
            <div style={{ 
              color: '#e53e3e', 
              textAlign: 'center', 
              fontSize: '0.9rem',
              padding: '10px',
              background: '#fee',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="register-link">
            Don't have an account?{' '}
            <button type="button" onClick={handleRegisterClick}>
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;