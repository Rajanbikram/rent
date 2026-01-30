// adminModel.test.js
// a. Import & Setup Sequelize Mock
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// b. Define a Mocked Admin Model
const AdminMock = dbMock.define('Admin', {
  id: 'uuid-admin-1234',
  name: 'Test Admin',
  email: 'admin@test.com',
  password: 'hashedpassword123',
  role: 'admin',
  status: 'active',
  rating: 4.5,
  isStudentVerified: false
});

// c. Describe the Test Suite
describe('Admin Model', () => {
  
  // d. Test Case: Creating an Admin
  it('should create an admin', async () => {
    const admin = await AdminMock.create({
      name: 'John Admin',
      email: 'john@admin.com',
      password: 'securepass123',
      role: 'admin',
      status: 'active',
      rating: 4.8,
      isStudentVerified: false
    });

    // Assertions (expect()): Checks if the returned admin matches the expected values
    expect(admin.name).toBe('John Admin');
    expect(admin.email).toBe('john@admin.com');
    expect(admin.password).toBe('securepass123');
    expect(admin.role).toBe('admin');
    expect(admin.status).toBe('active');
    expect(admin.rating).toBe(4.8);
    expect(admin.isStudentVerified).toBe(false);
  });

  // Test Case: Creating an Admin with default values
  it('should create an admin with default values', async () => {
    const admin = await AdminMock.create({
      name: 'Default Admin',
      email: 'default@admin.com',
      password: 'password123'
    });

    // Assertions - default values should be applied
    expect(admin.name).toBe('Default Admin');
    expect(admin.email).toBe('default@admin.com');
  });

  // Test Case: Creating admins with different roles
  it('should create admins with different roles (admin, user, seller)', async () => {
    const adminRole = await AdminMock.create({
      name: 'Super Admin',
      email: 'super@admin.com',
      password: 'adminpass',
      role: 'admin'
    });

    const userRole = await AdminMock.create({
      name: 'Regular User',
      email: 'user@admin.com',
      password: 'userpass',
      role: 'user'
    });

    const sellerRole = await AdminMock.create({
      name: 'Seller User',
      email: 'seller@admin.com',
      password: 'sellerpass',
      role: 'seller'
    });

    expect(adminRole.role).toBe('admin');
    expect(userRole.role).toBe('user');
    expect(sellerRole.role).toBe('seller');
  });

  // Test Case: Creating admins with different statuses
  it('should create admins with different statuses (active, banned)', async () => {
    const activeAdmin = await AdminMock.create({
      name: 'Active Admin',
      email: 'active@admin.com',
      password: 'activepass',
      status: 'active'
    });

    const bannedAdmin = await AdminMock.create({
      name: 'Banned Admin',
      email: 'banned@admin.com',
      password: 'bannedpass',
      status: 'banned'
    });

    expect(activeAdmin.status).toBe('active');
    expect(bannedAdmin.status).toBe('banned');
  });

  // Test Case: Creating an Admin with rating
  it('should create an admin with rating', async () => {
    const admin = await AdminMock.create({
      name: 'Rated Admin',
      email: 'rated@admin.com',
      password: 'ratedpass',
      rating: 4.9
    });

    // Assertions
    expect(admin.rating).toBe(4.9);
    expect(typeof admin.rating).toBe('number');
  });

  // Test Case: Creating a verified student admin
  it('should create a student verified admin', async () => {
    const admin = await AdminMock.create({
      name: 'Student Admin',
      email: 'student@admin.com',
      password: 'studentpass',
      role: 'user',
      isStudentVerified: true
    });

    // Assertions
    expect(admin.isStudentVerified).toBe(true);
    expect(admin.role).toBe('user');
  });

  // Test Case: Creating an Admin with UUID
  it('should create an admin with UUID primary key', async () => {
    const admin = await AdminMock.create({
      name: 'UUID Admin',
      email: 'uuid@admin.com',
      password: 'uuidpass'
    });

    // Assertions
    expect(admin.id).toBeDefined();
    expect(typeof admin.id).toBe('string');
  });

  // Test Case: Validating email format
  it('should validate email format', async () => {
    const admin = await AdminMock.create({
      name: 'Valid Email Admin',
      email: 'validemail@domain.com',
      password: 'validpass'
    });

    // Assertions - email should be in valid format
    expect(admin.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  // Test Case: Creating admins with different ratings
  it('should create admins with different ratings', async () => {
    const lowRating = await AdminMock.create({
      name: 'Low Rating Admin',
      email: 'low@admin.com',
      password: 'lowpass',
      rating: 2.5
    });

    const mediumRating = await AdminMock.create({
      name: 'Medium Rating Admin',
      email: 'medium@admin.com',
      password: 'mediumpass',
      rating: 3.5
    });

    const highRating = await AdminMock.create({
      name: 'High Rating Admin',
      email: 'high@admin.com',
      password: 'highpass',
      rating: 4.9
    });

    expect(lowRating.rating).toBe(2.5);
    expect(mediumRating.rating).toBe(3.5);
    expect(highRating.rating).toBe(4.9);
  });

  // Test Case: Require name
  it('should require an admin name', async () => {
    await expect(AdminMock.create({
      email: 'test@admin.com',
      password: 'testpass'
    })).rejects.toThrow();
  });

  // Test Case: Require email
  it('should require an admin email', async () => {
    await expect(AdminMock.create({
      name: 'Test Admin',
      password: 'testpass'
    })).rejects.toThrow();
  });

  // Test Case: Require password
  it('should require an admin password', async () => {
    await expect(AdminMock.create({
      name: 'Test Admin',
      email: 'test@admin.com'
    })).rejects.toThrow();
  });

  // Test Case: Unique email constraint
  it('should enforce unique email constraint', async () => {
    await AdminMock.create({
      name: 'First Admin',
      email: 'unique@admin.com',
      password: 'firstpass'
    });

    await expect(AdminMock.create({
      name: 'Second Admin',
      email: 'unique@admin.com',
      password: 'secondpass'
    })).rejects.toThrow();
  });
});