const { Seller, Listing, Message, RentalHistory, Earning } = require('../models');

// Get seller dashboard data
const getDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    console.log('📊 getDashboard called for seller ID:', sellerId);

    const seller = await Seller.findByPk(sellerId);

    if (!seller) {
      console.log('❌ Seller not found');
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    console.log('✅ Seller found:', seller.email);

    let listings = [];
    try {
      listings = await Listing.findAll({
        where: { sellerId }
      });
      console.log('📦 Listings found:', listings.length);
    } catch (error) {
      console.log('⚠️ Error fetching listings:', error.message);
      listings = [];
    }

    let messages = [];
    try {
      messages = await Message.findAll({
        where: { sellerId },
        order: [['createdAt', 'DESC']],
        limit: 50
      });
      console.log('💬 Messages found:', messages.length);
    } catch (error) {
      console.log('⚠️ Error fetching messages:', error.message);
      messages = [];
    }

    let rentalHistory = [];
    try {
      rentalHistory = await RentalHistory.findAll({
        where: { sellerId },
        order: [['createdAt', 'DESC']],
        limit: 100
      });
      console.log('📜 Rental history found:', rentalHistory.length);
    } catch (error) {
      console.log('⚠️ Error fetching rental history:', error.message);
      rentalHistory = [];
    }

    let earnings = [];
    try {
      earnings = await Earning.findAll({
        where: { sellerId },
        order: [['createdAt', 'DESC']]
      });
      console.log('💰 Earnings found:', earnings.length);
    } catch (error) {
      console.log('⚠️ Error fetching earnings:', error.message);
      earnings = [];
    }

    const stats = {
      totalListings: listings.length,
      activeListings: listings.filter(l => l.status === 'active').length,
      pendingListings: listings.filter(l => l.status === 'pending').length,
      pausedListings: listings.filter(l => l.status === 'paused').length,
      totalEarnings: parseFloat(seller.totalEarnings || 0),
      unreadMessages: messages.filter(m => !m.isRead).length,
      totalRentals: rentalHistory.length,
      ongoingRentals: rentalHistory.filter(r => r.status === 'ongoing').length,
      completedRentals: rentalHistory.filter(r => r.status === 'completed').length
    };

    console.log('📊 Stats calculated:', stats);

    const responseData = {
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        bio: seller.bio,
        avatar: seller.avatar,
        bankName: seller.bankName,
        bankAccount: seller.bankAccount,
        rating: parseFloat(seller.rating || 0),
        totalListings: seller.totalListings,
        totalRentals: seller.totalRentals,
        totalEarnings: parseFloat(seller.totalEarnings || 0),
        isActive: seller.isActive
      },
      listings,
      messages,
      rentalHistory,
      earnings,
      stats
    };

    console.log('✅ Sending dashboard data');

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('❌ Dashboard error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard',
      error: error.message
    });
  }
};

// Get seller profile
const getProfile = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.user.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        bio: seller.bio,
        avatar: seller.avatar,
        bankName: seller.bankName,
        bankAccount: seller.bankAccount,
        rating: seller.rating,
        totalListings: seller.totalListings,
        totalRentals: seller.totalRentals,
        totalEarnings: seller.totalEarnings,
        isActive: seller.isActive
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update seller profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar, bankName, bankAccount } = req.body;

    const seller = await Seller.findByPk(req.user.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    await seller.update({
      name: name || seller.name,
      bio: bio || seller.bio,
      avatar: avatar || seller.avatar,
      bankName: bankName || seller.bankName,
      bankAccount: bankAccount || seller.bankAccount
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: seller
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Get seller listings
const getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: listings
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get listings',
      error: error.message
    });
  }
};

