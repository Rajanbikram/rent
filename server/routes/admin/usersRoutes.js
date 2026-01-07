const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/admin/usersController');
const { authenticateToken, requireAdmin } = require('../../middleware/adminMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', usersController.getAllUsers);
router.patch('/:id/role', usersController.updateUserRole);
router.patch('/:id/ban', usersController.banUser);
router.get('/:id/logs', usersController.getUserLogs);
router.patch('/:id/reset-password', usersController.resetPassword);

module.exports = router;