// server/models/rental/index.js
const RentalProduct = require('./Product');
const RentalCart = require('./Cart');
const RentalFavorite = require('./Favorite');
const Rental = require('./Rental');
const RentalReview = require('./Review');

// Import main models to connect with rental models
const { Listing, Seller } = require('../index');

// ==================== ASSOCIATIONS ====================

// Old RentalProduct associations (if still using separate product table)
RentalProduct.hasMany(RentalReview, { foreignKey: 'productId' });
RentalReview.belongsTo(RentalProduct, { foreignKey: 'productId' });

// ✅ RentalCart <-> Listing (using unified Listing table)
RentalCart.belongsTo(Listing, { 
  foreignKey: 'productId', 
  as: 'product' 
});
Listing.hasMany(RentalCart, { 
  foreignKey: 'productId', 
  as: 'carts' 
});

// ✅ RentalFavorite <-> Listing
RentalFavorite.belongsTo(Listing, { 
  foreignKey: 'productId', 
  as: 'product' 
});
Listing.hasMany(RentalFavorite, { 
  foreignKey: 'productId', 
  as: 'favorites' 
});

// ❌ REMOVED: Rental associations with listingId and sellerId
// These columns don't exist in the rentals table!
// Rental uses productId directly, not listingId

module.exports = {
  RentalProduct,
  RentalCart,
  RentalFavorite,
  Rental,
  RentalReview
};