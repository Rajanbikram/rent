// rentalModel.test.js
// a. Import & Setup Sequelize Mock
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// b. Define a Mocked Rental Model
const RentalMock = dbMock.define('Rental', {
  id: 'uuid-rental-1234',
  userId: 1,
  productId: 'uuid-product-5678',
  sellerId: 'uuid-seller-9012',
  startDate: new Date('2024-02-01'),
  endDate: new Date('2024-08-01'),
  tenure: 6,
  status: 'booked',
  monthlyRent: 3000,
  totalAmount: 18000,
  address: {
    street: 'Test Street',
    city: 'Kathmandu',
    ward: 5,
    zipCode: '44600'
  },
  paymentMethod: 'esewa'
});

// c. Describe the Test Suite
describe('Rental Model', () => {
  
  // d. Test Case: Creating a Rental
  it('should create a rental', async () => {
    const rental = await RentalMock.create({
      userId: 10,
      productId: 'uuid-product-abc123',
      sellerId: 'uuid-seller-def456',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-01'),
      tenure: 6,
      status: 'booked',
      monthlyRent: 5000,
      totalAmount: 30000,
      address: {
        street: 'Lazimpat Road',
        city: 'Kathmandu',
        ward: 3,
        zipCode: '44600'
      },
      paymentMethod: 'khalti'
    });

    // Assertions (expect()): Checks if the returned rental matches the expected values
    expect(rental.userId).toBe(10);
    expect(rental.productId).toBe('uuid-product-abc123');
    expect(rental.sellerId).toBe('uuid-seller-def456');
    expect(rental.tenure).toBe(6);
    expect(rental.status).toBe('booked');
    expect(rental.monthlyRent).toBe(5000);
    expect(rental.totalAmount).toBe(30000);
    expect(rental.paymentMethod).toBe('khalti');
    expect(rental.address.city).toBe('Kathmandu');
  });

  // Test Case: Creating a Rental with default status
  it('should create a rental with default status as booked', async () => {
    const rental = await RentalMock.create({
      userId: 5,
      productId: 'uuid-product-xyz789',
      sellerId: 'uuid-seller-ghi012',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-01'),
      tenure: 6,
      monthlyRent: 4000,
      totalAmount: 24000,
      address: {
        street: 'Thamel',
        city: 'Kathmandu',
        ward: 26,
        zipCode: '44600'
      },
      paymentMethod: 'esewa'
    });

    // Assertions - default status should be 'booked'
    expect(rental.status).toBe('booked');
    expect(rental.userId).toBe(5);
  });

  // Test Case: Creating rentals with different statuses
  it('should create rentals with different statuses (booked, active, ending-soon, returned)', async () => {
    const bookedRental = await RentalMock.create({
      userId: 1,
      productId: 'uuid-product-001',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-11-01'),
      tenure: 6,
      status: 'booked',
      monthlyRent: 2000,
      totalAmount: 12000,
      address: { street: 'Street 1', city: 'Kathmandu', ward: 1, zipCode: '44600' },
      paymentMethod: 'cash'
    });

    const activeRental = await RentalMock.create({
      userId: 2,
      productId: 'uuid-product-002',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-07-01'),
      tenure: 6,
      status: 'active',
      monthlyRent: 3000,
      totalAmount: 18000,
      address: { street: 'Street 2', city: 'Pokhara', ward: 2, zipCode: '33700' },
      paymentMethod: 'bank'
    });

    const endingSoonRental = await RentalMock.create({
      userId: 3,
      productId: 'uuid-product-003',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-06-01'),
      tenure: 6,
      status: 'ending-soon',
      monthlyRent: 4000,
      totalAmount: 24000,
      address: { street: 'Street 3', city: 'Lalitpur', ward: 5, zipCode: '44700' },
      paymentMethod: 'khalti'
    });

    const returnedRental = await RentalMock.create({
      userId: 4,
      productId: 'uuid-product-004',
      startDate: new Date('2023-10-01'),
      endDate: new Date('2024-04-01'),
      tenure: 6,
      status: 'returned',
      monthlyRent: 2500,
      totalAmount: 15000,
      address: { street: 'Street 4', city: 'Kathmandu', ward: 10, zipCode: '44600' },
      paymentMethod: 'esewa'
    });

    expect(bookedRental.status).toBe('booked');
    expect(activeRental.status).toBe('active');
    expect(endingSoonRental.status).toBe('ending-soon');
    expect(returnedRental.status).toBe('returned');
  });

  // Test Case: Creating rentals with different tenures
  it('should create rentals with different tenure periods', async () => {
    const shortTerm = await RentalMock.create({
      userId: 8,
      productId: 'uuid-product-short',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-01'),
      tenure: 3,
      monthlyRent: 5000,
      totalAmount: 15000,
      address: { street: 'Short Street', city: 'Kathmandu', ward: 7, zipCode: '44600' },
      paymentMethod: 'khalti'
    });

    const mediumTerm = await RentalMock.create({
      userId: 9,
      productId: 'uuid-product-medium',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-01'),
      tenure: 6,
      monthlyRent: 4000,
      totalAmount: 24000,
      address: { street: 'Medium Street', city: 'Pokhara', ward: 8, zipCode: '33700' },
      paymentMethod: 'esewa'
    });

    const longTerm = await RentalMock.create({
      userId: 10,
      productId: 'uuid-product-long',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-01-01'),
      tenure: 12,
      monthlyRent: 3500,
      totalAmount: 42000,
      address: { street: 'Long Street', city: 'Kathmandu', ward: 12, zipCode: '44600' },
      paymentMethod: 'bank'
    });

    expect(shortTerm.tenure).toBe(3);
    expect(mediumTerm.tenure).toBe(6);
    expect(longTerm.tenure).toBe(12);
  });

  // Test Case: Creating rentals with different payment methods
  it('should create rentals with different payment methods', async () => {
    const esewaRental = await RentalMock.create({
      userId: 11,
      productId: 'uuid-product-esewa',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-01'),
      tenure: 6,
      monthlyRent: 3000,
      totalAmount: 18000,
      address: { street: 'Esewa Street', city: 'Kathmandu', ward: 5, zipCode: '44600' },
      paymentMethod: 'esewa'
    });

    const khaltiRental = await RentalMock.create({
      userId: 12,
      productId: 'uuid-product-khalti',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-01'),
      tenure: 6,
      monthlyRent: 3500,
      totalAmount: 21000,
      address: { street: 'Khalti Street', city: 'Pokhara', ward: 6, zipCode: '33700' },
      paymentMethod: 'khalti'
    });

    const cashRental = await RentalMock.create({
      userId: 13,
      productId: 'uuid-product-cash',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-01'),
      tenure: 6,
      monthlyRent: 2500,
      totalAmount: 15000,
      address: { street: 'Cash Street', city: 'Lalitpur', ward: 7, zipCode: '44700' },
      paymentMethod: 'cash'
    });

    const bankRental = await RentalMock.create({
      userId: 14,
      productId: 'uuid-product-bank',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-01'),
      tenure: 6,
      monthlyRent: 4000,
      totalAmount: 24000,
      address: { street: 'Bank Street', city: 'Kathmandu', ward: 8, zipCode: '44600' },
      paymentMethod: 'bank'
    });

    expect(esewaRental.paymentMethod).toBe('esewa');
    expect(khaltiRental.paymentMethod).toBe('khalti');
    expect(cashRental.paymentMethod).toBe('cash');
    expect(bankRental.paymentMethod).toBe('bank');
  });

  // Test Case: Creating a rental with JSONB address
  it('should create a rental with complete JSONB address', async () => {
    const rental = await RentalMock.create({
      userId: 20,
      productId: 'uuid-product-address',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-11-01'),
      tenure: 6,
      monthlyRent: 4500,
      totalAmount: 27000,
      address: {
        street: 'Durbar Marg',
        city: 'Kathmandu',
        ward: 1,
        zipCode: '44600',
        landmark: 'Near Narayanhiti Palace'
      },
      paymentMethod: 'khalti'
    });

    // Assertions
    expect(rental.address).toBeDefined();
    expect(rental.address.street).toBe('Durbar Marg');
    expect(rental.address.city).toBe('Kathmandu');
    expect(rental.address.ward).toBe(1);
    expect(rental.address.zipCode).toBe('44600');
    expect(rental.address.landmark).toBe('Near Narayanhiti Palace');
  });

  // Test Case: Creating a rental with sellerId
  it('should create a rental with sellerId', async () => {
    const rental = await RentalMock.create({
      userId: 25,
      productId: 'uuid-product-seller',
      sellerId: 'uuid-seller-123abc',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-01'),
      tenure: 6,
      monthlyRent: 5500,
      totalAmount: 33000,
      address: { street: 'Seller Street', city: 'Kathmandu', ward: 15, zipCode: '44600' },
      paymentMethod: 'bank'
    });

    // Assertions
    expect(rental.sellerId).toBe('uuid-seller-123abc');
  });

  // Test Case: Creating a rental without sellerId (optional)
  it('should create a rental without sellerId', async () => {
    const rental = await RentalMock.create({
      userId: 26,
      productId: 'uuid-product-noseller',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-01'),
      tenure: 6,
      monthlyRent: 3000,
      totalAmount: 18000,
      address: { street: 'No Seller Street', city: 'Pokhara', ward: 10, zipCode: '33700' },
      paymentMethod: 'esewa'
    });

    // Assertions - sellerId is optional
    expect(rental.userId).toBe(26);
    expect(rental.monthlyRent).toBe(3000);
  });

  // Test Case: Calculating total amount from monthly rent and tenure
  it('should calculate total amount correctly', async () => {
    const rental = await RentalMock.create({
      userId: 30,
      productId: 'uuid-product-calc',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-01-01'),
      tenure: 6,
      monthlyRent: 4000,
      totalAmount: 24000, // 4000 * 6 = 24000
      address: { street: 'Calc Street', city: 'Kathmandu', ward: 20, zipCode: '44600' },
      paymentMethod: 'khalti'
    });

    // Assertions
    expect(rental.monthlyRent * rental.tenure).toBe(rental.totalAmount);
    expect(rental.totalAmount).toBe(24000);
  });

  // Test Case: Require userId
  it('should require a rental userId', async () => {
    await expect(RentalMock.create({
      productId: 'uuid-product-test',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-11-01'),
      tenure: 6,
      monthlyRent: 3000,
      totalAmount: 18000,
      address: { street: 'Test', city: 'Kathmandu', ward: 1, zipCode: '44600' },
      paymentMethod: 'esewa'
    })).rejects.toThrow();
  });

  // Test Case: Require productId
  it('should require a rental productId', async () => {
    await expect(RentalMock.create({
      userId: 1,
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-11-01'),
      tenure: 6,
      monthlyRent: 3000,
      totalAmount: 18000,
      address: { street: 'Test', city: 'Kathmandu', ward: 1, zipCode: '44600' },
      paymentMethod: 'esewa'
    })).rejects.toThrow();
  });

  // Test Case: Require startDate
  it('should require a rental startDate', async () => {
    await expect(RentalMock.create({
      userId: 1,
      productId: 'uuid-product-test',
      endDate: new Date('2024-11-01'),
      tenure: 6,
      monthlyRent: 3000,
      totalAmount: 18000,
      address: { street: 'Test', city: 'Kathmandu', ward: 1, zipCode: '44600' },
      paymentMethod: 'esewa'
    })).rejects.toThrow();
  });

  // Test Case: Require endDate
  it('should require a rental endDate', async () => {
    await expect(RentalMock.create({
      userId: 1,
      productId: 'uuid-product-test',
      startDate: new Date('2024-05-01'),
      tenure: 6,
      monthlyRent: 3000,
      totalAmount: 18000,
      address: { street: 'Test', city: 'Kathmandu', ward: 1, zipCode: '44600' },
      paymentMethod: 'esewa'
    })).rejects.toThrow();
  });

  // Test Case: Require tenure
  it('should require a rental tenure', async () => {
    await expect(RentalMock.create({
      userId: 1,
      productId: 'uuid-product-test',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-11-01'),
      monthlyRent: 3000,
      totalAmount: 18000,
      address: { street: 'Test', city: 'Kathmandu', ward: 1, zipCode: '44600' },
      paymentMethod: 'esewa'
    })).rejects.toThrow();
  });

  // Test Case: Require monthlyRent
  it('should require a rental monthlyRent', async () => {
    await expect(RentalMock.create({
      userId: 1,
      productId: 'uuid-product-test',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-11-01'),
      tenure: 6,
      totalAmount: 18000,
      address: { street: 'Test', city: 'Kathmandu', ward: 1, zipCode: '44600' },
      paymentMethod: 'esewa'
    })).rejects.toThrow();
  });

  // Test Case: Require totalAmount
  it('should require a rental totalAmount', async () => {
    await expect(RentalMock.create({
      userId: 1,
      productId: 'uuid-product-test',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-11-01'),
      tenure: 6,
      monthlyRent: 3000,
      address: { street: 'Test', city: 'Kathmandu', ward: 1, zipCode: '44600' },
      paymentMethod: 'esewa'
    })).rejects.toThrow();
  });

  // Test Case: Require address
  it('should require a rental address', async () => {
    await expect(RentalMock.create({
      userId: 1,
      productId: 'uuid-product-test',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-11-01'),
      tenure: 6,
      monthlyRent: 3000,
      totalAmount: 18000,
      paymentMethod: 'esewa'
    })).rejects.toThrow();
  });

  // Test Case: Require paymentMethod
  it('should require a rental paymentMethod', async () => {
    await expect(RentalMock.create({
      userId: 1,
      productId: 'uuid-product-test',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-11-01'),
      tenure: 6,
      monthlyRent: 3000,
      totalAmount: 18000,
      address: { street: 'Test', city: 'Kathmandu', ward: 1, zipCode: '44600' }
    })).rejects.toThrow();
  });
});


