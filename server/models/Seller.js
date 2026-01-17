const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Seller = sequelize.define('Seller', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT
  },
  avatar: {
    type: DataTypes.STRING
  },
  bankName: {
    type: DataTypes.STRING,
    field: 'bank_name'
  },
  bankAccount: {
    type: DataTypes.STRING,
    field: 'bank_account'
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0.0
  },
  totalListings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_listings'
  },
  totalRentals: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_rentals'
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    field: 'total_earnings'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'sellers',
  timestamps: true,
  underscored: true
});

module.exports = Seller;