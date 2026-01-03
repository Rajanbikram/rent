const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RentalCart = sequelize.define('RentalCart', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER,  // ✅ INTEGER (matches users.id)
    allowNull: false,
    field: 'user_id'
  },
  productId: { 
    type: DataTypes.UUID,  // ✅ UUID (matches rental_products.id)
    allowNull: false,
    field: 'product_id'
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 
  },
  tenure: { 
    type: DataTypes.INTEGER, 
    defaultValue: 3 
  }
}, { 
  tableName: 'rental_carts',
  underscored: true
});

module.exports = RentalCart;