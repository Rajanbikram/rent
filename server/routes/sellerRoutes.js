const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

const { authMiddleware, isSellerMiddleware } = require('../middleware/authMiddleware');

// All routes require authentication and seller role
router.use(authMiddleware);
router.use(isSellerMiddleware);

// Dashboard
router.get('/dashboard', sellerController.getDashboard);

// Profile
router.get('/profile', sellerController.getProfile);
router.put('/profile', sellerController.updateProfile);

// Listings
router.get('/listings', sellerController.getListings);
router.post('/listings', sellerController.createListing); // ← NEW: Create listing route
router.put('/listings/:id/toggle-status', sellerController.toggleListingStatus);

// Messages
router.get('/messages', sellerController.getMessages);
router.put('/messages/:id/reply', sellerController.replyToMessage);
router.put('/messages/:id/read', sellerController.markMessageRead);

// Rental History
router.get('/rental-history', sellerController.getRentalHistory);

// Earnings
router.get('/earnings', sellerController.getEarnings);

module.exports = router;