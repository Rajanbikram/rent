const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database'); // ✅ FIXED

const RentalReview = sequelize.define('RentalReview', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userName: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false }
}, { tableName: 'rental_reviews' });

module.exports = RentalReview;