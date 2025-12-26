module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    listingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'listings',
        key: 'id'
      }
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sellers',
        key: 'id'
      }
    },
    renterName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    renterEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    renterAvatar: {
      type: DataTypes.STRING
    },
    query: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    response: {
      type: DataTypes.TEXT
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    respondedAt: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    tableName: 'messages'
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Listing, {
      foreignKey: 'listingId',
      as: 'listing'
    });
    Message.belongsTo(models.Seller, {
      foreignKey: 'sellerId',
      as: 'seller'
    });
  };

  return Message;
};