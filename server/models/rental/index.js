const RentalProduct = require('./Product');
const RentalCart = require('./Cart');
const RentalFavorite = require('./Favorite');
const Rental = require('./Rental');
const RentalReview = require('./Review');

// ===== ASSOCIATIONS =====

// Cart -> Product
RentalCart.belongsTo(RentalProduct, { 
  foreignKey: 'productId', 
  as: 'product' 
});
RentalProduct.hasMany(RentalCart, { 
  foreignKey: 'productId' 
});

// Favorite -> Product
RentalFavorite.belongsTo(RentalProduct, { 
  foreignKey: 'productId', 
  as: 'product' 
});
RentalProduct.hasMany(RentalFavorite, { 
  foreignKey: 'productId' 
});

// Rental -> Product
Rental.belongsTo(RentalProduct, { 
  foreignKey: 'productId', 
  as: 'product' 
});
RentalProduct.hasMany(Rental, { 
  foreignKey: 'productId' 
});

// Review -> Product
RentalReview.belongsTo(RentalProduct, { 
  foreignKey: 'productId' 
});
RentalProduct.hasMany(RentalReview, { 
  foreignKey: 'productId',
  as: 'reviews' 
});

// Export all models
module.exports = {
  RentalProduct,
  RentalCart,
  RentalFavorite,
  Rental,
  RentalReview
};