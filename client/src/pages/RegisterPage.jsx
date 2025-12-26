import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    agreeTerms: false,
    isStudent: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to terms & conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Call backend API
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        isStudent: formData.isStudent
      });

      if (response.data.success) {
        alert(`✅ Registration successful!\nWelcome ${formData.fullName}!\n\nPlease login with your credentials.`);
        // Navigate to login page
        navigate('/login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      alert(`❌ ${errorMessage}`);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGuest = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Logo Section */}
        <div className="register-logo">
          <div className="logo-icon-large">🏠</div>
          <h1>RENTEASY NEPAL</h1>
          <p>Your trusted furniture rental partner</p>
        </div>

        {/* Title */}
        <div className="register-header">
          <h2>Create Account</h2>
          <p className="register-subtitle">Signup as Renter, Seller or Admin</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            <span className="input-hint">Use .edu.np for student discount</span>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role">
              Select Role <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'error' : ''}
            >
              <option value="">Choose your role</option>
              <option value="renter">Renter - Browse and rent items</option>
              <option value="seller">Seller - List your furniture</option>
              <option value="admin">Admin - System management</option>
            </select>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          {/* Checkboxes */}
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span>I agree to terms & conditions</span>
            </label>
            {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isStudent"
                checked={formData.isStudent}
                onChange={handleChange}
              />
              <span>I'm a student - verify ID later</span>
            </label>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="error-text" style={{ textAlign: 'center' }}>
              {errors.submit}
            </div>
          )}

          {/* Register Button */}
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          {/* Back Button */}
          <button 
            type="button" 
            className="back-btn"
            onClick={handleBackToGuest}
          >
            ← Back to Browse
          </button>

          {/* Login Link */}
          <p className="login-link">
            Already have an account?{' '}
            <button type="button" onClick={handleLoginClick}>
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;