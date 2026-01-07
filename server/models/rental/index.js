const RentalProduct = require('./Product');
const RentalCart = require('./Cart');
const RentalFavorite = require('./Favorite');
const Rental = require('./Rental');
const RentalReview = require('./Review');

// Set up associations
RentalProduct.hasMany(RentalReview, { foreignKey: 'productId' });
RentalReview.belongsTo(RentalProduct, { foreignKey: 'productId' });

module.exports = {
  RentalProduct,
  RentalCart,
  RentalFavorite,
  Rental,
  RentalReview
};