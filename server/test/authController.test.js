const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const { Seller, User } = require('../models');

// Mock the models
jest.mock('../models', () => ({
  Seller: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  }
}));

// Mock bcrypt
jest.mock('bcryptjs');

// Mock jwt
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create mock request and response objects
    mockRequest = {
      body: {},
      user: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  // ========== SELLER REGISTRATION TESTS ==========
  describe('registerSeller', () => {
    it('should register a new seller successfully', async () => {
      const sellerData = {
        name: 'Test Seller',
        email: 'seller@test.com',
        password: 'password123',
        bio: 'Test bio'
      };

      mockRequest.body = sellerData;

      Seller.findOne.mockResolvedValue(null); // No existing seller
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      Seller.create.mockResolvedValue({
        id: 1,
        name: 'Test Seller',
        email: 'seller@test.com',
        password: 'hashedPassword123',
        bio: 'Test bio',
        rating: 0,
        totalListings: 0,
        totalRentals: 0,
        totalEarnings: 0,
        isActive: true
      });
      jwt.sign.mockReturnValue('fake-jwt-token');

      await authController.registerSeller(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Seller registered successfully',
          token: 'fake-jwt-token',
          seller: expect.objectContaining({
            id: 1,
            name: 'Test Seller',
            email: 'seller@test.com',
            role: 'seller'
          })
        })
      );
    });

    it('should return 400 if required fields are missing', async () => {
      mockRequest.body = {
        email: 'seller@test.com'
        // Missing name and password
      };

      await authController.registerSeller(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide all required fields (name, email, password)'
      });
    });

    it('should return 400 if seller already exists', async () => {
      mockRequest.body = {
        name: 'Test Seller',
        email: 'existing@test.com',
        password: 'password123'
      };

      Seller.findOne.mockResolvedValue({
        id: 1,
        email: 'existing@test.com'
      });

      await authController.registerSeller(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Seller with this email already exists'
      });
    });
  });

  // ========== SELLER LOGIN TESTS ==========
  describe('loginSeller', () => {
    it('should login seller successfully', async () => {
      mockRequest.body = {
        email: 'seller@test.com',
        password: 'password123'
      };

      const mockSeller = {
        id: 1,
        name: 'Test Seller',
        email: 'seller@test.com',
        password: 'hashedPassword123',
        isActive: true
      };

      Seller.findOne.mockResolvedValue(mockSeller);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await authController.loginSeller(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Seller login successful',
        token: 'fake-jwt-token',
        seller: {
          id: 1,
          name: 'Test Seller',
          email: 'seller@test.com',
          role: 'seller'
        }
      });
    });

    it('should return 400 if email or password is missing', async () => {
      mockRequest.body = {
        email: 'seller@test.com'
        // Missing password
      };

      await authController.loginSeller(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide email and password'
      });
    });

    it('should return 401 if seller not found', async () => {
      mockRequest.body = {
        email: 'notfound@test.com',
        password: 'password123'
      };

      Seller.findOne.mockResolvedValue(null);

      await authController.loginSeller(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });

    it('should return 403 if seller account is deactivated', async () => {
      mockRequest.body = {
        email: 'seller@test.com',
        password: 'password123'
      };

      Seller.findOne.mockResolvedValue({
        id: 1,
        email: 'seller@test.com',
        isActive: false
      });

      await authController.loginSeller(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    });

    it('should return 401 if password is invalid', async () => {
      mockRequest.body = {
        email: 'seller@test.com',
        password: 'wrongpassword'
      };

      Seller.findOne.mockResolvedValue({
        id: 1,
        email: 'seller@test.com',
        password: 'hashedPassword123',
        isActive: true
      });
      bcrypt.compare.mockResolvedValue(false);

      await authController.loginSeller(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });
  });

  // ========== USER REGISTRATION TESTS ==========
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      mockRequest.body = {
        fullName: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        role: 'renter',
        isStudent: true
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      User.create.mockResolvedValue({
        id: 1,
        fullName: 'Test User',
        email: 'user@test.com',
        password: 'hashedPassword123',
        role: 'renter',
        isStudent: true
      });
      jwt.sign.mockReturnValue('fake-jwt-token');

      await authController.registerUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        token: 'fake-jwt-token',
        user: {
          id: 1,
          fullName: 'Test User',
          email: 'user@test.com',
          role: 'renter',
          isStudent: true
        }
      });
    });

    it('should return 400 if required fields are missing', async () => {
      mockRequest.body = {
        email: 'user@test.com'
        // Missing fullName and password
      };

      await authController.registerUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide all required fields'
      });
    });

    it('should return 400 if user already exists', async () => {
      mockRequest.body = {
        fullName: 'Test User',
        email: 'existing@test.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({
        id: 1,
        email: 'existing@test.com'
      });

      await authController.registerUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User already exists'
      });
    });

    it('should return 400 if invalid role is provided', async () => {
      mockRequest.body = {
        fullName: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        role: 'invalid_role'
      };

      User.findOne.mockResolvedValue(null);

      await authController.registerUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid role. Must be admin or renter'
      });
    });
  });

  // ========== USER LOGIN TESTS ==========
  describe('loginUser', () => {
    it('should login user successfully', async () => {
      mockRequest.body = {
        email: 'user@test.com',
        password: 'password123',
        role: 'renter'
      };

      const mockUser = {
        id: 1,
        fullName: 'Test User',
        email: 'user@test.com',
        password: 'hashedPassword123',
        role: 'renter',
        isStudent: true
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await authController.loginUser(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        token: 'fake-jwt-token',
        user: {
          id: 1,
          fullName: 'Test User',
          email: 'user@test.com',
          role: 'renter',
          isStudent: true
        }
      });
    });

    it('should return 400 if email or password is missing', async () => {
      mockRequest.body = {
        email: 'user@test.com'
        // Missing password
      };

      await authController.loginUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide email and password'
      });
    });

    it('should return 401 if user not found', async () => {
      mockRequest.body = {
        email: 'notfound@test.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);

      await authController.loginUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });

    it('should return 403 if role does not match', async () => {
      mockRequest.body = {
        email: 'user@test.com',
        password: 'password123',
        role: 'admin'
      };

      User.findOne.mockResolvedValue({
        id: 1,
        email: 'user@test.com',
        role: 'renter'
      });

      await authController.loginUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'This account is not registered as admin'
      });
    });

    it('should return 401 if password is invalid', async () => {
      mockRequest.body = {
        email: 'user@test.com',
        password: 'wrongpassword'
      };

      User.findOne.mockResolvedValue({
        id: 1,
        email: 'user@test.com',
        password: 'hashedPassword123',
        role: 'renter'
      });
      bcrypt.compare.mockResolvedValue(false);

      await authController.loginUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });
  });

  // ========== GET CURRENT USER TEST ==========
  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      mockRequest.user = {
        id: 1,
        email: 'user@test.com',
        role: 'renter',
        dataValues: {
          fullName: 'Test User',
          isStudent: true
        }
      };

      await authController.getCurrentUser(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        user: {
          id: 1,
          email: 'user@test.com',
          role: 'renter',
          fullName: 'Test User',
          isStudent: true
        }
      });
    });
  });
});