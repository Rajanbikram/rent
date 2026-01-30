// rentalProductModel.test.js
// a. Import & Setup Sequelize Mock
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// b. Define a Mocked RentalProduct Model
const RentalProductMock = dbMock.define('RentalProduct', {
  id: 'uuid-1234-5678',
  name: 'Test Rental Product',
  category: 'furniture',
  image: 'test-rental.jpg',
  pricePerMonth: 2500,
  originalPrice: 50000,
  rating: 4.5,
  reviewCount: 15,
  location: 'kathmandu',
  badge: 'hotDeal',
  description: 'This is a test rental product',
  stock: 10
});

// c. Describe the Test Suite
describe('RentalProduct Model', () => {
  
  // d. Test Case: Creating a RentalProduct
  it('should create a rental product', async () => {
    const product = await RentalProductMock.create({
      name: 'Wooden Dining Table',
      category: 'furniture',
      image: 'dining-table.jpg',
      pricePerMonth: 3000,
      originalPrice: 75000,
      rating: 4.8,
      reviewCount: 25,
      location: 'kathmandu',
      badge: 'hotDeal',
      description: 'Beautiful wooden dining table for 6 people',
      stock: 5
    });

    // Assertions (expect()): Checks if the returned product matches the expected values
    expect(product.name).toBe('Wooden Dining Table');
    expect(product.category).toBe('furniture');
    expect(product.image).toBe('dining-table.jpg');
    expect(product.pricePerMonth).toBe(3000);
    expect(product.originalPrice).toBe(75000);
    expect(product.rating).toBe(4.8);
    expect(product.reviewCount).toBe(25);
    expect(product.location).toBe('kathmandu');
    expect(product.badge).toBe('hotDeal');
    expect(product.description).toBe('Beautiful wooden dining table for 6 people');
    expect(product.stock).toBe(5);
  });

  // Test Case: Creating a RentalProduct with default values
  it('should create a rental product with default values', async () => {
    const product = await RentalProductMock.create({
      name: 'Simple Chair',
      category: 'furniture',
      image: 'chair.jpg',
      pricePerMonth: 500,
      originalPrice: 8000,
      location: 'pokhara',
      description: 'Comfortable chair for rent'
    });

    // Assertions - default values should be applied
    expect(product.name).toBe('Simple Chair');
    expect(product.pricePerMonth).toBe(500);
    expect(product.location).toBe('pokhara');
  });

  // Test Case: Creating an Appliance Rental Product
  it('should create an appliance rental product', async () => {
    const product = await RentalProductMock.create({
      name: 'Washing Machine',
      category: 'appliances',
      image: 'washing-machine.jpg',
      pricePerMonth: 4500,
      originalPrice: 120000,
      rating: 4.6,
      reviewCount: 40,
      location: 'kathmandu',
      badge: 'studentOffer',
      description: 'Automatic washing machine for rent',
      stock: 8
    });

    // Assertions
    expect(product.category).toBe('appliances');
    expect(product.name).toBe('Washing Machine');
    expect(product.pricePerMonth).toBe(4500);
    expect(product.badge).toBe('studentOffer');
  });

  // Test Case: Creating rental products with different categories
  it('should create rental products with different categories (furniture, appliances)', async () => {
    const furniture = await RentalProductMock.create({
      name: 'Study Desk',
      category: 'furniture',
      image: 'desk.jpg',
      pricePerMonth: 1500,
      originalPrice: 25000,
      location: 'kathmandu',
      description: 'Study desk for students'
    });

    const appliance = await RentalProductMock.create({
      name: 'Refrigerator',
      category: 'appliances',
      image: 'fridge.jpg',
      pricePerMonth: 5000,
      originalPrice: 150000,
      location: 'pokhara',
      description: 'Double door refrigerator'
    });

    expect(furniture.category).toBe('furniture');
    expect(appliance.category).toBe('appliances');
  });

  // Test Case: Creating rental products from different locations
  it('should create rental products from different locations (kathmandu, pokhara)', async () => {
    const kathmanduProduct = await RentalProductMock.create({
      name: 'Kathmandu Sofa',
      category: 'furniture',
      image: 'sofa-ktm.jpg',
      pricePerMonth: 3500,
      originalPrice: 85000,
      location: 'kathmandu',
      description: 'Comfortable sofa set'
    });

    const pokharaProduct = await RentalProductMock.create({
      name: 'Pokhara Bed',
      category: 'furniture',
      image: 'bed-pkr.jpg',
      pricePerMonth: 2500,
      originalPrice: 55000,
      location: 'pokhara',
      description: 'Queen size bed'
    });

    expect(kathmanduProduct.location).toBe('kathmandu');
    expect(pokharaProduct.location).toBe('pokhara');
  });

  // Test Case: Creating rental products with different badges
  it('should create rental products with different badges (hotDeal, studentOffer, limitedTime)', async () => {
    const hotDealProduct = await RentalProductMock.create({
      name: 'Hot Deal Item',
      category: 'furniture',
      image: 'hotdeal.jpg',
      pricePerMonth: 2000,
      originalPrice: 40000,
      location: 'kathmandu',
      badge: 'hotDeal',
      description: 'Special hot deal'
    });

    const studentOfferProduct = await RentalProductMock.create({
      name: 'Student Special',
      category: 'appliances',
      image: 'student.jpg',
      pricePerMonth: 1800,
      originalPrice: 35000,
      location: 'pokhara',
      badge: 'studentOffer',
      description: 'Special offer for students'
    });

    const limitedTimeProduct = await RentalProductMock.create({
      name: 'Limited Offer',
      category: 'furniture',
      image: 'limited.jpg',
      pricePerMonth: 2200,
      originalPrice: 45000,
      location: 'kathmandu',
      badge: 'limitedTime',
      description: 'Limited time offer'
    });

    expect(hotDealProduct.badge).toBe('hotDeal');
    expect(studentOfferProduct.badge).toBe('studentOffer');
    expect(limitedTimeProduct.badge).toBe('limitedTime');
  });

  // Test Case: Creating a rental product without badge
  it('should create a rental product without badge', async () => {
    const product = await RentalProductMock.create({
      name: 'Regular Product',
      category: 'furniture',
      image: 'regular.jpg',
      pricePerMonth: 1000,
      originalPrice: 20000,
      location: 'kathmandu',
      description: 'Regular rental product'
    });

    // Assertions - badge is optional
    expect(product.name).toBe('Regular Product');
    expect(product.pricePerMonth).toBe(1000);
  });

  // Test Case: Creating a rental product with rating and reviewCount
  it('should create a rental product with rating and reviewCount', async () => {
    const product = await RentalProductMock.create({
      name: 'Top Rated Item',
      category: 'appliances',
      image: 'toprated.jpg',
      pricePerMonth: 3500,
      originalPrice: 80000,
      rating: 4.9,
      reviewCount: 100,
      location: 'kathmandu',
      description: 'Highly rated product'
    });

    // Assertions
    expect(product.rating).toBe(4.9);
    expect(product.reviewCount).toBe(100);
  });

  // Test Case: Creating a rental product with stock
  it('should create a rental product with stock quantity', async () => {
    const product = await RentalProductMock.create({
      name: 'Limited Stock Item',
      category: 'furniture',
      image: 'limited-stock.jpg',
      pricePerMonth: 2800,
      originalPrice: 60000,
      location: 'pokhara',
      description: 'Limited stock available',
      stock: 3
    });

    // Assertions
    expect(product.stock).toBe(3);
    expect(product.name).toBe('Limited Stock Item');
  });

  // Test Case: Require name, category, and image
  it('should require a rental product name, category, and image', async () => {
    await expect(RentalProductMock.create({})).rejects.toThrow();
  });

  // Test Case: Require pricePerMonth
  it('should require a rental product pricePerMonth', async () => {
    await expect(RentalProductMock.create({
      name: 'Test Product',
      category: 'furniture',
      image: 'test.jpg'
    })).rejects.toThrow();
  });

  // Test Case: Require originalPrice
  it('should require a rental product originalPrice', async () => {
    await expect(RentalProductMock.create({
      name: 'Test Product',
      category: 'furniture',
      image: 'test.jpg',
      pricePerMonth: 2000
    })).rejects.toThrow();
  });

  // Test Case: Require location
  it('should require a rental product location', async () => {
    await expect(RentalProductMock.create({
      name: 'Test Product',
      category: 'furniture',
      image: 'test.jpg',
      pricePerMonth: 2000,
      originalPrice: 50000
    })).rejects.toThrow();
  });

  // Test Case: Require description
  it('should require a rental product description', async () => {
    await expect(RentalProductMock.create({
      name: 'Test Product',
      category: 'furniture',
      image: 'test.jpg',
      pricePerMonth: 2000,
      originalPrice: 50000,
      location: 'kathmandu'
    })).rejects.toThrow();
  });
});