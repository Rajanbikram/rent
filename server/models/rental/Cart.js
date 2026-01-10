// server/models/rental/Cart.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RentalCart = sequelize.define('RentalCart', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  productId: { 
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'listings',
      key: 'id'
    }
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 
  },
  tenure: { 
    type: DataTypes.INTEGER, 
    defaultValue: 3,
    comment: 'Rental duration in months (3, 6, or 12)'
  }
}, { 
  tableName: 'rental_carts',
  underscored: true,
  timestamps: true
});

module.exports = RentalCart;