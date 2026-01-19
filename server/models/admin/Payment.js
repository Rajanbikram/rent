const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('esewa', 'khalti'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    underscored: false  // ✅ IMPORTANT: Set to false because DB uses camelCase
  });
  
  return Payment;
};