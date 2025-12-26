const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// ✅ Generic login route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  console.log('📧 Login request received:', { email, role });
  
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
  } else {
    console.log('→ Routing to user login');
    return authController.loginUser(req, res);
  }
});

// Seller routes
router.post('/seller/register', authController.registerSeller);
router.post('/seller/login', authController.loginSeller);

// User routes
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);

// Protected
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;