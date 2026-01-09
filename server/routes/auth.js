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
// GENERIC ROUTES (Smart Routing Based on Role)
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

// Generic Login - Routes based on role in request body
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  console.log('🔐 Login request received:', { email, role });
  
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email, password and role'
    });
  }
  
  const roleLower = role.toLowerCase();
  
  if (roleLower === 'seller') {
    console.log('→ Routing to seller login');
    return authController.loginSeller(req, res);
  } else if (roleLower === 'admin' || roleLower === 'renter') {
    console.log('→ Routing to user login');
    return authController.loginUser(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be seller, admin, or renter'
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