const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// ✅ Generic register route (routes based on role)
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
  } else {
    console.log('→ Routing to user registration');
    return authController.registerUser(req, res);
  }
});

// ✅ Generic login route (routes based on role)
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

// ✅ Specific Seller routes (optional - for direct access)
router.post('/seller/register', authController.registerSeller);
router.post('/seller/login', authController.loginSeller);

// ✅ Specific User routes (optional - for direct access)
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);

// ✅ Protected route
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;