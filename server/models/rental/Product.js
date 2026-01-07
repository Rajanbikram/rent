const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RentalProduct = sequelize.define('RentalProduct', {
  id: { 
    type: DataTypes.UUID,  // ✅ Changed from INTEGER to UUID
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.ENUM('furniture', 'appliances'), allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
  pricePerMonth: { type: DataTypes.INTEGER, allowNull: false },
  originalPrice: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 4.5 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  location: { type: DataTypes.ENUM('kathmandu', 'pokhara'), allowNull: false },
  badge: { type: DataTypes.ENUM('hotDeal', 'studentOffer', 'limitedTime'), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 10 }
}, { 
  tableName: 'rental_products',
  underscored: true
});

module.exports = RentalProduct;