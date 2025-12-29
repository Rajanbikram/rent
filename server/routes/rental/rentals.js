const express = require('express');
const router = express.Router();
const rentalController = require('../../controllers/rental/rentalController');
const { authMiddleware, isRenterMiddleware } = require('../../middleware/authMiddleware');

router.use(authMiddleware);
router.use(isRenterMiddleware);

router.get('/', rentalController.getRentals);
router.post('/', rentalController.createRental);
router.put('/:id/status', rentalController.updateRentalStatus);
router.put('/:id/renew', rentalController.renewRental);

module.exports = router;