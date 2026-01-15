const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Listing } = require('../models'); // ✅ Import from models/index.js

// ✅ Get all products (PUBLIC - no auth required)
// Now fetches from Seller's Listing table
router.get('/', async (req, res) => {
  try {
    console.log('📦 Fetching products for guest browse...');
    
    const listings = await Listing.findAll({
      where: { status: 'active' }, // Only show active listings
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found', listings.length, 'active listings');

    // ✅ Transform Listing data to match Product format for frontend compatibility
    const products = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price: parseFloat(listing.pricePerMonth),
      pricePerMonth: parseFloat(listing.pricePerMonth),
      image: listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.jpg',
      images: listing.images || [],
      location: listing.deliveryZones && listing.deliveryZones.length > 0 
        ? listing.deliveryZones[0] 
        : 'Kathmandu',
      deliveryZones: listing.deliveryZones || [],
      tenureOptions: listing.tenureOptions || { 
        threeMonths: true, 
        sixMonths: false, 
        twelveMonths: false 
      },
      tenurePricing: listing.tenurePricing || {
        threeMonths: listing.pricePerMonth,
        sixMonths: Math.round(listing.pricePerMonth * 0.92),
        twelveMonths: Math.round(listing.pricePerMonth * 0.85)
      },
      views: listing.views || 0,
      rents: listing.rents || 0,
      status: listing.status,
      createdAt: listing.createdAt
    }));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// ✅ Get product by ID (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    console.log('📦 Fetching product by ID:', req.params.id);
    
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Transform to product format
    const product = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price: parseFloat(listing.pricePerMonth),
      pricePerMonth: parseFloat(listing.pricePerMonth),
      image: listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.jpg',
      images: listing.images || [],
      location: listing.deliveryZones && listing.deliveryZones.length > 0 
        ? listing.deliveryZones[0] 
        : 'Kathmandu',
      deliveryZones: listing.deliveryZones || [],
      tenureOptions: listing.tenureOptions,
      tenurePricing: listing.tenurePricing,
      views: listing.views || 0,
      rents: listing.rents || 0,
      status: listing.status,
      createdAt: listing.createdAt
    };

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// ✅ Search products (PUBLIC)
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query required'
      });
    }

    console.log('🔍 Searching products:', q);

    const listings = await Listing.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { category: { [Op.iLike]: `%${q}%` } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found', listings.length, 'matching products');

    // Transform to product format
    const products = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price: parseFloat(listing.pricePerMonth),
      pricePerMonth: parseFloat(listing.pricePerMonth),
      image: listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.jpg',
      images: listing.images || [],
      location: listing.deliveryZones && listing.deliveryZones.length > 0 
        ? listing.deliveryZones[0] 
        : 'Kathmandu',
      deliveryZones: listing.deliveryZones || [],
      status: listing.status
    }));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

// Get products by category (PUBLIC)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    console.log('📦 Fetching products by category:', category);

    const listings = await Listing.findAll({
      where: { 
        status: 'active',
        category: { [Op.iLike]: `%${category}%` }
      },
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found', listings.length, 'products in category:', category);

    const products = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price: parseFloat(listing.pricePerMonth),
      pricePerMonth: parseFloat(listing.pricePerMonth),
      image: listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.jpg',
      images: listing.images || [],
      location: listing.deliveryZones && listing.deliveryZones.length > 0 
        ? listing.deliveryZones[0] 
        : 'Kathmandu'
    }));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('❌ Get by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error.message
    });
  }
});

// Get products by location (PUBLIC)
router.get('/location/:location', async (req, res) => {
  try {
    const { location } = req.params;
    
    console.log('📦 Fetching products by location:', location);

    const listings = await Listing.findAll({
      where: { 
        status: 'active',
        deliveryZones: { [Op.contains]: [location] }
      },
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found', listings.length, 'products in location:', location);

    const products = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price: parseFloat(listing.pricePerMonth),
      pricePerMonth: parseFloat(listing.pricePerMonth),
      image: listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.jpg',
      images: listing.images || [],
      location: listing.deliveryZones && listing.deliveryZones.length > 0 
        ? listing.deliveryZones[0] 
        : 'Kathmandu',
      deliveryZones: listing.deliveryZones || []
    }));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('❌ Get by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by location',
      error: error.message
    });
  }
});

module.exports = router;