const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// ===================================================
// SELLER ROUTES (Direct Access)
// ===================================================
router.post('/seller/register', authController.registerSeller);
router.post('/seller/login', authController.loginSeller);

// ===================================================
// USER ROUTES (Renter/Admin - Direct Access)
// ===================================================
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);

// ===================================================
// GENERIC ROUTES (Smart Routing - AUTO DETECT ROLE)
// ===================================================

// Generic Register - Routes based on role in request body
router.post('/register', async (req, res) => {
  const { email, role } = req.body;
  
  console.log('📝 Register request received:', { email, role });
  
  if (!email || !role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and role'
    });
  }
  
  const roleLower = role.toLowerCase();
  
  if (roleLower === 'seller') {
    console.log('→ Routing to seller registration');
    return authController.registerSeller(req, res);
  } else if (roleLower === 'admin' || roleLower === 'renter') {
    console.log('→ Routing to user registration');
    return authController.registerUser(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be seller, admin, or renter'
    });
  }
});

// ✅ UPDATED: Generic Login - AUTO DETECT from database
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login request received:', { email });
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  try {
    // ✅ NEW: Try to find user in BOTH tables
    const { Seller, User } = require('../models');
    
    // Check Seller table first
    const seller = await Seller.findOne({ where: { email } });
    
    if (seller) {
      console.log('→ Found in Seller table, routing to seller login');
      req.body.role = 'seller'; // Set role for seller login
      return authController.loginSeller(req, res);
    }
    
    // Check User table
    const user = await User.findOne({ where: { email } });
    
    if (user) {
      console.log('→ Found in User table, role:', user.role);
      req.body.role = user.role; // Set role from database
      return authController.loginUser(req, res);
    }
    
    // Not found in either table
    console.log('❌ User not found:', email);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
    
  } catch (error) {
    console.error('❌ Login route error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// ===================================================
// PROTECTED ROUTES
// ===================================================
router.get('/me', authMiddleware, authController.getCurrentUser);

router.post('/logout', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;