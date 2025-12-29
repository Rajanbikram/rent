const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database'); // ✅ FIXED

const RentalFavorite = sequelize.define('RentalFavorite', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false }
}, { tableName: 'rental_favorites' });

module.exports = RentalFavorite;