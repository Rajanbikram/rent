// server/controllers/rental/cartController.js
const RentalCart = require('../../models/rental/Cart');
const { Listing, Seller } = require('../../models');  // ✅ Use Listing instead of RentalProduct

exports.getCart = async (req, res) => {
  try {
    console.log('🛒 Fetching cart for user:', req.user.id);
    
    const items = await RentalCart.findAll({ 
      where: { userId: req.user.id },
      include: [{ 
        model: Listing,  // ✅ Changed from RentalProduct
        as: 'product',
        include: [{
          model: Seller,
          as: 'seller',
          attributes: ['id', 'name', 'rating']
        }]
      }]
    });
    
    console.log('✅ Cart items found:', items.length);
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('❌ Error fetching cart:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, tenure = 3 } = req.body;
    const userId = req.user.id;
    
    console.log('🛒 Adding to cart:', { userId, productId, quantity, tenure });
    
    // Check if product exists and is active
    const listing = await Listing.findByPk(productId);
    
    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    if (listing.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'This product is not available for rent' 
      });
    }
    
    // Check if already in cart
    const existing = await RentalCart.findOne({ 
      where: { userId, productId } 
    });
    
    if (existing) {
      // Update quantity
      existing.quantity = quantity;
      existing.tenure = tenure;
      await existing.save();
      
      console.log('✅ Cart item updated');
      
      return res.json({
        success: true,
        message: 'Cart updated',
        data: existing
      });
    }
    
    // Create new cart item
    const item = await RentalCart.create({ 
      userId, 
      productId, 
      quantity, 
      tenure 
    });
    
    console.log('✅ Added to cart successfully');
    
    res.status(201).json({
      success: true,
      message: 'Added to cart',
      data: item
    });
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity, tenure } = req.body;
    
    const item = await RentalCart.findOne({ 
      where: { 
        userId: req.user.id, 
        id: req.params.id 
      } 
    });
    
    if (!item) {
      return res.status(404).json({ 
        success: false,
        error: 'Cart item not found' 
      });
    }
    
    if (quantity !== undefined) item.quantity = quantity;
    if (tenure !== undefined) item.tenure = tenure;
    
    await item.save();
    
    console.log('✅ Cart item updated');
    
    res.json({
      success: true,
      message: 'Cart item updated',
      data: item
    });
  } catch (error) {
    console.error('❌ Error updating cart:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const deleted = await RentalCart.destroy({ 
      where: { 
        userId: req.user.id, 
        id: req.params.id 
      } 
    });
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        error: 'Cart item not found' 
      });
    }
    
    console.log('✅ Cart item removed');
    
    res.json({ 
      success: true,
      message: 'Item removed from cart' 
    });
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await RentalCart.destroy({ 
      where: { userId: req.user.id } 
    });
    
    console.log('✅ Cart cleared');
    
    res.json({ 
      success: true,
      message: 'Cart cleared' 
    });
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};