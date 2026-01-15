const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Rental = sequelize.define('Rental', {
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
    field: 'product_id'
  },
  sellerId: {
    type: DataTypes.UUID,  // ✅ CHANGED: INTEGER → UUID
    allowNull: true,
    field: 'seller_id'
  },
  startDate: { 
    type: DataTypes.DATE, 
    allowNull: false,
    field: 'start_date'
  },
  endDate: { 
    type: DataTypes.DATE, 
    allowNull: false,
    field: 'end_date'
  },
  tenure: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM('booked', 'active', 'ending-soon', 'returned'), 
    defaultValue: 'booked' 
  },
  monthlyRent: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'monthly_rent'
  },
  totalAmount: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_amount'
  },
  address: { 
    type: DataTypes.JSONB, 
    allowNull: false 
  },
  paymentMethod: { 
    type: DataTypes.STRING, 
    allowNull: false,
    field: 'payment_method'
  }
}, { 
  tableName: 'rentals',
  underscored: true,
  timestamps: true
});

module.exports = Rental;