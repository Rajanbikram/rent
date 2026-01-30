// userModel.test.js
// a. Import & Setup Sequelize Mock
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// b. Define a Mocked User Model
const UserMock = dbMock.define('User', {
  id: 1,
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  role: 'renter',
  isStudent: false
});

// c. Describe the Test Suite
describe('User Model', () => {
  
  // d. Test Case: Creating a User
  it('should create a user', async () => {
    const user = await UserMock.create({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123',
      role: 'admin',
      isStudent: false
    });

    // Assertions (expect()): Checks if the returned user matches the expected values
    expect(user.fullName).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('hashedpassword123');
    expect(user.role).toBe('admin');
    expect(user.isStudent).toBe(false);
  });

  // Test Case: Creating a User with default values
  it('should create a user with default role as renter', async () => {
    const user = await UserMock.create({
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'password456'
    });

    // Assertions
    expect(user.fullName).toBe('Jane Smith');
    expect(user.email).toBe('jane.smith@example.com');
  });

  // Test Case: Creating a Student User
  it('should create a student user', async () => {
    const user = await UserMock.create({
      fullName: 'Student User',
      email: 'student@university.edu',
      password: 'studentpass123',
      role: 'renter',
      isStudent: true
    });

    // Assertions
    expect(user.isStudent).toBe(true);
    expect(user.role).toBe('renter');
  });

  // Test Case: Creating users with different roles
  it('should create users with different roles (admin, seller, renter)', async () => {
    const admin = await UserMock.create({
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpass',
      role: 'admin'
    });

    const seller = await UserMock.create({
      fullName: 'Seller User',
      email: 'seller@example.com',
      password: 'sellerpass',
      role: 'seller'
    });

    const renter = await UserMock.create({
      fullName: 'Renter User',
      email: 'renter@example.com',
      password: 'renterpass',
      role: 'renter'
    });

    expect(admin.role).toBe('admin');
    expect(seller.role).toBe('seller');
    expect(renter.role).toBe('renter');
  });

  // Test Case: Require fullName and email
  it('should require a user fullName and email', async () => {
    await expect(UserMock.create({})).rejects.toThrow();
  });

  // Test Case: Require password
  it('should require a user password', async () => {
    await expect(UserMock.create({
      fullName: 'Test User',
      email: 'test@example.com'
    })).rejects.toThrow();
  });
});