const RentalFavorite = require('../../models/rental/Favorite');
const { Listing, Seller } = require('../../models');  // ✅ Changed from RentalProduct

exports.getFavorites = async (req, res) => {
  try {
    console.log('❤️ Fetching favorites for user:', req.user.id);
    
    const favorites = await RentalFavorite.findAll({ 
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
    
    console.log('✅ Favorites found:', favorites.length);
    
    // ✅ Return consistent format
    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('❌ Error fetching favorites:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    
    console.log('❤️ Toggle favorite:', { userId, productId });
    
    // ✅ Check if listing exists
    const listing = await Listing.findByPk(productId);
    
    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    const existing = await RentalFavorite.findOne({ 
      where: { userId, productId } 
    });
    
    if (existing) {
      await existing.destroy();
      console.log('❌ Removed from favorites');
      
      return res.json({ 
        success: true,
        message: 'Removed from favorites', 
        data: { isFavorite: false }
      });
    }
    
    await RentalFavorite.create({ userId, productId });
    console.log('✅ Added to favorites');
    
    res.status(201).json({ 
      success: true,
      message: 'Added to favorites', 
      data: { isFavorite: true }
    });
  } catch (error) {
    console.error('❌ Error toggling favorite:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};