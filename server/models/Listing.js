const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'sellers',
      key: 'id'
    },
    field: 'seller_id'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pricePerMonth: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_per_month'
  },
  tenureOptions: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'tenure_options'
  },
  tenurePricing: {
    type: DataTypes.JSON,
    defaultValue: {},
    field: 'tenure_pricing'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  deliveryZones: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'delivery_zones'
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'pending'),
    defaultValue: 'pending'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rents: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'listings',
  underscored: true
});

module.exports = Listing;