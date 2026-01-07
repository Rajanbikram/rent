const { sequelize, Admin, Listing, Order, Payment, PromoCode, StudentVerification } = require('../../models/admin');

const seedAdminData = async () => {
  try {
    console.log('🌱 Seeding admin data...');

    // Delete old data to avoid duplicates
    await Admin.destroy({ where: {} });
    await Listing.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Payment.destroy({ where: {} });
    await PromoCode.destroy({ where: {} });
    await StudentVerification.destroy({ where: {} });
    console.log('🗑️  Cleared old admin data');

    // Create users
    const admin1 = await Admin.create({ name: 'Admin User', email: 'admin@renteasy.np', password: 'admin123', role: 'admin', rating: 5.0, status: 'active' });
    const user1 = await Admin.create({ name: 'Aarav Sharma', email: 'aarav@gmail.com', password: 'password123', role: 'user', rating: 4.5, status: 'active', isStudentVerified: true });
    const seller1 = await Admin.create({ name: 'Priya Thapa', email: 'priya@gmail.com', password: 'password123', role: 'seller', rating: 4.8, status: 'active' });
    const seller2 = await Admin.create({ name: 'Bikash Gurung', email: 'bikash@gmail.com', password: 'password123', role: 'seller', rating: 2.1, status: 'active' });
    const user2 = await Admin.create({ name: 'Sita Rai', email: 'sita@gmail.com', password: 'password123', role: 'user', rating: 4.2, status: 'banned', isStudentVerified: true });
    const user3 = await Admin.create({ name: 'Raj Magar', email: 'raj@gmail.com', password: 'password123', role: 'user', rating: 3.9, status: 'active' });
    const seller3 = await Admin.create({ name: 'Maya Tamang', email: 'maya@gmail.com', password: 'password123', role: 'seller', rating: 4.7, status: 'active', isStudentVerified: true });
    const user4 = await Admin.create({ name: 'Kiran Shrestha', email: 'kiran@gmail.com', password: 'password123', role: 'user', rating: 4.0, status: 'active' });
    const seller4 = await Admin.create({ name: 'Anita Basnet', email: 'anita@gmail.com', password: 'password123', role: 'seller', rating: 1.8, status: 'active' });
    console.log('✅ Created users');

    // Create listings
    const listing1 = await Listing.create({ title: 'Modern Sofa Set', category: 'Furniture', price_per_month: 5000, description: 'Comfortable sofa', status: 'approved' });
    const listing2 = await Listing.create({ title: 'Samsung Refrigerator', category: 'Appliances', price_per_month: 3000, description: 'Energy efficient', status: 'pending' });
    const listing3 = await Listing.create({ title: 'Study Desk', category: 'Furniture', price_per_month: 1500, description: 'Spacious desk', status: 'pending' });
    const listing4 = await Listing.create({ title: 'Washing Machine', category: 'Appliances', price_per_month: 4000, description: 'Automatic', status: 'approved' });
    const listing5 = await Listing.create({ title: 'Office Chair', category: 'Furniture', price_per_month: 1000, description: 'Ergonomic', status: 'rejected' });
    const listing6 = await Listing.create({ title: 'Air Conditioner', category: 'Appliances', price_per_month: 6000, description: 'Split AC', status: 'pending' });
    console.log('✅ Created listings');

    // Create orders
    await Order.create({ id: 'ORD001', listingId: listing1.id, listingTitle: 'Modern Sofa Set', renterId: user1.id, renter: 'Aarav Sharma', sellerId: seller1.id, seller: 'Priya Thapa', startDate: '2025-01-05', endDate: '2025-01-15', totalAmount: 5000, status: 'pending', paymentMethod: 'esewa' });
    await Order.create({ id: 'ORD002', listingId: listing4.id, listingTitle: 'Washing Machine', renterId: user3.id, renter: 'Raj Magar', sellerId: seller1.id, seller: 'Priya Thapa', startDate: '2025-01-02', endDate: '2025-01-10', totalAmount: 3200, status: 'active', paymentMethod: 'khalti' });
    await Order.create({ id: 'ORD003', listingId: listing3.id, listingTitle: 'Study Desk', renterId: user4.id, renter: 'Kiran Shrestha', sellerId: seller2.id, seller: 'Bikash Gurung', startDate: '2024-12-20', endDate: '2024-12-30', totalAmount: 1500, status: 'completed', paymentMethod: 'esewa' });
    await Order.create({ id: 'ORD004', listingId: listing2.id, listingTitle: 'Samsung Refrigerator', renterId: user2.id, renter: 'Sita Rai', sellerId: seller3.id, seller: 'Maya Tamang', startDate: '2025-01-08', endDate: '2025-01-20', totalAmount: 3600, status: 'pending', paymentMethod: 'khalti' });
    await Order.create({ id: 'ORD005', listingId: listing6.id, listingTitle: 'Air Conditioner', renterId: user1.id, renter: 'Aarav Sharma', sellerId: seller3.id, seller: 'Maya Tamang', startDate: '2025-01-10', endDate: '2025-01-25', totalAmount: 9000, status: 'pending', paymentMethod: 'esewa' });
    console.log('✅ Created orders');

    // Create payments
    await Payment.create({ id: 'PAY001', orderId: 'ORD001', amount: 5000, vatAmount: 650, paymentMethod: 'esewa', status: 'pending' });
    await Payment.create({ id: 'PAY002', orderId: 'ORD002', amount: 3200, vatAmount: 416, paymentMethod: 'khalti', status: 'completed' });
    await Payment.create({ id: 'PAY003', orderId: 'ORD003', amount: 1500, vatAmount: 195, paymentMethod: 'esewa', status: 'completed' });
    await Payment.create({ id: 'PAY004', orderId: 'ORD004', amount: 3600, vatAmount: 468, paymentMethod: 'khalti', status: 'pending' });
    await Payment.create({ id: 'PAY005', orderId: 'ORD005', amount: 9000, vatAmount: 1170, paymentMethod: 'esewa', status: 'pending' });
    console.log('✅ Created payments');

    // Create promo codes
    await PromoCode.create({ code: 'NEWYEAR2025', discount: 15, type: 'percentage', isActive: true, usageCount: 45, expiresAt: '2025-01-31' });
    await PromoCode.create({ code: 'STUDENT10', discount: 10, type: 'percentage', isActive: true, usageCount: 120, expiresAt: '2025-06-30' });
    await PromoCode.create({ code: 'FLAT500', discount: 500, type: 'fixed', isActive: false, usageCount: 30, expiresAt: '2024-12-31' });
    await PromoCode.create({ code: 'DASHAIN25', discount: 25, type: 'percentage', isActive: false, usageCount: 200, expiresAt: '2024-10-31' });
    console.log('✅ Created promo codes');

    // Create student verifications
    await StudentVerification.create({ userId: user1.id, userName: 'Aarav Sharma', studentId: 'TU-2022-1234', university: 'Tribhuvan University', status: 'approved' });
    await StudentVerification.create({ userId: user2.id, userName: 'Sita Rai', studentId: 'KU-2023-5678', university: 'Kathmandu University', status: 'approved' });
    await StudentVerification.create({ userId: seller3.id, userName: 'Maya Tamang', studentId: 'PU-2024-9012', university: 'Pokhara University', status: 'pending' });
    await StudentVerification.create({ userId: user4.id, userName: 'Kiran Shrestha', studentId: 'TU-2023-3456', university: 'Tribhuvan University', status: 'pending' });
    console.log('✅ Created student verifications');

    console.log('\n✅ Admin data seeded successfully');
    console.log('📧 Admin login: admin@renteasy.np / admin123\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

module.exports = seedAdminData;

// Run if called directly
if (require.main === module) {
  sequelize.sync()  // ✅ FIXED - Changed from { force: true }
    .then(() => {
      console.log('✅ Database tables synced');
      return seedAdminData();
    })
    .then(() => {
      console.log('✅ Seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}