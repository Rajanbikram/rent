const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/admin/adminAuthController');
const { authenticateToken } = require('../../middleware/adminMiddleware');

router.post('/register', adminAuthController.register);
router.post('/login', adminAuthController.login);
router.post('/logout', adminAuthController.logout);
router.get('/profile', authenticateToken, adminAuthController.getProfile);

module.exports = router;