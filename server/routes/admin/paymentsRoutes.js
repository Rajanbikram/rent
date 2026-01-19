const express = require('express');
const router = express.Router();
const paymentsController = require('../../controllers/admin/paymentsController');
const { authenticateToken, requireAdmin } = require('../../middleware/adminMiddleware');

// Apply middleware
router.use(authenticateToken);
router.use(requireAdmin);

// Routes
router.get('/', paymentsController.getAllPayments);
router.get('/stats', paymentsController.getPaymentStats);
router.get('/:id', paymentsController.getPaymentById);
router.post('/calculate-vat', paymentsController.calculateVAT);
router.patch('/:id/status', paymentsController.updatePaymentStatus);

module.exports = router;