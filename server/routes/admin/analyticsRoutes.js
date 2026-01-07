const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/admin/analyticsController');
const { authenticateToken, requireAdmin } = require('../../middleware/adminMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', analyticsController.getAnalytics);

module.exports = router;