const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/rental/cartController');
const { authMiddleware, isRenterMiddleware } = require('../../middleware/authMiddleware');

// Apply middleware
router.use(authMiddleware);
router.use(isRenterMiddleware);

// Routes
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;