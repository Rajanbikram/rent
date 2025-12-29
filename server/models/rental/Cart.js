const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database'); // ✅ FIXED

const RentalCart = sequelize.define('RentalCart', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  tenure: { type: DataTypes.INTEGER, defaultValue: 3 }
}, { tableName: 'rental_carts' });

module.exports = RentalCart;