// ✅ CREATE NEW LISTING WITH PRICE-BASED STATUS
const createListing = async (req, res) => {
  try {
    const {
      productName,
      description,
      category,
      tags,
      deliveryZones,
      pricePerMonth,
      tenureOptions,
      images
    } = req.body;

    const sellerId = req.user.id;

    console.log('📝 Creating listing for seller:', sellerId);
    console.log('📦 Received data:', { productName, category, pricePerMonth });

    // Validate required fields
    if (!productName || !description || !category || !pricePerMonth) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Product name, description, category, and price are required'
      });
    }

    // Validate price is a positive number
    const price = parseFloat(pricePerMonth);
    console.log('💰 Price received:', pricePerMonth, '→ Parsed:', price);
    
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Get seller info
    const seller = await Seller.findByPk(sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // ✅ PRICE-BASED STATUS LOGIC
    // If price < 10,000 → active (auto-approved)
    // If price >= 10,000 → pending (needs admin approval)
    let listingStatus;

    console.log('🔍 Checking price:', price, 'vs 10000');
    console.log('🔍 price < 10000?', price < 10000);
    console.log('🔍 typeof price:', typeof price);

    if (price < 10000) {
      listingStatus = 'active';
      console.log('✅ AUTO-APPROVED: Price', price, '< NPR 10,000');
    } else {
      listingStatus = 'pending';
      console.log('⏳ NEEDS ADMIN APPROVAL: Price', price, '>= NPR 10,000');
    }
    
    console.log('📝 Final status will be:', listingStatus);

    // Create listing
    const newListing = await Listing.create({
      sellerId,
      title: productName,
      description,
      category,
      tags: Array.isArray(tags) ? tags : [],
      deliveryZones: Array.isArray(deliveryZones) ? deliveryZones : [],
      pricePerMonth: price,
      tenureOptions: tenureOptions || {
        threeMonths: true,
        sixMonths: false,
        twelveMonths: false
      },
      tenurePricing: {
        threeMonths: price,
        sixMonths: Math.round(price * 0.92),
        twelveMonths: Math.round(price * 0.85)
      },
      images: Array.isArray(images) ? images : [],
      status: listingStatus,
      views: 0,
      rents: 0
    });

    console.log('✅ Listing created with ID:', newListing.id);
    console.log('✅ Listing status:', newListing.status);

    // Update seller's total listings count
    const sellerListingCount = seller.totalListings || 0;
    try {
      await seller.update({
        totalListings: sellerListingCount + 1
      });
      console.log('✅ Updated seller listing count:', sellerListingCount + 1);
    } catch (err) {
      console.log('⚠️ Could not update seller listings count:', err.message);
    }

    res.status(201).json({
      success: true,
      message: listingStatus === 'active' 
        ? 'Listing created and published successfully' 
        : 'Listing created and sent for admin approval',
      data: newListing
    });

  } catch (error) {
    console.error('❌ Error creating listing:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create listing',
      error: error.message
    });
  }
};

// Toggle listing status
const toggleListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const listing = await Listing.findOne({
      where: { id, sellerId: req.user.id }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const newStatus = listing.status === 'active' ? 'paused' : 'active';
    await listing.update({ status: newStatus });

    res.json({
      success: true,
      message: `Listing ${newStatus}`,
      data: listing
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle status',
      error: error.message
    });
  }
};

// Get messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages',
      error: error.message
    });
  }
};

// Reply to message
const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const message = await Message.findOne({
      where: { id, sellerId: req.user.id }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.update({ 
      response: reply, 
      isRead: true,
      respondedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Reply message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
};

// Mark message as read
const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findOne({
      where: { id, sellerId: req.user.id }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.update({ isRead: true });

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message
    });
  }
};

// Get rental history
// Get rental history - ✅ UPDATED to fetch from actual Rental table
const getRentalHistory = async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    console.log('📋 Fetching rental history for seller:', sellerId);
    
    // Import models
    const Rental = require('../models/rental/Rental');
    const User = require('../models/User');
    
    // Get all listings by this seller
    const sellerListings = await Listing.findAll({
      where: { sellerId },
      attributes: ['id', 'title', 'pricePerMonth']
    });
    
    const listingIds = sellerListings.map(l => l.id);
    console.log('📦 Seller has', listingIds.length, 'listings');
    
    if (listingIds.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // Get all rentals for these listings
    const rentals = await Rental.findAll({
      where: {
        productId: listingIds
      },
      order: [['createdAt', 'DESC']]
    });
    
    console.log('📋 Found', rentals.length, 'rentals');
    
    // Fetch user and listing details for each rental
    const rentalsWithDetails = await Promise.all(
      rentals.map(async (rental) => {
        // Get renter details
        const renter = await User.findByPk(rental.userId, {
          attributes: ['id', 'fullName', 'email']
        });
        
        // Get listing details
        const listing = sellerListings.find(l => l.id === rental.productId);
        
        return {
          id: rental.id,
          listingId: rental.productId,
          listingTitle: listing ? listing.title : 'Unknown Product',
          renterName: renter ? renter.fullName : 'Unknown User',
          renterEmail: renter ? renter.email : '',
          status: rental.status,
          startDate: rental.startDate,
          endDate: rental.endDate,
          duration: rental.tenure,
          monthlyRent: rental.monthlyRent,
          earnings: rental.totalAmount,
          paymentMethod: rental.paymentMethod,
          address: rental.address,
          createdAt: rental.createdAt
        };
      })
    );
    
    console.log('✅ Rental history prepared');
    
    res.json({
      success: true,
      data: rentalsWithDetails
    });
    
  } catch (error) {
    console.error('❌ Get rental history error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to get rental history',
      error: error.message
    });
  }
};

// Get earnings
const getEarnings = async (req, res) => {
  try {
    const earnings = await Earning.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    const totalEarnings = earnings.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    res.json({
      success: true,
      data: {
        earnings,
        totalEarnings
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get earnings',
      error: error.message
    });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getListings,
  createListing,
  toggleListingStatus,
  getMessages,
  replyToMessage,
  markMessageRead,
  getRentalHistory,
  getEarnings
};