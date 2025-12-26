module.exports = (sequelize, DataTypes) => {
  const RentalHistory = sequelize.define('RentalHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    listingId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sellers',
        key: 'id'
      }
    },
    listingTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    renterName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    earnings: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ongoing', 'completed', 'disputed'),
      defaultValue: 'ongoing'
    }
  }, {
    timestamps: true,
    tableName: 'rental_history'
  });
  
  RentalHistory.associate = (models) => {
    RentalHistory.belongsTo(models.Seller, {
      foreignKey: 'sellerId',
      as: 'seller'
    });
  };
  
  return RentalHistory;
};