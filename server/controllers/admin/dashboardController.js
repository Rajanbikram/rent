const User = require('../../models/User');
const { Seller, Listing } = require('../../models/rental');
const Rental = require('../../models/rental/Rental');
const RentalProduct = require('../../models/rental/Product');
const { Op } = require('sequelize');

// Get admin dashboard stats
const getDashboard = async (req, res) => {
  try {
    console.log('📊 Fetching admin dashboard data...');

    // Initialize with safe defaults
    let totalUsers = 0;
    let totalSellers = 0;
    let activeListings = 0;
    let pendingListings = 0;
    let activeSellers = 0;
    let totalOrders = 0;
    let pendingOrders = 0;
    let monthlyRevenue = 0;

    // Safely fetch each stat
    try {
      totalUsers = await User.count({ where: { role: 'renter' } });
      console.log('✅ Total users:', totalUsers);
    } catch (err) {
      console.error('❌ Error counting users:', err.message);
    }

    try {
      totalSellers = await Seller.count();
      console.log('✅ Total sellers:', totalSellers);
    } catch (err) {
      console.error('❌ Error counting sellers:', err.message);
    }

    try {
      activeListings = await Listing.count({ where: { status: 'active' } });
      console.log('✅ Active listings:', activeListings);
    } catch (err) {
      console.error('❌ Error counting active listings:', err.message);
    }

    try {
      pendingListings = await Listing.count({ where: { status: 'pending' } });
      console.log('✅ Pending listings:', pendingListings);
    } catch (err) {
      console.error('❌ Error counting pending listings:', err.message);
    }

    try {
      activeSellers = await Seller.count({ where: { isActive: true } });
      console.log('✅ Active sellers:', activeSellers);
    } catch (err) {
      console.error('❌ Error counting active sellers:', err.message);
    }

    try {
      totalOrders = await Rental.count();
      console.log('✅ Total orders:', totalOrders);
    } catch (err) {
      console.error('❌ Error counting total orders:', err.message);
    }

    try {
      pendingOrders = await Rental.count({ where: { status: 'booked' } });
      console.log('✅ Pending orders:', pendingOrders);
    } catch (err) {
      console.error('❌ Error counting pending orders:', err.message);
    }

    // Calculate monthly revenue
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      monthlyRevenue = await Rental.sum('totalAmount', {
        where: {
          createdAt: {
            [Op.gte]: firstDayOfMonth
          }
        }
      }) || 0;
      console.log('✅ Monthly revenue:', monthlyRevenue);
    } catch (err) {
      console.error('❌ Error calculating revenue:', err.message);
      monthlyRevenue = 0;
    }

    const allUsers = totalUsers + totalSellers;

    // Get user growth data (from first user to today)
    let userGrowthData = {
      labels: [],
      data: []
    };

    try {
      userGrowthData = await getUserGrowthData();
      console.log('✅ User growth data:', userGrowthData);
    } catch (err) {
      console.error('❌ Error getting user growth:', err.message);
    }

    // Get category distribution
    let categoryData = {
      labels: ['Furniture', 'Appliances'],
      data: [0, 0],
      percentages: [0, 0]
    };

    try {
      categoryData = await getCategoryDistribution();
      console.log('✅ Category data:', categoryData);
    } catch (err) {
      console.error('❌ Error getting category distribution:', err.message);
    }

    // Get recent orders
    let ordersWithUsers = [];
    try {
      const recentOrders = await Rental.findAll({
        limit: 3,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'totalAmount', 'status', 'createdAt', 'userId']
      });

      ordersWithUsers = await Promise.all(
        recentOrders.map(async (order) => {
          try {
            const user = await User.findByPk(order.userId, {
              attributes: ['fullName']
            });
            return {
              id: order.id,
              renterName: user?.fullName || 'Unknown User',
              amount: order.totalAmount,
              status: order.status,
              createdAt: order.createdAt
            };
          } catch (err) {
            return {
              id: order.id,
              renterName: 'Unknown User',
              amount: order.totalAmount,
              status: order.status,
              createdAt: order.createdAt
            };
          }
        })
      );
      console.log('✅ Recent orders:', ordersWithUsers.length);
    } catch (err) {
      console.error('❌ Error getting recent orders:', err.message);
    }

    // Get pending listings
    let pendingListingsData = [];
    try {
      const recentPendingListings = await Listing.findAll({
        where: { status: 'pending' },
        limit: 3,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'title', 'pricePerMonth', 'createdAt']
      });

      pendingListingsData = recentPendingListings.map(listing => ({
        id: listing.id,
        title: listing.title,
        pricePerMonth: listing.pricePerMonth,
        createdAt: listing.createdAt
      }));
      console.log('✅ Pending listings:', pendingListingsData.length);
    } catch (err) {
      console.error('❌ Error getting pending listings:', err.message);
    }

    // Response data
    const dashboardData = {
      stats: {
        totalUsers: allUsers,
        activeListings,
        totalOrders,
        monthlyRevenue: Math.round(monthlyRevenue),
        totalRevenue: Math.round(monthlyRevenue),
        pendingListings,
        pendingOrders,
        activeSellers
      },
      charts: {
        userGrowth: userGrowthData,
        categoryDistribution: categoryData
      },
      recentActivity: {
        orders: ordersWithUsers,
        pendingListings: pendingListingsData
      }
    };

    console.log('✅ Dashboard data prepared successfully');

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('❌ Dashboard fatal error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Helper: Get user growth data from first user to today (dynamic range)
const getUserGrowthData = async () => {
  try {
    // Find the earliest user creation date
    const firstUser = await User.findOne({
      order: [['createdAt', 'ASC']],
      attributes: ['createdAt']
    });

    const firstSeller = await Seller.findOne({
      order: [['createdAt', 'ASC']],
      attributes: ['createdAt']
    });

    // Determine the earliest date between users and sellers
    let startDate;
    if (firstUser && firstSeller) {
      startDate = firstUser.createdAt < firstSeller.createdAt 
        ? new Date(firstUser.createdAt) 
        : new Date(firstSeller.createdAt);
    } else if (firstUser) {
      startDate = new Date(firstUser.createdAt);
    } else if (firstSeller) {
      startDate = new Date(firstSeller.createdAt);
    } else {
      // No users or sellers exist - return empty data
      return {
        labels: ['Today'],
        data: [0]
      };
    }

    // Set to start of day
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const labels = [];
    const data = [];

    // Generate data for each day from start to today
    let currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Format label (e.g., "Jan 8", "Jan 9")
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`;
      labels.push(label);

      // Count users created on this day
      const userCount = await User.count({
        where: {
          createdAt: {
            [Op.between]: [dayStart, dayEnd]
          }
        }
      });

      const sellerCount = await Seller.count({
        where: {
          createdAt: {
            [Op.between]: [dayStart, dayEnd]
          }
        }
      });

      data.push(userCount + sellerCount);

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('📈 Dynamic user growth from first signup to today:', { 
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      totalDays: labels.length,
      labels, 
      data 
    });

    return { labels, data };

  } catch (error) {
    console.error('Error getting user growth:', error);
    return { 
      labels: ['Today'], 
      data: [0] 
    };
  }
};

// Helper: Get category distribution
const getCategoryDistribution = async () => {
  const furniture = await RentalProduct.count({ where: { category: 'furniture' } });
  const appliances = await RentalProduct.count({ where: { category: 'appliances' } });

  const total = furniture + appliances || 1;

  return {
    labels: ['Furniture', 'Appliances'],
    data: [furniture, appliances],
    percentages: [
      Math.round((furniture / total) * 100),
      Math.round((appliances / total) * 100)
    ]
  };
};

module.exports = {
  getDashboard
};