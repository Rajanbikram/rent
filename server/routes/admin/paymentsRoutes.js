const express = require('express');
const router = express.Router();
const paymentsController = require('../../controllers/admin/paymentsController');
const { authenticateToken, requireAdmin } = require('../../middleware/adminMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', paymentsController.getAllPayments);
router.post('/calculate-vat', paymentsController.calculateVAT);
router.get('/stats', paymentsController.getPaymentStats);

module.exports = router;