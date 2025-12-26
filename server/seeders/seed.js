const path = require('path');
const { sequelize } = require(path.join(__dirname, '../config/database'));
const Product = require(path.join(__dirname, '../models/Product'));
const Deal = require(path.join(__dirname, '../models/Deal'));

const seedProducts = [
  {
    title: "Modern Wooden Sofa Set",
    price: 1500,
    location: "Kathmandu",
    category: "Furniture",
    rating: 4.5,
    reviews: 28,
    reviewSnippet: "Perfect for my apartment! Very comfortable and stylish.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    badges: ["Popular"],
    status: "active"
  },
  {
    title: "Luxury King Size Bed",
    price: 1200,
    location: "Kathmandu",
    category: "Furniture",
    rating: 4.8,
    reviews: 42,
    reviewSnippet: "Excellent quality! Worth every rupee for students.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    badges: ["Top Rated", "🎓 Student Favorite"],
    status: "active"
  },
  {
    title: "Smart Washing Machine",
    price: 2500,
    location: "Pokhara",
    category: "Appliances",
    rating: 4.6,
    reviews: 35,
    reviewSnippet: "Reliable machine! Great for busy families.",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop",
    badges: ["Eco-Friendly"],
    status: "active"
  },
  {
    title: "Double Door Refrigerator",
    price: 3000,
    location: "Pokhara",
    category: "Appliances",
    rating: 4.7,
    reviews: 51,
    reviewSnippet: "Energy efficient and spacious. Perfect!",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop",
    badges: ["Energy Star"],
    status: "active"
  },
  {
    title: "Executive Office Desk",
    price: 1800,
    location: "Kathmandu",
    category: "Furniture",
    rating: 4.4,
    reviews: 19,
    reviewSnippet: "Sturdy desk, great for home office setup.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop",
    badges: [],
    status: "active"
  },
  {
    title: "Dining Table Set (6 Seater)",
    price: 2200,
    location: "Kathmandu",
    category: "Furniture",
    rating: 4.9,
    reviews: 63,
    reviewSnippet: "Beautiful design! Family dinners are so much better now.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop",
    badges: ["Bestseller"],
    status: "active"
  },
  {
    title: "Microwave Oven",
    price: 1100,
    location: "Pokhara",
    category: "Appliances",
    rating: 4.3,
    reviews: 24,
    reviewSnippet: "Quick delivery and works perfectly!",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&h=600&fit=crop",
    badges: [],
    status: "active"
  },
  {
    title: "Leather Recliner Chair",
    price: 1600,
    location: "Kathmandu",
    category: "Furniture",
    rating: 4.7,
    reviews: 37,
    reviewSnippet: "Most comfortable chair ever! Love it.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop",
    badges: ["Luxury"],
    status: "active"
  }
];

const seedDeals = [
  {
    title: "Student Special",
    description: "15% off all appliances for students",
    discount: 15,
    image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&h=800&fit=crop",
    badge: "🎓 Student Deal",
    active: true,
    expiryDate: new Date('2025-12-31')
  },
  {
    title: "Weekend Bonanza",
    description: "20% off on furniture this weekend",
    discount: 20,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop",
    badge: "🎉 Weekend Special",
    active: true,
    expiryDate: new Date('2025-12-31')
  },
  {
    title: "New User Offer",
    description: "Get 25% off on your first rental",
    discount: 25,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
    badge: "🎁 First Time",
    active: true,
    expiryDate: new Date('2025-12-31')
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models (recreate tables - WARNING: Deletes all existing data!)
    await sequelize.sync({ force: true });
    console.log('✅ Tables created');

    // Insert products
    const products = await Product.bulkCreate(seedProducts);
    console.log(`✅ Inserted ${products.length} products`);

    // Insert deals
    const deals = await Deal.bulkCreate(seedDeals);
    console.log(`✅ Inserted ${deals.length} deals`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Deals: ${deals.length}`);
    console.log('');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

seedDatabase();