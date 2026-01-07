const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/admin/ordersController');
const { authenticateToken, requireAdmin } = require('../../middleware/adminMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', ordersController.getAllOrders);
router.get('/:id', ordersController.getOrderById);
router.patch('/:id/status', ordersController.updateOrderStatus);

module.exports = router;