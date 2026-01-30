// productModel.test.js
// a. Import & Setup Sequelize Mock
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// b. Define a Mocked Product Model
const ProductMock = dbMock.define('Product', {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'This is a test product',
  location: 'Kathmandu',
  category: 'Furniture',
  rating: 4.5,
  reviews: 10,
  reviewSnippet: 'Great product!',
  image: 'test.jpg',
  badges: ['Popular', 'Best Seller'],
  status: 'active',
  sellerId: 1
});

// c. Describe the Test Suite
describe('Product Model', () => {
  
  // d. Test Case: Creating a Product
  it('should create a product', async () => {
    const product = await ProductMock.create({
      title: 'Wooden Chair',
      price: 5500.00,
      description: 'Comfortable wooden chair for office',
      location: 'Pokhara',
      category: 'Furniture',
      rating: 4.8,
      reviews: 25,
      reviewSnippet: 'Excellent quality and comfortable',
      image: 'chair.jpg',
      badges: ['Popular', 'Top Rated'],
      status: 'active',
      sellerId: 5
    });

    // Assertions (expect()): Checks if the returned product matches the expected values
    expect(product.title).toBe('Wooden Chair');
    expect(product.price).toBe(5500.00);
    expect(product.description).toBe('Comfortable wooden chair for office');
    expect(product.location).toBe('Pokhara');
    expect(product.category).toBe('Furniture');
    expect(product.rating).toBe(4.8);
    expect(product.reviews).toBe(25);
    expect(product.image).toBe('chair.jpg');
    expect(product.status).toBe('active');
    expect(product.sellerId).toBe(5);
  });

  // Test Case: Creating a Product with default values
  it('should create a product with default values', async () => {
    const product = await ProductMock.create({
      title: 'Simple Table',
      price: 3000.00,
      image: 'table.jpg'
    });

    // Assertions - default values should be applied
    expect(product.title).toBe('Simple Table');
    expect(product.price).toBe(3000.00);
    expect(product.image).toBe('table.jpg');
  });

  // Test Case: Creating an Appliance Product
  it('should create an appliance product', async () => {
    const product = await ProductMock.create({
      title: 'Refrigerator',
      price: 35000.00,
      description: 'Double door refrigerator',
      location: 'Lalitpur',
      category: 'Appliances',
      rating: 4.2,
      reviews: 15,
      image: 'fridge.jpg',
      status: 'active',
      sellerId: 3
    });

    // Assertions
    expect(product.category).toBe('Appliances');
    expect(product.title).toBe('Refrigerator');
    expect(product.price).toBe(35000.00);
  });

  // Test Case: Creating products with different statuses
  it('should create products with different statuses (active, inactive, pending)', async () => {
    const activeProduct = await ProductMock.create({
      title: 'Active Product',
      price: 1000.00,
      image: 'active.jpg',
      status: 'active'
    });

    const inactiveProduct = await ProductMock.create({
      title: 'Inactive Product',
      price: 2000.00,
      image: 'inactive.jpg',
      status: 'inactive'
    });

    const pendingProduct = await ProductMock.create({
      title: 'Pending Product',
      price: 3000.00,
      image: 'pending.jpg',
      status: 'pending'
    });

    expect(activeProduct.status).toBe('active');
    expect(inactiveProduct.status).toBe('inactive');
    expect(pendingProduct.status).toBe('pending');
  });

  // Test Case: Creating products with different categories
  it('should create products with different categories (Furniture, Appliances)', async () => {
    const furniture = await ProductMock.create({
      title: 'Sofa Set',
      price: 25000.00,
      image: 'sofa.jpg',
      category: 'Furniture'
    });

    const appliance = await ProductMock.create({
      title: 'Washing Machine',
      price: 45000.00,
      image: 'washer.jpg',
      category: 'Appliances'
    });

    expect(furniture.category).toBe('Furniture');
    expect(appliance.category).toBe('Appliances');
  });

  // Test Case: Creating a Product with badges
  it('should create a product with badges array', async () => {
    const product = await ProductMock.create({
      title: 'Premium Bed',
      price: 55000.00,
      image: 'bed.jpg',
      badges: ['Premium', 'Best Seller', 'Top Rated']
    });

    // Assertions
    expect(product.badges).toEqual(['Premium', 'Best Seller', 'Top Rated']);
    expect(Array.isArray(product.badges)).toBe(true);
  });

  // Test Case: Creating a Product with rating and reviews
  it('should create a product with rating and reviews', async () => {
    const product = await ProductMock.create({
      title: 'Study Table',
      price: 8000.00,
      image: 'study-table.jpg',
      rating: 4.7,
      reviews: 50,
      reviewSnippet: 'Perfect for students and professionals'
    });

    // Assertions
    expect(product.rating).toBe(4.7);
    expect(product.reviews).toBe(50);
    expect(product.reviewSnippet).toBe('Perfect for students and professionals');
  });

  // Test Case: Creating a Product from different locations
  it('should create products from different locations', async () => {
    const kathmanduProduct = await ProductMock.create({
      title: 'Kathmandu Product',
      price: 5000.00,
      image: 'ktm.jpg',
      location: 'Kathmandu'
    });

    const pokharaProduct = await ProductMock.create({
      title: 'Pokhara Product',
      price: 6000.00,
      image: 'pkr.jpg',
      location: 'Pokhara'
    });

    const lalitpurProduct = await ProductMock.create({
      title: 'Lalitpur Product',
      price: 7000.00,
      image: 'ltp.jpg',
      location: 'Lalitpur'
    });

    expect(kathmanduProduct.location).toBe('Kathmandu');
    expect(pokharaProduct.location).toBe('Pokhara');
    expect(lalitpurProduct.location).toBe('Lalitpur');
  });

  // Test Case: Require title and price
  it('should require a product title and price', async () => {
    await expect(ProductMock.create({})).rejects.toThrow();
  });

  // Test Case: Require image
  it('should require a product image', async () => {
    await expect(ProductMock.create({
      title: 'Test Product',
      price: 1000.00
    })).rejects.toThrow();
  });

  // Test Case: Creating a Product with sellerId
  it('should create a product with sellerId', async () => {
    const product = await ProductMock.create({
      title: 'Seller Product',
      price: 12000.00,
      image: 'seller-product.jpg',
      sellerId: 10
    });

    // Assertions
    expect(product.sellerId).toBe(10);
  });

  // Test Case: Creating a Product without optional description
  it('should create a product without description', async () => {
    const product = await ProductMock.create({
      title: 'No Description Product',
      price: 2500.00,
      image: 'no-desc.jpg'
    });

    // Assertions
    expect(product.title).toBe('No Description Product');
    expect(product.price).toBe(2500.00);
  });
});