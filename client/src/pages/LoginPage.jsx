import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
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
    
    if (!formData.email || !formData.password || !formData.role) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔄 Attempting login...', formData);
      
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      console.log('✅ Full login response:', response.data);

      if (response.data.success) {
        const { token } = response.data;
        
        // Get user data from correct key based on role
        let userData;
        if (response.data.seller) {
          userData = response.data.seller;
          console.log('👤 Seller data:', userData);
        } else if (response.data.user) {
          userData = response.data.user;
          console.log('👤 User data:', userData);
        } else {
          console.error('❌ No user/seller data in response!');
          setError('Invalid response from server');
          setLoading(false);
          return;
        }
        
        console.log('🔑 Token:', token);
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.role || formData.role);
        
        console.log('💾 Saved to localStorage');
        console.log('💾 Token:', localStorage.getItem('token'));
        console.log('💾 User:', localStorage.getItem('user'));
        console.log('💾 Role:', localStorage.getItem('userRole'));
        
        // ✅ UPDATED: Navigate based on role
        const role = (userData.role || formData.role).toLowerCase();
        
        if (role === 'seller') {
          console.log('🚀 Navigating to seller dashboard...');
          navigate('/seller/dashboard');
        } else if (role === 'renter') {
          console.log('🚀 Navigating to rental dashboard...');
          navigate('/rental');  // ✅ FIXED: Direct navigation to /rental
        } else if (role === 'admin') {
          console.log('🚀 Navigating to admin dashboard...');
          alert(`Welcome ${userData.name || userData.fullName}!\n\nAdmin dashboard coming soon!`);
          navigate('/');
        } else {
          console.log('🚀 Navigating to home...');
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

  const handleBackToGuest = () => {
    navigate('/');
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

          <div className="form-group">
            <label htmlFor="role">Select role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Please select your role</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="renter">Renter</option>
            </select>
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

          <button 
            type="button" 
            className="back-btn"
            onClick={handleBackToGuest}
          >
            ← Back to Browse
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