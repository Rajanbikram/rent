module.exports = (sequelize, DataTypes) => {
  const Seller = sequelize.define('Seller', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT
    },
    avatar: {
      type: DataTypes.STRING
    },
    bankName: {
      type: DataTypes.STRING
    },
    bankAccount: {
      type: DataTypes.STRING
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0
    },
    totalListings: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalRentals: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalEarnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'sellers'
  });

  Seller.associate = (models) => {
    Seller.hasMany(models.Listing, {
      foreignKey: 'sellerId',
      as: 'listings'
    });
    Seller.hasMany(models.Message, {
      foreignKey: 'sellerId',
      as: 'messages'
    });
    Seller.hasMany(models.RentalHistory, {
      foreignKey: 'sellerId',
      as: 'rentalHistory'
    });
  };

  return Seller;
};