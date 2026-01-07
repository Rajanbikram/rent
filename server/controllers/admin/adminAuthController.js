const jwt = require('jsonwebtoken');
const { Admin, LoginLog } = require('../../models/admin');

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate role
    const validRoles = ['admin', 'user', 'seller'];
    const userRole = role && validRoles.includes(role) ? role : 'admin';

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: userRole
    });

    const token = generateToken(admin.id, admin.role);

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Allow login but warn if not admin role
    if (admin.role !== 'admin') {
      console.log(`⚠️  User ${admin.email} logged in with role: ${admin.role}`);
    }

    if (admin.status === 'banned') {
      return res.status(403).json({ error: 'Account has been banned' });
    }

    // Log the login
    await LoginLog.create({
      userId: admin.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    const token = generateToken(admin.id, admin.role);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logout successful' });
};

exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.userId, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};