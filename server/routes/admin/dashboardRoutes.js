const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');
const { authMiddleware } = require('../../middleware/authMiddleware');

// ✅ FIXED: Only use authMiddleware (isAdminMiddleware doesn't exist)
router.use(authMiddleware);

// GET /api/admin/dashboard
router.get('/', dashboardController.getDashboard);

module.exports = router;