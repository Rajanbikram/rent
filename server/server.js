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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Rental Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/seller', require('./routes/sellerRoutes'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/deals', require('./routes/deals'));
  app.use('/api/rental/products', require('./routes/rental/products'));
  app.use('/api/rental/cart', require('./routes/rental/cart'));
  app.use('/api/rental/favorites', require('./routes/rental/favorites'));
  app.use('/api/rental/rentals', require('./routes/rental/rentals'));
  console.log('✅ Rental routes loaded');
} catch (err) {
  console.log('⚠️  Rental routes not found');
}

// Admin Routes
app.use('/api/admin/auth', require('./routes/admin/adminAuthRoutes'));
app.use('/api/admin/users', require('./routes/admin/usersRoutes'));
app.use('/api/admin/listings', require('./routes/admin/listingsRoutes'));
app.use('/api/admin/orders', require('./routes/admin/ordersRoutes'));
app.use('/api/admin/payments', require('./routes/admin/paymentsRoutes'));
app.use('/api/admin/verifications', require('./routes/admin/verificationRoutes'));
app.use('/api/admin/promos', require('./routes/admin/promosRoutes'));
app.use('/api/admin/analytics', require('./routes/admin/analyticsRoutes'));

// ==================== ERROR HANDLERS ====================
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.path);
  res.status(404).json({ success: false, message: `Route not found: ${req.path}` });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ==================== START SERVER ====================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // ⚠️ DON'T sync after seeding - it deletes all data!
    // await sequelize.sync({ force: true }); // ❌ This drops all tables and data
    // await sequelize.sync({ alter: true });  // ❌ This also modifies/drops data
    // Only use sync during initial setup, not in production
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server: http://localhost:${PORT}`);
      console.log(`📱 Frontend: http://localhost:5173`);
      console.log(`🔧 Admin: http://localhost:5173/admin/login\n`);
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