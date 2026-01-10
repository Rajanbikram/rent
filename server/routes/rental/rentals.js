const express = require('express');
const router = express.Router();
const rentalController = require('../../controllers/rental/rentalController');
const { authMiddleware, isRenterMiddleware } = require('../../middleware/authMiddleware');

// Apply middleware
router.use(authMiddleware);
router.use(isRenterMiddleware);

// Routes - NO '/rentals' prefix here!
router.get('/rentals', rentalController.getRentals);
router.post('/rentals', rentalController.createRental);
router.put('/rentals/:id/status', rentalController.updateRentalStatus);
router.put('/rentals/:id/renew', rentalController.renewRental);

module.exports = router;