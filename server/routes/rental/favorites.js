const express = require('express');
const router = express.Router();
const favoriteController = require('../../controllers/rental/favoriteController');
const { authMiddleware, isRenterMiddleware } = require('../../middleware/authMiddleware');

router.use(authMiddleware);
router.use(isRenterMiddleware);

router.get('/', favoriteController.getFavorites);
router.post('/toggle', favoriteController.toggleFavorite);

module.exports = router;