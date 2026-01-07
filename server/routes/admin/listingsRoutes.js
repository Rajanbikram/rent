const express = require('express');
const router = express.Router();
const listingsController = require('../../controllers/admin/listingsController');
const { authenticateToken, requireAdmin } = require('../../middleware/adminMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', listingsController.getAllListings);
router.patch('/:id/approve', listingsController.approveListing);
router.patch('/:id/reject', listingsController.rejectListing);
router.delete('/:id', listingsController.deleteListing);

module.exports = router;