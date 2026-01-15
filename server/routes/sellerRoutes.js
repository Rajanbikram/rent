const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { authMiddleware, isSellerMiddleware } = require('../middleware/authMiddleware');

// ✅ Apply middleware to ALL routes
router.use(authMiddleware);
router.use(isSellerMiddleware);

// Dashboard
router.get('/dashboard', sellerController.getDashboard);

// Profile
router.get('/profile', sellerController.getProfile);
router.put('/profile', sellerController.updateProfile);

// Listings
router.get('/listings', sellerController.getListings);
router.post('/listings', sellerController.createListing);
router.put('/listings/:id/toggle-status', sellerController.toggleListingStatus);

// Rental History
router.get('/rental-history', sellerController.getRentalHistory);

// Earnings
router.get('/earnings', sellerController.getEarnings);

module.exports = router;