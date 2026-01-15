const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');

dotenv.config();

// Load rental models if exist
try {
  require('./models/rental');
  console.log('✅ Rental models loaded');
} catch (err) {
  console.log('⚠️  Rental models not found, skipping...');
}

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logger (IMPROVED - less noisy)
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  
  // Only log auth warnings for protected routes
  const publicRoutes = ['/api/rental/products', '/api/products', '/api/deals', '/', '/api/health', '/favicon.ico'];
  const isPublicRoute = publicRoutes.some(route => req.path.startsWith(route));
  
  if (!isPublicRoute) {
    console.log('📨 Auth header:', req.headers.authorization ? 'Present ✅' : 'Missing ❌');
  }
  
  next();
});

// ==================== ROUTES ====================
// Root & Health
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '🎉 RentEasy Nepal API',
    endpoints: {
      admin: '/api/admin/*',
      rental: '/api/rental/*',
      seller: '/api/seller/*',
      auth: '/api/auth/*',
      health: '/api/health'
    }
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, message: 'Server healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ success: false, error: error.message });
  }
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Auth Routes
app.use('/api/auth', require('./routes/auth'));

// ✅ FIXED: Seller Routes - Make sure path is correct
try {
  app.use('/api/seller', require('./routes/sellerRoutes'));
  console.log('✅ Seller routes loaded');
} catch (err) {
  console.error('❌ Error loading seller routes:', err.message);
}

// Product & Deals Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/deals', require('./routes/deals'));

// Rental Routes
app.use('/api/rental/products', require('./routes/rental/products'));
app.use('/api/rental/cart', require('./routes/rental/Cart'));
app.use('/api/rental/favorites', require('./routes/rental/favorites'));
app.use('/api/rental', require('./routes/rental/rentals'));
console.log('✅ Rental routes loaded');

// Admin Routes
app.use('/api/admin/auth', require('./routes/admin/adminAuthRoutes'));
app.use('/api/admin/users', require('./routes/admin/usersRoutes'));
app.use('/api/admin/listings', require('./routes/admin/listingsRoutes'));
app.use('/api/admin/orders', require('./routes/admin/ordersRoutes'));
app.use('/api/admin/payments', require('./routes/admin/paymentsRoutes'));
app.use('/api/admin/verifications', require('./routes/admin/verificationRoutes'));
app.use('/api/admin/promos', require('./routes/admin/promosRoutes'));
app.use('/api/admin/analytics', require('./routes/admin/analyticsRoutes'));
console.log('✅ Admin routes loaded');

// ==================== ERROR HANDLERS ====================
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.path);
  res.status(404).json({ success: false, message: `Route not found: ${req.path}` });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== START SERVER ====================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // ✅ CREATE RENTALS TABLE IF NOT EXISTS (don't use force)
    try {
      const Rental = require('./models/rental/Rental');
      
      // Use alter instead of force to preserve existing data
      await Rental.sync({ alter: true });
      console.log('✅ Rentals table synced');
    } catch (syncError) {
      console.error('⚠️ Rentals table sync error:', syncError.message);
      console.log('💡 You may need to create the rentals table manually');
    }
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server: http://localhost:${PORT}`);
      console.log(`📱 Frontend: http://localhost:5173`);
      console.log(`🔧 Admin: http://localhost:5173/admin/login`);
      console.log(`\n📋 API Routes:`);
      console.log(`   ✅ /api/auth/*`);
      console.log(`   ✅ /api/seller/*`);
      console.log(`   ✅ /api/rental/*`);
      console.log(`   ✅ /api/admin/*\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error.message);
  }
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});

startServer();

module.exports = app;