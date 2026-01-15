const Rental = require('../../models/rental/Rental');
const { Listing, Seller, User } = require('../../models');
const RentalCart = require('../../models/rental/Cart');

// Renter's rental history
exports.getRentals = async (req, res) => {
  try {
    console.log('📋 Fetching rentals for user:', req.user.id);
    
    const rentals = await Rental.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    const rentalsWithProducts = await Promise.all(
      rentals.map(async (rental) => {
        const product = await Listing.findByPk(rental.productId, {
          include: [
            { 
              model: Seller, 
              as: 'seller',
              attributes: ['id', 'name', 'rating', 'avatar']
            }
          ]
        });
        
        return {
          ...rental.toJSON(),
          product: product ? product.toJSON() : null
        };
      })
    );
    
    console.log('✅ Rentals found:', rentalsWithProducts.length);
    
    res.json({
      success: true,
      data: rentalsWithProducts
    });
  } catch (error) {
    console.error('❌ Error fetching rentals:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ✅ Seller's rental history
exports.getSellerRentals = async (req, res) => {
  try {
    console.log('📋 Fetching seller rentals for seller:', req.user.id);
    
    const rentals = await Rental.findAll({ 
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    console.log('📦 Found', rentals.length, 'rentals for seller');
    
    const rentalsWithDetails = await Promise.all(
      rentals.map(async (rental) => {
        const product = await Listing.findByPk(rental.productId);
        const renter = await User.findByPk(rental.userId, {
          attributes: ['id', 'fullName', 'email']
        });
        
        return {
          ...rental.toJSON(),
          product: product ? product.toJSON() : null,
          renter: renter ? renter.toJSON() : null
        };
      })
    );
    
    console.log('✅ Seller rentals found:', rentalsWithDetails.length);
    
    res.json({
      success: true,
      data: rentalsWithDetails
    });
  } catch (error) {
    console.error('❌ Error fetching seller rentals:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ✅ UPDATED - Create rental with seller_id
exports.createRental = async (req, res) => {
  try {
    const { productId, tenure, address, paymentMethod } = req.body;
    const userId = req.user.id;
    
    console.log('📝 Creating rental:', { userId, productId, tenure, address });
    
    const listing = await Listing.findByPk(productId);
    
    if (!listing) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
    
    if (listing.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'This listing is not available for rent' 
      });
    }
    
    // ✅ Get seller_id from listing
    const sellerId = listing.sellerId;
    console.log('✅ Seller ID from listing:', sellerId);
    
    if (!sellerId) {
      console.error('❌ Listing has no seller_id!');
      return res.status(500).json({
        success: false,
        error: 'Invalid listing - no seller associated'
      });
    }
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(tenure));
    
    // ✅ Include sellerId when creating rental
    const rental = await Rental.create({
      userId,
      productId,
      sellerId,  // ✅ IMPORTANT - Save seller_id
      startDate,
      endDate,
      tenure: parseInt(tenure),
      status: 'booked',
      monthlyRent: parseFloat(listing.pricePerMonth),
      totalAmount: parseFloat(listing.pricePerMonth) * parseInt(tenure),
      address,
      paymentMethod: paymentMethod || 'cash'
    });
    
    console.log('✅ Rental created successfully with seller_id:', rental.id, 'Seller:', rental.sellerId);
    
    // Clear cart item
    try {
      await RentalCart.destroy({ 
        where: { userId, productId } 
      });
      console.log('✅ Cart cleared');
    } catch (cartError) {
      console.log('⚠️ Cart clear skipped:', cartError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Rental created successfully',
      data: rental
    });
  } catch (error) {
    console.error('❌ Error creating rental:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('🔄 Updating rental status:', { id, status, userId: req.user.id });
    
    const rental = await Rental.findOne({ 
      where: { 
        userId: req.user.id, 
        id 
      } 
    });
    
    if (!rental) {
      return res.status(404).json({ 
        success: false,
        error: 'Rental not found' 
      });
    }
    
    await rental.update({ status });
    
    console.log('✅ Rental status updated');
    
    res.json({
      success: true,
      message: 'Rental status updated',
      data: rental
    });
  } catch (error) {
    console.error('❌ Error updating rental:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.renewRental = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔄 Renewing rental:', { id, userId: req.user.id });
    
    const rental = await Rental.findOne({ 
      where: { 
        userId: req.user.id, 
        id 
      } 
    });
    
    if (!rental) {
      return res.status(404).json({ 
        success: false,
        error: 'Rental not found' 
      });
    }
    
    const newEndDate = new Date(rental.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + rental.tenure);
    
    await rental.update({ 
      endDate: newEndDate, 
      status: 'active' 
    });
    
    console.log('✅ Rental renewed successfully');
    
    res.json({ 
      success: true,
      message: 'Rental renewed successfully', 
      data: rental 
    });
  } catch (error) {
    console.error('❌ Error renewing rental:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};