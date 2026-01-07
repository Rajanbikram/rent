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
    seller: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price_per_month: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),  // ← Remove 'active'
      defaultValue: 'pending'
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'listings',
    timestamps: true
  });

  return Listing;
};