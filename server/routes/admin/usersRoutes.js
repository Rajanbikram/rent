const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/admin/usersController');
const { authMiddleware } = require('../../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Check if user is admin (add this middleware function)
const isAdminMiddleware = (req, res, next) => {
  console.log('🔐 Checking admin role - User:', req.user?.email, 'Role:', req.user?.role);
  
  if (!req.user) {
    console.log('❌ No user in request');
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.role !== 'admin') {
    console.log('❌ Access denied - not an admin');
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }

  console.log('✅ Admin role verified');
  next();
};

// Apply admin check to all routes
router.use(isAdminMiddleware);

// GET /api/admin/users/stats - Get user statistics
router.get('/stats', usersController.getUserStats);

// GET /api/admin/users/all - Get all users and sellers combined
router.get('/all', usersController.getAllUsersAndSellers);

// GET /api/admin/users - Get all users (renters)
router.get('/', usersController.getUsers);

// GET /api/admin/users/sellers - Get all sellers
router.get('/sellers', usersController.getSellers);

// PUT /api/admin/users/:userId/toggle-status - Ban/Unban user or activate/deactivate seller
router.put('/:userId/toggle-status', usersController.toggleUserStatus);

// PUT /api/admin/users/:userId/role - Update user role
router.put('/:userId/role', usersController.updateUserRole);

// DELETE /api/admin/users/:userId - Delete user or seller
router.delete('/:userId', usersController.deleteUser);

module.exports = router;