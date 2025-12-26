const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/products');
const dealRoutes = require('./routes/deals');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/deals', dealRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RentEasy API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      seller: '/api/seller',
      products: '/api/products',
      deals: '/api/deals'
    }
  });
});

// API base route - ADDED THIS
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'RentEasy API',
    version: '1.0.0',
    availableRoutes: [
      '/api/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/seller/dashboard',
      '/api/products',
      '/api/deals'
    ]
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Server is unhealthy',
      database: 'Disconnected',
      error: error.message
    });
  }
});

// 404 handler - must be after all routes
app.use((req, res) => {
  console.log('⚠️ 404 - Route not found:', req.method, req.path);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      '/api',
      '/api/health',
      '/api/auth',
      '/api/seller',
      '/api/products',
      '/api/deals'
    ]
  });
});

// Global error handler - must be last
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err);
  console.error('Error stack:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access'
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Database validation error',
      errors: err.errors.map(e => e.message)
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    console.log('🔄 Starting server...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Sync database models
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { alter: false, force: false } 
      : { alter: true, force: false };
    
    await sequelize.sync(syncOptions);
    console.log('✅ Database models synchronized');

    // Start Express server
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 RentEasy Server Started Successfully');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Server URL: http://localhost:${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('📋 Available Routes:');
      console.log('  GET  /api');
      console.log('  GET  /api/health');
      console.log('  POST /api/auth/login');
      console.log('  POST /api/auth/register');
      console.log('  GET  /api/seller/dashboard');
      console.log('  GET  /api/products');
      console.log('  GET  /api/deals');
      console.log('');
      console.log('💡 To seed database, run: node seeders/seed.js');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  try {
    await sequelize.close();
    console.log('✅ Database connections closed');
    console.log('👋 Server shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle process termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection at:', promise);
  console.error('Reason:', reason);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;