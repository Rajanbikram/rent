const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StudentVerification = sequelize.define('StudentVerification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,  // Changed from STRING to UUID
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    university: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    documentUrl: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'student_verifications',
    timestamps: true
  });

  return StudentVerification;
};
