const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Initialize models that use factory pattern
const Seller = require('./Seller');
const RentalHistory = require('./RentalHistory')(sequelize, DataTypes);
const Earning = require('./Earning')(sequelize, DataTypes);

// Import models that are already initialized (no factory pattern)
const Listing = require('./Listing');  // ✅ FIXED - removed (sequelize, DataTypes)
const Deal = require('./Deal');
const Product = require('./Product');
const User = require('./User');

// Define associations
Seller.hasMany(Listing, { foreignKey: 'sellerId', as: 'listings' });
Listing.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

Seller.hasMany(RentalHistory, { foreignKey: 'sellerId', as: 'rentals' });
RentalHistory.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

Listing.hasMany(RentalHistory, { foreignKey: 'listingId', as: 'rentals' });
RentalHistory.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

Seller.hasMany(Earning, { foreignKey: 'sellerId', as: 'earnings' });
Earning.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

module.exports = { 
  sequelize, 
  Seller, 
  Listing, 
  RentalHistory, 
  Deal, 
  Product, 
  User, 
  Earning 
};