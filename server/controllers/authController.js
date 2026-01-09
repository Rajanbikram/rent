const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Seller, User } = require('../models');

// Seller Registration
const registerSeller = async (req, res) => {
  try {
    // 🔍 DEBUG: Log entire request body
    console.log('🔍 Full Request Body:', JSON.stringify(req.body, null, 2));
    
    const { name, email, password, bio } = req.body;

    console.log('📝 Seller registration attempt:', { 
      email, 
      name,
      hasName: !!name,
      hasEmail: !!email,
      hasPassword: !!password
    });

    // Updated code (without phone)
    if (!name || !email || !password) {
      console.log('❌ Validation Failed! Missing fields:', {
        name: name || 'MISSING',
        email: email || 'MISSING',
        password: password ? 'PROVIDED' : 'MISSING'
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password)'
      });
    }

    const existingSeller = await Seller.findOne({ where: { email } });
    if (existingSeller) {
      console.log('❌ Seller already exists:', email);
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
      bio: bio || '',
      rating: 0,
      totalListings: 0,
      totalRentals: 0,
      totalEarnings: 0,
      isActive: true
    });

    console.log('✅ Seller created successfully:', seller.email);

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
        role: 'seller'
      }
    });
  } catch (error) {
    console.error('❌ Seller registration error:', error);
    console.error('Error stack:', error.stack);
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

// User Registration (Renter/Admin)
const registerUser = async (req, res) => {
  try {
    // 🔍 DEBUG: Log entire request body
    console.log('🔍 Full Request Body:', JSON.stringify(req.body, null, 2));
    
    const { fullName, email, password, role, isStudent } = req.body;

    console.log('📝 User registration attempt:', { 
      email, 
      fullName, 
      role,
      hasFullName: !!fullName,
      hasEmail: !!email,
      hasPassword: !!password
    });

    if (!fullName || !email || !password) {
      console.log('❌ Validation Failed! Missing fields:', {
        fullName: fullName || 'MISSING',
        email: email || 'MISSING',
        password: password ? 'PROVIDED' : 'MISSING'
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // ✅ Check if role is provided and valid
    const userRole = role || 'renter';
    if (!['admin', 'renter'].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin or renter'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('❌ User already exists:', email);
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
      role: userRole,
      isStudent: isStudent || false
    });

    console.log('✅ User created:', user.email, 'Role:', user.role);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
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
        role: user.role,
        isStudent: user.isStudent
      }
    });
  } catch (error) {
    console.error('❌ User registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'User registration failed',
      error: error.message
    });
  }
};

// User Login (Renter/Admin)
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('🔐 User login attempt:', email, 'Role:', role);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ User found:', user.email, 'Role:', user.role);

    // ✅ Check if role matches (if role is provided in login)
    if (role && user.role !== role) {
      console.log('❌ Role mismatch. User role:', user.role, 'Login role:', role);
      return res.status(403).json({
        success: false,
        message: `This account is not registered as ${role}`
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ Password valid, generating token...');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for user:', user.email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isStudent: user.isStudent
      }
    });
  } catch (error) {
    console.error('❌ User login error:', error);
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

module.exports = {
  registerSeller,
  loginSeller,
  registerUser,
  loginUser,
  getCurrentUser
};