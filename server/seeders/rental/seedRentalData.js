const { sequelize } = require('../../config/database');
const RentalProduct = require('../../models/rental/Product');
const RentalReview = require('../../models/rental/Review');

const seedProducts = [
  { name: "Modern 3-Seater Sofa", category: "furniture", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop", pricePerMonth: 2500, originalPrice: 3200, rating: 4.8, reviewCount: 124, location: "kathmandu", badge: "hotDeal", description: "Comfortable modern sofa with premium fabric upholstery. Perfect for living rooms." },
  { name: "Queen Size Bed Frame", category: "furniture", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop", pricePerMonth: 1800, originalPrice: 2200, rating: 4.6, reviewCount: 89, location: "kathmandu", badge: "studentOffer", description: "Sturdy wooden bed frame with modern design. Includes headboard." },
  { name: "Samsung Refrigerator 250L", category: "appliances", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop", pricePerMonth: 1500, originalPrice: 1800, rating: 4.7, reviewCount: 156, location: "kathmandu", badge: null, description: "Energy-efficient double door refrigerator with frost-free technology." },
  { name: "Wooden Dining Table Set", category: "furniture", image: "https://images.unsplash.com/photo-1617806787461-102c1bfaaea1?w=400&h=300&fit=crop", pricePerMonth: 2200, originalPrice: 2800, rating: 4.5, reviewCount: 67, location: "pokhara", badge: "limitedTime", description: "6-seater dining table with matching chairs. Solid wood construction." },
  { name: "LG Washing Machine 7kg", category: "appliances", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop", pricePerMonth: 1200, originalPrice: 1500, rating: 4.4, reviewCount: 98, location: "kathmandu", badge: "hotDeal", description: "Front-load washing machine with multiple wash programs." },
  { name: "Study Desk with Chair", category: "furniture", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop", pricePerMonth: 900, originalPrice: 1100, rating: 4.9, reviewCount: 203, location: "kathmandu", badge: "studentOffer", description: "Ergonomic study desk with comfortable chair. Perfect for students." },
  { name: "Split AC 1.5 Ton", category: "appliances", image: "https://images.unsplash.com/photo-1631545806609-12612c0a7b6a?w=400&h=300&fit=crop", pricePerMonth: 2000, originalPrice: 2500, rating: 4.3, reviewCount: 45, location: "pokhara", badge: null, description: "Energy-efficient split AC with fast cooling technology." },
  { name: "Wardrobe 3-Door", category: "furniture", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&h=300&fit=crop", pricePerMonth: 1600, originalPrice: 2000, rating: 4.6, reviewCount: 78, location: "kathmandu", badge: null, description: "Spacious 3-door wardrobe with mirror and multiple compartments." }
];

const seedReviews = [
  { userName: "Aarav S.", rating: 5, comment: "Excellent quality! Delivery was on time." },
  { userName: "Priya K.", rating: 4, comment: "Good product, slight delay in delivery." },
  { userName: "Rajesh M.", rating: 5, comment: "Perfect for my new apartment!" }
];

async function seedRentalData() {
  try {
    console.log('🌱 Starting rental data seeding...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');
    
    // Create products
    const products = await RentalProduct.bulkCreate(seedProducts);
    console.log(`✅ ${products.length} rental products created`);
    
    // Create reviews for each product
    for (const product of products) {
      for (const review of seedReviews) {
        await RentalReview.create({ ...review, productId: product.id });
      }
    }
    console.log('✅ Rental reviews created');
    
    console.log('✅ Rental data seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Rental seeding failed:', error);
    process.exit(1);
  }
}

// ✅ IMPORTANT: Execute the function
seedRentalData();