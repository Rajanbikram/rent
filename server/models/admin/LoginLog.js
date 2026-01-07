const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LoginLog = sequelize.define('LoginLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,  // Changed from STRING to UUID
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING
    },
    userAgent: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'login_logs',
    timestamps: true,
    updatedAt: false
  });

  return LoginLog;
};
    