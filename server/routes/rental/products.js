const express = require('express');
const router = express.Router();
const { Listing } = require('../../models'); // ✅ Import from models/index.js
const { Op } = require('sequelize');

// ✅ Get all products for rental (PUBLIC)
const getAllProducts = async (req, res) => {
  try {
    console.log('📦 Fetching rental products...');
    
    const listings = await Listing.findAll({
      where: { status: 'active' },
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found', listings.length, 'active listings');

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
      tags: listing.tags || [],
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
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    console.log('📦 Fetching rental product by ID:', req.params.id);
    
    const listing = await Listing.findOne({
      where: { 
        id: req.params.id,
        status: 'active'
      }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

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
      tags: listing.tags || [],
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
};

// Create product - Not allowed (use seller dashboard)
const createProduct = async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Use seller dashboard to create listings'
  });
};

// Update product - Not allowed (use seller dashboard)
const updateProduct = async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Use seller dashboard to update listings'
  });
};

// Delete product - Not allowed (use seller dashboard)
const deleteProduct = async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Use seller dashboard to delete listings'
  });
};

// Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;