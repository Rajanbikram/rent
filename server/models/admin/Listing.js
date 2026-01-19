const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Listing = sequelize.define('Listing', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'seller_id'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pricePerMonth: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'price_per_month'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'active', 'paused'),
      defaultValue: 'pending'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
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
    tableName: 'listings',
    timestamps: true,
    underscored: true
  });

  return Listing;
};