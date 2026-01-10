const Rental = require('../../models/rental/Rental');
const { Listing, Seller } = require('../../models');
const RentalCart = require('../../models/rental/Cart');

exports.getRentals = async (req, res) => {
  try {
    console.log('📋 Fetching rentals for user:', req.user.id);
    
    const rentals = await Rental.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    // ✅ Manually fetch product data for each rental
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
    console.error('Error details:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.createRental = async (req, res) => {
  try {
    const { productId, tenure, address, paymentMethod } = req.body;
    const userId = req.user.id;
    
    console.log('📝 Creating rental:', { userId, productId, tenure, address });
    
    // Find listing
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
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(tenure));
    
    const rental = await Rental.create({
      userId,
      productId,
      startDate,
      endDate,
      tenure: parseInt(tenure),
      status: 'booked',
      monthlyRent: parseFloat(listing.pricePerMonth),
      totalAmount: parseFloat(listing.pricePerMonth) * parseInt(tenure),
      address,
      paymentMethod: paymentMethod || 'cash'
    });
    
    console.log('✅ Rental created successfully:', rental.id);
    
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
    console.error('Error details:', error.message);
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
    console.error('Error details:', error.message);
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
    console.error('Error details:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};