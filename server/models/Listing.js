module.exports = (sequelize, DataTypes) => {
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
      }
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
      allowNull: false
    },
    tenureOptions: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    tenurePricing: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    deliveryZones: {
      type: DataTypes.JSON,
      defaultValue: []
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
    tableName: 'listings'
  });
  
  return Listing;
};