const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/rental/cartController');
const { authMiddleware, isRenterMiddleware } = require('../../middleware/authMiddleware');

router.use(authMiddleware);
router.use(isRenterMiddleware);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;