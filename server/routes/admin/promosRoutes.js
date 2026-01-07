const express = require('express');
const router = express.Router();
const promosController = require('../../controllers/admin/promosController');
const { authenticateToken, requireAdmin } = require('../../middleware/adminMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', promosController.getAllPromos);
router.post('/', promosController.createPromo);
router.patch('/:id/toggle', promosController.togglePromo);
router.delete('/:id', promosController.deletePromo);

module.exports = router;