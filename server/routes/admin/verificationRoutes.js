const express = require('express');
const router = express.Router();
const verificationController = require('../../controllers/admin/verificationController');
const { authenticateToken, requireAdmin } = require('../../middleware/adminMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', verificationController.getAllVerifications);
router.patch('/:id/approve', verificationController.approveVerification);
router.patch('/:id/reject', verificationController.rejectVerification);

module.exports = router;