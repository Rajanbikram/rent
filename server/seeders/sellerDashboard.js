const bcrypt = require('bcryptjs');
const { Seller, Listing, Message, RentalHistory, sequelize } = require('../models');

const seedSellerDashboard = async () => {
  try {
    console.log('🌱 Starting Seller Dashboard seed...');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models (WARNING: Deletes all existing data!)
    await sequelize.sync({ force: true });
    console.log('✅ Tables created');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // CREATE MULTIPLE SELLERS - Sabai ko same data huncha
    const sellersData = [
      {
        name: 'Rajesh Shrestha',
        email: 'rajesh@renteasynepal.com',
        password: hashedPassword,
        phone: '+977 9841234567',
        bio: 'Trusted seller with 3+ years experience in rental business.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bankName: 'Nepal Investment Bank',
        bankAccount: '****4567',
        rating: 4.8,
        totalListings: 7,
        totalRentals: 5,
        totalEarnings: 94500.00,
        isActive: true
      },
      {
        name: 'Sita Rai',
        email: 'sita@renteasynepal.com',
        password: hashedPassword,
        phone: '+977 9812345678',
        bio: 'Professional seller specializing in home appliances.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        bankName: 'Everest Bank',
        bankAccount: '****7890',
        rating: 4.8,
        totalListings: 7,
        totalRentals: 5,
        totalEarnings: 94500.00,
        isActive: true
      },
      {
        name: 'Ram Prasad',
        email: 'ram@renteasynepal.com',
        password: hashedPassword,
        phone: '+977 9823456789',
        bio: 'Furniture rental expert with quality products.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bankName: 'NIC Asia Bank',
        bankAccount: '****1234',
        rating: 4.8,
        totalListings: 7,
        totalRentals: 5,
        totalEarnings: 94500.00,
        isActive: true
      }
    ];

    console.log('Creating sellers...');
    const sellers = await Seller.bulkCreate(sellersData);
    console.log(`✅ Created ${sellers.length} sellers`);

    // Template listings data - yo sabai sellers ko lagi use huncha
    const getListingsForSeller = (sellerId) => [
      {
        sellerId: sellerId,
        title: 'Premium Leather Sofa Set',
        description: 'Elegant 5-seater leather sofa set perfect for living rooms.',
        category: 'furniture',
        pricePerMonth: 8500,
        tenureOptions: [3, 6, 12],
        tenurePricing: { 3: 8500, 6: 7800, 12: 7000 },
        tags: ['Premium', 'New'],
        deliveryZones: ['Kathmandu Valley'],
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=300&fit=crop'
        ],
        status: 'active',
        views: 1245,
        rents: 15
      },
      {
        sellerId: sellerId,
        title: 'Samsung Refrigerator 350L',
        description: 'Energy-efficient Samsung refrigerator with dual cooling.',
        category: 'appliances',
        pricePerMonth: 4500,
        tenureOptions: [3, 6, 12],
        tenurePricing: { 3: 4500, 6: 4200, 12: 3800 },
        tags: ['Eco-Friendly', 'New'],
        deliveryZones: ['Kathmandu Valley', 'Pokhara'],
        images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop'],
        status: 'active',
        views: 892,
        rents: 8
      },
      {
        sellerId: sellerId,
        title: 'Queen Size Bed with Mattress',
        description: 'Comfortable queen size bed with orthopedic mattress.',
        category: 'furniture',
        pricePerMonth: 3500,
        tenureOptions: [6, 12],
        tenurePricing: { 6: 3200, 12: 2800 },
        tags: ['Refurbished', 'Budget-Friendly'],
        deliveryZones: ['Kathmandu Valley'],
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop'],
        status: 'active',
        views: 2100,
        rents: 22
      },
      {
        sellerId: sellerId,
        title: 'LG Washing Machine 8kg',
        description: 'Fully automatic washing machine with multiple wash programs.',
        category: 'appliances',
        pricePerMonth: 3200,
        tenureOptions: [3, 6, 12],
        tenurePricing: { 3: 3200, 6: 2900, 12: 2500 },
        tags: ['Eco-Friendly', 'Pet-Safe'],
        deliveryZones: ['Kathmandu Valley'],
        images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop'],
        status: 'paused',
        views: 567,
        rents: 5
      },
      {
        sellerId: sellerId,
        title: 'Office Desk & Chair Combo',
        description: 'Ergonomic office setup perfect for home offices.',
        category: 'furniture',
        pricePerMonth: 2800,
        tenureOptions: [3, 6, 12],
        tenurePricing: { 3: 2800, 6: 2500, 12: 2200 },
        tags: ['New', 'Eco-Friendly'],
        deliveryZones: ['Kathmandu Valley', 'Pokhara'],
        images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop'],
        status: 'active',
        views: 1890,
        rents: 18
      },
      {
        sellerId: sellerId,
        title: 'Smart TV 55 inch 4K',
        description: 'Android smart TV with 4K resolution and built-in apps.',
        category: 'electronics',
        pricePerMonth: 5500,
        tenureOptions: [3, 6],
        tenurePricing: { 3: 5500, 6: 5000 },
        tags: ['Premium', 'New'],
        deliveryZones: ['Kathmandu Valley'],
        images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop'],
        status: 'pending',
        views: 0,
        rents: 0
      },
      {
        sellerId: sellerId,
        title: 'Air Conditioner 1.5 Ton',
        description: 'Inverter AC with fast cooling and energy saving mode.',
        category: 'appliances',
        pricePerMonth: 4800,
        tenureOptions: [3, 6, 12],
        tenurePricing: { 3: 4800, 6: 4400, 12: 4000 },
        tags: ['Eco-Friendly'],
        deliveryZones: ['Kathmandu Valley', 'Pokhara'],
        images: ['https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&h=300&fit=crop'],
        status: 'pending',
        views: 0,
        rents: 0
      }
    ];

    // CREATE LISTINGS FOR EACH SELLER
    let allListings = [];
    for (const seller of sellers) {
      const listings = await Listing.bulkCreate(getListingsForSeller(seller.id));
      allListings.push(...listings);
      console.log(`✅ Created ${listings.length} listings for ${seller.name}`);
    }

    // CREATE MESSAGES FOR EACH SELLER
    let totalMessages = 0;
    for (const seller of sellers) {
      const sellerListings = allListings.filter(l => l.sellerId === seller.id);
      
      const messagesData = [
        {
          listingId: sellerListings[0].id,
          sellerId: seller.id,
          renterName: 'Anita Gurung',
          renterEmail: 'anita.gurung@email.com',
          renterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
          query: 'Hi, is the sofa set still available? I am interested in renting for 6 months.',
          isRead: false
        },
        {
          listingId: sellerListings[2].id,
          sellerId: seller.id,
          renterName: 'Bikash Tamang',
          renterEmail: 'bikash.t@email.com',
          renterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          query: 'What is the condition of the mattress?',
          response: 'The mattress is orthopedic and in excellent condition.',
          isRead: true,
          respondedAt: new Date()
        },
        {
          listingId: sellerListings[1].id,
          sellerId: seller.id,
          renterName: 'Suman Maharjan',
          renterEmail: 'suman.m@email.com',
          renterAvatar: '',
          query: 'Can I get this delivered to Bhaktapur?',
          isRead: false
        }
      ];

      await Message.bulkCreate(messagesData);
      totalMessages += messagesData.length;
      console.log(`✅ Created ${messagesData.length} messages for ${seller.name}`);
    }

    // CREATE RENTAL HISTORY FOR EACH SELLER
    let totalRentals = 0;
    for (const seller of sellers) {
      const sellerListings = allListings.filter(l => l.sellerId === seller.id);
      
      const rentalsData = [
        {
          listingId: sellerListings[0].id,
          sellerId: seller.id,
          listingTitle: 'Premium Leather Sofa Set',
          renterName: 'Priya Sharma',
          startDate: new Date('2023-12-01'),
          endDate: new Date('2024-03-01'),
          duration: 3,
          earnings: 25500,
          status: 'ongoing'
        },
        {
          listingId: sellerListings[2].id,
          sellerId: seller.id,
          listingTitle: 'Queen Size Bed with Mattress',
          renterName: 'Ramesh Adhikari',
          startDate: new Date('2023-07-15'),
          endDate: new Date('2024-01-15'),
          duration: 6,
          earnings: 19200,
          status: 'completed'
        },
        {
          listingId: sellerListings[1].id,
          sellerId: seller.id,
          listingTitle: 'Samsung Refrigerator 350L',
          renterName: 'Sunita Thapa',
          startDate: new Date('2023-09-01'),
          endDate: new Date('2024-03-01'),
          duration: 6,
          earnings: 25200,
          status: 'ongoing'
        },
        {
          listingId: sellerListings[4].id,
          sellerId: seller.id,
          listingTitle: 'Office Desk & Chair Combo',
          renterName: 'Deepak KC',
          startDate: new Date('2023-04-01'),
          endDate: new Date('2023-10-01'),
          duration: 6,
          earnings: 15000,
          status: 'completed'
        },
        {
          listingId: sellerListings[3].id,
          sellerId: seller.id,
          listingTitle: 'LG Washing Machine 8kg',
          renterName: 'Kabita Rai',
          startDate: new Date('2023-11-01'),
          endDate: new Date('2024-02-01'),
          duration: 3,
          earnings: 9600,
          status: 'disputed'
        }
      ];

      await RentalHistory.bulkCreate(rentalsData);
      totalRentals += rentalsData.length;
      console.log(`✅ Created ${rentalsData.length} rental records for ${seller.name}`);
    }

    console.log('\n🎉 Seller Dashboard seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Sellers: ${sellers.length}`);
    console.log(`   - Total Listings: ${allListings.length}`);
    console.log(`   - Total Messages: ${totalMessages}`);
    console.log(`   - Total Rentals: ${totalRentals}`);
    console.log('\n📧 Login credentials:');
    console.log('   Email: rajesh@renteasynepal.com');
    console.log('   Password: password123');
    console.log('\n✨ Each seller has: 7 listings, 3 messages, 5 rentals\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

seedSellerDashboard();