const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'renteasy_nepal',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

// Import models from same folder
const Admin = require('./Admin')(sequelize);
const Listing = require('./Listing')(sequelize);
const Order = require('./Order')(sequelize);
const Payment = require('./Payment')(sequelize);
const PromoCode = require('./Promocode')(sequelize);
const StudentVerification = require('./StudentVerification')(sequelize);
const LoginLog = require('./LoginLog')(sequelize);

// Define associations
Order.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
StudentVerification.belongsTo(Admin, { foreignKey: 'userId', as: 'user' });
LoginLog.belongsTo(Admin, { foreignKey: 'userId', as: 'user' });

// Export everything including sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  Admin,
  Listing,
  Order,
  Payment,
  PromoCode,
  StudentVerification,
  LoginLog
};