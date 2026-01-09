// server/controllers/rental/productController.js
const { Listing, Seller } = require('../../models');
const { Op } = require('sequelize');

// Get all active listings from ALL sellers for rental home
exports.getAllProducts = async (req, res) => {
  try {
    const { category, location, search, minPrice, maxPrice } = req.query;
    
    console.log('📦 Fetching products with filters:', { category, location, search, minPrice, maxPrice });
    
    // Build where clause
    const where = {
      status: 'active' // Only show active listings
    };
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (minPrice || maxPrice) {
      where.pricePerMonth = {};
      if (minPrice) where.pricePerMonth[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.pricePerMonth[Op.lte] = parseFloat(maxPrice);
    }
    
    // Filter by delivery zones if location provided
    if (location && location !== 'all') {
      // JSON contains query for PostgreSQL
      where.deliveryZones = {
        [Op.contains]: [location]
      };
    }
    
    // Fetch listings with seller info
    const listings = await Listing.findAll({
      where,
      include: [{
        model: Seller,
        as: 'seller',
        attributes: ['id', 'name', 'email', 'rating', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`✅ Found ${listings.length} active listings`);
    
    // Transform to match frontend expectations
    const products = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      name: listing.title, // Some frontend components use 'name'
      description: listing.description,
      category: listing.category,
      pricePerMonth: parseFloat(listing.pricePerMonth),
      price: parseFloat(listing.pricePerMonth), // Alias
      monthlyPrice: parseFloat(listing.pricePerMonth), // Alias
      tenureOptions: listing.tenureOptions || {},
      tenurePricing: listing.tenurePricing || {},
      images: listing.images || [],
      image: listing.images?.[0] || null, // First image as main
      tags: listing.tags || [],
      deliveryZones: listing.deliveryZones || [],
      location: listing.deliveryZones?.[0] || 'Kathmandu', // First zone as location
      views: listing.views || 0,
      rents: listing.rents || 0,
      rating: 4.5, // Default rating (implement reviews later)
      reviews: 89, // Default review count (implement reviews later)
      status: listing.status,
      seller: listing.seller ? {
        id: listing.seller.id,
        name: listing.seller.name,
        rating: parseFloat(listing.seller.rating || 0)
      } : null,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt
    }));
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 Fetching product:', id);
    
    const listing = await Listing.findOne({
      where: { id },
      include: [{
        model: Seller,
        as: 'seller',
        attributes: ['id', 'name', 'email', 'rating', 'avatar', 'bio']
      }]
    });
    
    if (!listing) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
    
    // Increment view count
    await listing.increment('views');
    
    console.log('✅ Product found:', listing.title);
    
    // Transform to frontend format
    const product = {
      id: listing.id,
      title: listing.title,
      name: listing.title,
      description: listing.description,
      category: listing.category,
      pricePerMonth: parseFloat(listing.pricePerMonth),
      price: parseFloat(listing.pricePerMonth),
      monthlyPrice: parseFloat(listing.pricePerMonth),
      tenureOptions: listing.tenureOptions || {},
      tenurePricing: listing.tenurePricing || {},
      images: listing.images || [],
      image: listing.images?.[0] || null,
      tags: listing.tags || [],
      deliveryZones: listing.deliveryZones || [],
      location: listing.deliveryZones?.[0] || 'Kathmandu',
      views: listing.views || 0,
      rents: listing.rents || 0,
      rating: 4.5,
      reviews: 89,
      status: listing.status,
      seller: listing.seller ? {
        id: listing.seller.id,
        name: listing.seller.name,
        email: listing.seller.email,
        rating: parseFloat(listing.seller.rating || 0),
        avatar: listing.seller.avatar,
        bio: listing.seller.bio
      } : null,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt
    };
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Create product (not needed - sellers create via /seller/listings)
exports.createProduct = async (req, res) => {
  res.status(403).json({ 
    success: false,
    message: 'Use /api/seller/listings to create listings' 
  });
};

// Update product (not needed - sellers update via /seller/listings)
exports.updateProduct = async (req, res) => {
  res.status(403).json({ 
    success: false,
    message: 'Use /api/seller/listings to update listings' 
  });
};

// Delete product (not needed - sellers delete via /seller/listings)
exports.deleteProduct = async (req, res) => {
  res.status(403).json({ 
    success: false,
    message: 'Use /api/seller/listings to delete listings' 
  });
};