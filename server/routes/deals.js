const express = require('express');
const router = express.Router();
const { Op } = require('sequelize'); // ← ADD THIS
const Deal = require('../models/Deal');

// Get all active deals (PUBLIC - no auth required)
router.get('/', async (req, res) => {
  try {
    const deals = await Deal.findAll({
      where: { 
        active: true // ← SIMPLIFIED (removed Op.gte check for now)
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: deals
    });
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deals',
      error: error.message
    });
  }
});

// Get deal by ID (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    res.json({
      success: true,
      data: deal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deal',
      error: error.message
    });
  }
});

module.exports = router;