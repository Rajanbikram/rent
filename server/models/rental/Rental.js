const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Rental = sequelize.define('Rental', {
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
  },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  tenure: { type: DataTypes.INTEGER, allowNull: false },
  status: { 
    type: DataTypes.ENUM('booked', 'active', 'ending-soon', 'returned'), 
    defaultValue: 'booked' 
  },
  monthlyRent: { type: DataTypes.INTEGER, allowNull: false },
  totalAmount: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.JSONB, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false }
}, { 
  tableName: 'rentals',
  underscored: true
});

module.exports = Rental;