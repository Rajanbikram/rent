const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Kathmandu'
  },
  category: {
    type: DataTypes.ENUM('Furniture', 'Appliances'),
    allowNull: false,
    defaultValue: 'Furniture'
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    defaultValue: 0
  },
  reviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  reviewSnippet: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'review_snippet'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  badges: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  status: {  // ← THIS MUST BE HERE!
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    allowNull: false,
    defaultValue: 'active'
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'seller_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'products',
  underscored: true,
  timestamps: true
});

module.exports = Product;