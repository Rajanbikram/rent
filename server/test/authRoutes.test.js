const request = require('supertest');
const app = require('../server'); // Import your Express app

describe('Auth API Endpoints', () => {
  let sellerId;
  let userId;
  let sellerToken;
  let userToken;

  // ========================================================
  // SELLER REGISTRATION TEST
  // ========================================================
  describe('POST /api/auth/seller/register', () => {
    it('should create a new seller', async () => {
      const res = await request(app)
        .post('/api/auth/seller/register')
        .send({
          name: 'Test Seller',
          email: 'testseller@example.com',
          password: 'password123',
          bio: 'Test seller bio'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.seller).toHaveProperty('id');
      expect(res.body.seller).toHaveProperty('email', 'testseller@example.com');
      
      sellerId = res.body.seller.id;
      sellerToken = res.body.token;
    });

    it('should return 400 if seller already exists', async () => {
      const res = await request(app)
        .post('/api/auth/seller/register')
        .send({
          name: 'Test Seller',
          email: 'testseller@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('already exists');
    });
  });

  // ========================================================
  // SELLER LOGIN TEST
  // ========================================================
  describe('POST /api/auth/seller/login', () => {
    it('should login seller successfully', async () => {
      const res = await request(app)
        .post('/api/auth/seller/login')
        .send({
          email: 'testseller@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.seller).toHaveProperty('email', 'testseller@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/seller/login')
        .send({
          email: 'testseller@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });
  });

  // ========================================================
  // USER (RENTER) REGISTRATION TEST
  // ========================================================
  describe('POST /api/auth/user/register', () => {
    it('should create a new user (renter)', async () => {
      const res = await request(app)
        .post('/api/auth/user/register')
        .send({
          fullName: 'Test Renter',
          email: 'testrenter@example.com',
          password: 'password123',
          role: 'renter',
          isStudent: true
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('role', 'renter');
      
      userId = res.body.user.id;
      userToken = res.body.token;
    });

    it('should return 400 if user already exists', async () => {
      const res = await request(app)
        .post('/api/auth/user/register')
        .send({
          fullName: 'Test Renter',
          email: 'testrenter@example.com',
          password: 'password123',
          role: 'renter'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already exists');
    });
  });

  // ========================================================
  // USER (RENTER) LOGIN TEST
  // ========================================================
  describe('POST /api/auth/user/login', () => {
    it('should login user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: 'testrenter@example.com',
          password: 'password123',
          role: 'renter'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('role', 'renter');
    });

    it('should return 401 for invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: 'testrenter@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should return 403 for role mismatch', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: 'testrenter@example.com',
          password: 'password123',
          role: 'admin'
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('not registered as admin');
    });
  });

  // ========================================================
  // ADMIN REGISTRATION TEST
  // ========================================================
  describe('POST /api/auth/user/register - Admin', () => {
    it('should create a new admin user', async () => {
      const res = await request(app)
        .post('/api/auth/user/register')
        .send({
          fullName: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.user).toHaveProperty('role', 'admin');
    });
  });

  // ========================================================
  // ADMIN LOGIN TEST
  // ========================================================
  describe('POST /api/auth/user/login - Admin', () => {
    it('should login admin successfully', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.user).toHaveProperty('role', 'admin');
    });
  });

  // ========================================================
  // GENERIC REGISTER ROUTE TEST
  // ========================================================
  describe('POST /api/auth/register (Generic)', () => {
    it('should route to seller registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Generic Seller',
          email: 'genericseller@example.com',
          password: 'password123',
          role: 'seller'
        });

      expect(res.status).toBe(201);
      expect(res.body.seller).toHaveProperty('role', 'seller');
    });

    it('should route to user registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Generic User',
          email: 'genericuser@example.com',
          password: 'password123',
          role: 'renter'
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('role', 'renter');
    });

    it('should return 400 for invalid role', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'invalid_role'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid role');
    });
  });

  // ========================================================
  // GENERIC LOGIN ROUTE TEST (AUTO DETECT)
  // ========================================================
  describe('POST /api/auth/login (Generic - Auto Detect)', () => {
    it('should auto-detect and login seller', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testseller@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.seller).toHaveProperty('role', 'seller');
    });

    it('should auto-detect and login renter', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testrenter@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.user).toHaveProperty('role', 'renter');
    });

    it('should auto-detect and login admin', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123'
        });

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('role', 'admin');
    });

    it('should return 401 if user not found', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });
  });

  // ========================================================
  // GET CURRENT USER TEST (PROTECTED ROUTE)
  // ========================================================
  describe('GET /api/auth/me', () => {
    it('should get current seller profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.user).toHaveProperty('email', 'testseller@example.com');
    });

    it('should get current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('email', 'testrenter@example.com');
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });

  // ========================================================
  // LOGOUT TEST
  // ========================================================
  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('Logged out successfully');
    });
  });
});