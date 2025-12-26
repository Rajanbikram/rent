const { Seller, Listing, Message, RentalHistory, Earning } = require('../models');

// Get seller dashboard data
const getDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    console.log('📊 getDashboard called for seller ID:', sellerId);

    // ✅ FIXED: Get seller from Seller model (not User model)
    const seller = await Seller.findByPk(sellerId);

    if (!seller) {
      console.log('❌ Seller not found');
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    console.log('✅ Seller found:', seller.email);

    // Get all listings for this seller
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

    // Get messages
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

    // Get rental history
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

    // Get earnings
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

    // Calculate stats
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
        phone: seller.phone,
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
        phone: seller.phone,
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
    const { name, phone, bio, avatar, bankName, bankAccount } = req.body;

    const seller = await Seller.findByPk(req.user.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    await seller.update({
      name: name || seller.name,
      phone: phone || seller.phone,
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
const getRentalHistory = async (req, res) => {
  try {
    const history = await RentalHistory.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get rental history error:', error);
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
  toggleListingStatus,
  getMessages,
  replyToMessage,
  markMessageRead,
  getRentalHistory,
  getEarnings
};