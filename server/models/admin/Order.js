const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    listingId: {
      type: DataTypes.UUID,  // Changed from STRING to UUID
      allowNull: false
    },
    listingTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    renterId: {
      type: DataTypes.UUID,  // Changed from STRING to UUID
      allowNull: false
    },
    renter: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sellerId: {
      type: DataTypes.UUID,  // Changed from STRING to UUID
      allowNull: false
    },
    seller: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('esewa', 'khalti'),
      allowNull: false
    }
  }, {
    tableName: 'orders',
    timestamps: true
  });

  return Order;
};