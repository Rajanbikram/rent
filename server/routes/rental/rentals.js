const express = require('express');
const router = express.Router();
const rentalController = require('../../controllers/rental/rentalController');
const { authMiddleware, isRenterMiddleware } = require('../../middleware/authMiddleware');

// Apply auth middleware
router.use(authMiddleware);

// Renter routes (with renter middleware)
router.get('/rentals', isRenterMiddleware, rentalController.getRentals);
router.post('/rentals', isRenterMiddleware, rentalController.createRental);
router.put('/rentals/:id/status', isRenterMiddleware, rentalController.updateRentalStatus);
router.put('/rentals/:id/renew', isRenterMiddleware, rentalController.renewRental);

// ✅ NEW - Seller rental history route (no renter middleware needed)
router.get('/seller-rentals', rentalController.getSellerRentals);

module.exports = router;