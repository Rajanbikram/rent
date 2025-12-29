const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');

dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/products');
const dealRoutes = require('./routes/deals');
const rentalProductRoutes = require('./routes/rental/products');
const rentalCartRoutes = require('./routes/rental/Cart');
const rentalFavoritesRoutes = require('./routes/rental/favorites');
const rentalRentalsRoutes = require('./routes/rental/rentals');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Dev logging
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/rental/products', rentalProductRoutes);
app.use('/api/rental/cart', rentalCartRoutes);
app.use('/api/rental/favorites', rentalFavoritesRoutes);
app.use('/api/rental/rentals', rentalRentalsRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, message: 'Server running' });
  } catch (error) {
    res.status(503).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.path}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('✅ Models synced');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API Routes: /api/auth, /api/seller, /api/products, /api/deals, /api/rental/*`);
    });
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    process.exit(1);
  }
};

// ✅ IMPORTANT: Graceful shutdown (prevents data loss)
const shutdown = async (signal) => {
  console.log(`\n${signal} received, closing server...`);
  try {
    await sequelize.close();
    console.log('✅ Database closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Shutdown error:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ✅ IMPORTANT: Handle crashes (helps debugging)
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise:', err);
  if (process.env.NODE_ENV !== 'production') process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

startServer();

module.exports = app;