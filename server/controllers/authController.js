const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Seller, User } = require('../models');

// Seller Registration
const registerSeller = async (req, res) => {
  try {
    const { name, email, password, phone, bio } = req.body;

    console.log('📝 Seller registration attempt:', { email, name });

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password, phone)'
      });
    }

    const existingSeller = await Seller.findOne({ where: { email } });
    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: 'Seller with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bio: bio || '',
      rating: 0,
      totalListings: 0,
      totalRentals: 0,
      totalEarnings: 0,
      isActive: true
    });

    console.log('✅ Seller created:', seller.email);

    const token = jwt.sign(
      { id: seller.id, email: seller.email, role: 'seller' },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Seller registered successfully',
      token,
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        role: 'seller'
      }
    });
  } catch (error) {
    console.error('❌ Seller registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Seller registration failed',
      error: error.message
    });
  }
};

// Seller Login
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Seller login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const seller = await Seller.findOne({ where: { email } });
    
    if (!seller) {
      console.log('❌ Seller not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ Seller found:', seller.email);

    const isPasswordValid = await bcrypt.compare(password, seller.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for seller:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ Password valid, generating token...');

    const token = jwt.sign(
      { id: seller.id, email: seller.email, role: 'seller' },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for seller:', seller.email);

    res.json({
      success: true,
      message: 'Seller login successful',
      token,
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        role: 'seller'
      }
    });
  } catch (error) {
    console.error('❌ Seller login error:', error);
    res.status(500).json({
      success: false,
      message: 'Seller login failed',
      error: error.message
    });
  }
};

// User Registration
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, isStudent } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'renter',
      isStudent: isStudent || false
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'renter' },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: 'renter'
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      message: 'User registration failed',
      error: error.message
    });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        ...req.user.dataValues
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

// ✅ EXPORT ALL FUNCTIONS
module.exports = {
  registerSeller,
  loginSeller,
  registerUser,
  loginUser,
  getCurrentUser
};