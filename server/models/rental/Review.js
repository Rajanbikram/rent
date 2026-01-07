const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RentalReview = sequelize.define('RentalReview', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  userName: { type: DataTypes.STRING, allowNull: false },
  rating: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 1, max: 5 } 
  },
  comment: { type: DataTypes.TEXT, allowNull: false },
  productId: { 
    type: DataTypes.UUID,  // ✅ Changed from INTEGER to UUID
    allowNull: false 
  }
}, { 
  tableName: 'rental_reviews',
  underscored: true
});

module.exports = RentalReview;