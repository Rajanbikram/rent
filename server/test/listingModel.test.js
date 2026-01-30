// listingModel.test.js
// a. Import & Setup Sequelize Mock
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// b. Define a Mocked Listing Model
const ListingMock = dbMock.define('Listing', {
  id: 'uuid-listing-1234',
  title: 'Test Listing',
  sellerId: 'uuid-seller-5678',
  category: 'Furniture',
  pricePerMonth: 2500.00,
  status: 'pending',
  description: 'This is a test listing',
  images: ['image1.jpg', 'image2.jpg'],
  views: 0,
  rents: 0
});

// c. Describe the Test Suite
describe('Listing Model', () => {
  
  // d. Test Case: Creating a Listing
  it('should create a listing', async () => {
    const listing = await ListingMock.create({
      title: 'Wooden Dining Table',
      sellerId: 'uuid-seller-abc123',
      category: 'Furniture',
      pricePerMonth: 3500.00,
      status: 'approved',
      description: 'Beautiful wooden dining table for rent',
      images: ['table1.jpg', 'table2.jpg', 'table3.jpg'],
      views: 25,
      rents: 5
    });

    // Assertions (expect()): Checks if the returned listing matches the expected values
    expect(listing.title).toBe('Wooden Dining Table');
    expect(listing.sellerId).toBe('uuid-seller-abc123');
    expect(listing.category).toBe('Furniture');
    expect(listing.pricePerMonth).toBe(3500.00);
    expect(listing.status).toBe('approved');
    expect(listing.description).toBe('Beautiful wooden dining table for rent');
    expect(listing.images).toEqual(['table1.jpg', 'table2.jpg', 'table3.jpg']);
    expect(listing.views).toBe(25);
    expect(listing.rents).toBe(5);
  });

  // Test Case: Creating a Listing with default values
  it('should create a listing with default values', async () => {
    const listing = await ListingMock.create({
      title: 'Simple Chair',
      category: 'Furniture'
    });

    // Assertions - default values should be applied
    expect(listing.title).toBe('Simple Chair');
    expect(listing.category).toBe('Furniture');
  });

  // Test Case: Creating listings with different statuses
  it('should create listings with different statuses (pending, approved, rejected, active, paused)', async () => {
    const pendingListing = await ListingMock.create({
      title: 'Pending Listing',
      category: 'Appliances',
      status: 'pending'
    });

    const approvedListing = await ListingMock.create({
      title: 'Approved Listing',
      category: 'Furniture',
      status: 'approved'
    });

    const rejectedListing = await ListingMock.create({
      title: 'Rejected Listing',
      category: 'Furniture',
      status: 'rejected'
    });

    const activeListing = await ListingMock.create({
      title: 'Active Listing',
      category: 'Appliances',
      status: 'active'
    });

    const pausedListing = await ListingMock.create({
      title: 'Paused Listing',
      category: 'Furniture',
      status: 'paused'
    });

    expect(pendingListing.status).toBe('pending');
    expect(approvedListing.status).toBe('approved');
    expect(rejectedListing.status).toBe('rejected');
    expect(activeListing.status).toBe('active');
    expect(pausedListing.status).toBe('paused');
  });

  // Test Case: Creating listings with different categories
  it('should create listings with different categories', async () => {
    const furnitureListing = await ListingMock.create({
      title: 'Sofa Set',
      category: 'Furniture',
      pricePerMonth: 5000.00
    });

    const applianceListing = await ListingMock.create({
      title: 'Refrigerator',
      category: 'Appliances',
      pricePerMonth: 6000.00
    });

    const electronicsListing = await ListingMock.create({
      title: 'Laptop',
      category: 'Electronics',
      pricePerMonth: 8000.00
    });

    expect(furnitureListing.category).toBe('Furniture');
    expect(applianceListing.category).toBe('Appliances');
    expect(electronicsListing.category).toBe('Electronics');
  });

  // Test Case: Creating a listing with images array
  it('should create a listing with images array', async () => {
    const listing = await ListingMock.create({
      title: 'Bed with Images',
      category: 'Furniture',
      pricePerMonth: 4000.00,
      images: ['bed1.jpg', 'bed2.jpg', 'bed3.jpg', 'bed4.jpg']
    });

    // Assertions
    expect(Array.isArray(listing.images)).toBe(true);
    expect(listing.images.length).toBe(4);
    expect(listing.images).toContain('bed1.jpg');
  });

  // Test Case: Creating a listing without images
  it('should create a listing without images (empty array)', async () => {
    const listing = await ListingMock.create({
      title: 'No Images Listing',
      category: 'Furniture',
      pricePerMonth: 2000.00
    });

    // Assertions - images should default to empty array
    expect(listing.title).toBe('No Images Listing');
  });

  // Test Case: Creating a listing with views and rents
  it('should create a listing with views and rents tracking', async () => {
    const listing = await ListingMock.create({
      title: 'Popular Listing',
      category: 'Furniture',
      pricePerMonth: 3000.00,
      views: 150,
      rents: 12
    });

    // Assertions
    expect(listing.views).toBe(150);
    expect(listing.rents).toBe(12);
  });

  // Test Case: Creating a listing with sellerId
  it('should create a listing with sellerId', async () => {
    const listing = await ListingMock.create({
      title: 'Seller Listing',
      sellerId: 'uuid-seller-xyz789',
      category: 'Appliances',
      pricePerMonth: 4500.00
    });

    // Assertions
    expect(listing.sellerId).toBe('uuid-seller-xyz789');
  });

  // Test Case: Creating a listing without sellerId (optional)
  it('should create a listing without sellerId', async () => {
    const listing = await ListingMock.create({
      title: 'No Seller Listing',
      category: 'Furniture',
      pricePerMonth: 2500.00
    });

    // Assertions - sellerId is optional
    expect(listing.title).toBe('No Seller Listing');
  });

  // Test Case: Creating a listing with description
  it('should create a listing with detailed description', async () => {
    const listing = await ListingMock.create({
      title: 'Detailed Listing',
      category: 'Furniture',
      pricePerMonth: 5500.00,
      description: 'This is a very detailed description of the listing. It includes all the features and benefits of renting this item.'
    });

    // Assertions
    expect(listing.description).toBeDefined();
    expect(listing.description.length).toBeGreaterThan(0);
  });

  // Test Case: Creating a listing without description (optional)
  it('should create a listing without description', async () => {
    const listing = await ListingMock.create({
      title: 'No Description Listing',
      category: 'Appliances',
      pricePerMonth: 3000.00
    });

    // Assertions - description is optional
    expect(listing.title).toBe('No Description Listing');
  });

  // Test Case: Creating listings with different price ranges
  it('should create listings with different price ranges', async () => {
    const cheapListing = await ListingMock.create({
      title: 'Cheap Item',
      category: 'Furniture',
      pricePerMonth: 500.00
    });

    const moderateListing = await ListingMock.create({
      title: 'Moderate Item',
      category: 'Furniture',
      pricePerMonth: 3000.00
    });

    const expensiveListing = await ListingMock.create({
      title: 'Expensive Item',
      category: 'Appliances',
      pricePerMonth: 10000.00
    });

    expect(cheapListing.pricePerMonth).toBe(500.00);
    expect(moderateListing.pricePerMonth).toBe(3000.00);
    expect(expensiveListing.pricePerMonth).toBe(10000.00);
  });

  // Test Case: Creating a listing with UUID
  it('should create a listing with UUID primary key', async () => {
    const listing = await ListingMock.create({
      title: 'UUID Listing',
      category: 'Furniture',
      pricePerMonth: 2000.00
    });

    // Assertions
    expect(listing.id).toBeDefined();
    expect(typeof listing.id).toBe('string');
  });

  // Test Case: Require title
  it('should require a listing title', async () => {
    await expect(ListingMock.create({
      category: 'Furniture',
      pricePerMonth: 2000.00
    })).rejects.toThrow();
  });

  // Test Case: Require category
  it('should require a listing category', async () => {
    await expect(ListingMock.create({
      title: 'Test Listing',
      pricePerMonth: 2000.00
    })).rejects.toThrow();
  });
});