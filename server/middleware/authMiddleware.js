const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Seller } = require('../models');  // ✅ ADDED - Import Seller model

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    console.log('🔐 Auth middleware - Authorization header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    console.log('🔑 Token found, verifying...');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    console.log('✅ Token verified, user ID:', decoded.id, 'Role:', decoded.role);
    
    // ✅ FIXED: Check appropriate table based on role
    let user;
    
    if (decoded.role === 'seller') {
      // For sellers, check Sellers table
      user = await Seller.findByPk(decoded.id);
      console.log('🔍 Looking for SELLER with ID:', decoded.id);
    } else {
      // For renters/admins, check Users table
      user = await User.findByPk(decoded.id);
      console.log('🔍 Looking for USER with ID:', decoded.id);
    }

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User authenticated:', user.email, 'Role:', decoded.role);
    
    // ✅ Attach user to request with role from JWT token
    req.user = {
      id: user.id,
      email: user.email,
      role: decoded.role,  // ✅ IMPORTANT: Role from token, not from database
      ...user.dataValues
    };
    
    next();
    
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

const isSellerMiddleware = (req, res, next) => {
  console.log('👤 Checking seller role for user:', req.user?.email, 'Role:', req.user?.role);
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.role !== 'seller') {
    console.log('❌ Access denied - user is not a seller');
    return res.status(403).json({
      success: false,
      message: 'Access denied. Seller role required.'
    });
  }

  console.log('✅ Seller role verified');
  next();
};

module.exports = {
  authMiddleware,
  isSellerMiddleware
};