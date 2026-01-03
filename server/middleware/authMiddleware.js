const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Seller } = require('../models');

const authMiddleware = async (req, res, next) => {
  console.log('🚨 AUTH MIDDLEWARE TRIGGERED');
  console.log('🚨 Request:', req.method, req.path);
  
  try {
    const authHeader = req.headers.authorization;
    
    console.log('🔐 Auth header:', authHeader ? 'Present ✅' : 'Missing ❌');
    
    if (!authHeader) {
      console.log('❌ No authorization header');
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('❌ No token in header');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    console.log('🔑 Token found, verifying...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    console.log('✅ Token verified - User ID:', decoded.id, 'Role:', decoded.role);
    
    let user;
    
    if (decoded.role === 'seller') {
      user = await Seller.findByPk(decoded.id);
      console.log('🔍 Looking for SELLER with ID:', decoded.id);
    } else {
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
    
    req.user = {
      id: user.id,
      email: user.email,
      role: decoded.role,
      isStudent: user.isStudent || false,
      ...user.dataValues
    };
    
    next();
    
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    console.error('❌ Full error:', error);
    
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
  console.log('👤 Checking seller role - User:', req.user?.email, 'Role:', req.user?.role);
  
  if (!req.user) {
    console.log('❌ No user in request');
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.role !== 'seller') {
    console.log('❌ Access denied - not a seller');
    return res.status(403).json({
      success: false,
      message: 'Access denied. Seller role required.'
    });
  }

  console.log('✅ Seller role verified');
  next();
};

const isRenterMiddleware = (req, res, next) => {
  console.log('🏠 Checking renter role - User:', req.user?.email, 'Role:', req.user?.role);
  
  if (!req.user) {
    console.log('❌ No user in request');
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.role !== 'renter') {
    console.log('❌ Access denied - not a renter');
    return res.status(403).json({
      success: false,
      message: 'Access denied. Renter role required.'
    });
  }

  console.log('✅ Renter role verified');
  next();
};

module.exports = {
  authMiddleware,
  isSellerMiddleware,
  isRenterMiddleware
};