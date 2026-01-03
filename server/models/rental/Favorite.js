const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RentalFavorite = sequelize.define('RentalFavorite', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER,  // ✅ INTEGER
    allowNull: false,
    field: 'user_id'
  },
  productId: { 
    type: DataTypes.UUID,  // ✅ UUID
    allowNull: false,
    field: 'product_id'
  }
}, { 
  tableName: 'rental_favorites',
  underscored: true
});

module.exports = RentalFavorite;