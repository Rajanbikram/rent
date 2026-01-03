const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');

dotenv.config();

// ✅ LOAD ASSOCIATIONS
require('./models/rental');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ REQUEST LOGGER - ADD THIS
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  console.log('📨 Auth header:', req.headers.authorization ? 'Present ✅' : 'Missing ❌');
  next();
});

// ==================== ROUTES ====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/seller', require('./routes/sellerRoutes'));
app.use('/api/products', require('./routes/products'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/rental/products', require('./routes/rental/products'));
app.use('/api/rental/cart', require('./routes/rental/cart'));
app.use('/api/rental/favorites', require('./routes/rental/favorites'));
app.use('/api/rental/rentals', require('./routes/rental/rentals'));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, message: 'Server is healthy' });
  } catch (error) {
    res.status(503).json({ success: false, error: error.message });
  }
});

// ==================== ERROR HANDLERS ====================
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.path);
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.path}` 
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  console.error('❌ Stack:', err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});

// ==================== START SERVER ====================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📱 Frontend: http://localhost:5173\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down...');
  await sequelize.close();
  process.exit(0);
});

startServer();

module.exports = app;