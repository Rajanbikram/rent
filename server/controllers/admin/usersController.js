const User = require('../../models/User');
const Seller = require('../../models/Seller');
const { Op } = require('sequelize');

// Get all users (renters)
const getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    console.log('📋 Fetching users - Search:', search, 'Role:', role);

    const whereClause = {};

    // Search by name or email
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by role
    if (role && role !== 'all') {
      whereClause.role = role;
    }

    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'fullName', 'email', 'role', 'isStudent', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log(`✅ Found ${count} users`);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get all sellers
const getSellers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    console.log('📋 Fetching sellers - Search:', search, 'Status:', status);

    const whereClause = {};

    // Search by name or email
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by status
    if (status === 'active') {
      whereClause.isActive = true;
    } else if (status === 'inactive') {
      whereClause.isActive = false;
    }

    const offset = (page - 1) * limit;

    const { count, rows: sellers } = await Seller.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'rating', 'totalListings', 'totalRentals', 'totalEarnings', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log(`✅ Found ${count} sellers`);

    res.json({
      success: true,
      data: {
        sellers,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sellers',
      error: error.message
    });
  }
};

// Get all users and sellers combined
const getAllUsersAndSellers = async (req, res) => {
  try {
    const { search, type, page = 1, limit = 20 } = req.query;

    console.log('📋 Fetching all users and sellers - Search:', search, 'Type:', type);

    let users = [];
    let sellers = [];

    // Fetch users if type is 'all' or 'users'
    if (!type || type === 'all' || type === 'users') {
      const userWhereClause = {};
      if (search) {
        userWhereClause[Op.or] = [
          { fullName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      users = await User.findAll({
        where: userWhereClause,
        attributes: ['id', 'fullName', 'email', 'role', 'isStudent', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });

      // Add type field
      users = users.map(user => ({
        ...user.dataValues,
        type: 'user',
        name: user.fullName,
        status: user.role
      }));
    }

    // Fetch sellers if type is 'all' or 'sellers'
    if (!type || type === 'all' || type === 'sellers') {
      const sellerWhereClause = {};
      if (search) {
        sellerWhereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      sellers = await Seller.findAll({
        where: sellerWhereClause,
        attributes: ['id', 'name', 'email', 'rating', 'totalListings', 'totalRentals', 'isActive', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });

      // Add type field
      sellers = sellers.map(seller => ({
        ...seller.dataValues,
        type: 'seller',
        status: seller.isActive ? 'active' : 'inactive'
      }));
    }

    // Combine and sort by creation date
    const combined = [...users, ...sellers].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedData = combined.slice(offset, offset + parseInt(limit));

    console.log(`✅ Found ${combined.length} total (${users.length} users, ${sellers.length} sellers)`);

    res.json({
      success: true,
      data: {
        items: paginatedData,
        stats: {
          totalUsers: users.length,
          totalSellers: sellers.length,
          combined: combined.length
        },
        pagination: {
          total: combined.length,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(combined.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching all users and sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users and sellers',
      error: error.message
    });
  }
};

// Ban/Unban user
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.body; // 'user' or 'seller'

    console.log(`🚫 Toggle status - ID: ${userId}, Type: ${type}`);

    if (type === 'seller') {
      const seller = await Seller.findByPk(userId);
      
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      seller.isActive = !seller.isActive;
      await seller.save();

      console.log(`✅ Seller ${seller.isActive ? 'activated' : 'deactivated'}`);

      return res.json({
        success: true,
        message: `Seller ${seller.isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
          id: seller.id,
          isActive: seller.isActive
        }
      });

    } else {
      // For users, we can add a 'banned' field or change role
      // Since User model doesn't have isBanned, we'll use a workaround
      // You might want to add a 'status' or 'isBanned' field to User model
      
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // For now, we'll just return success
      // You should add a 'isBanned' or 'status' field to User model
      console.log(`⚠️ User ban/unban not fully implemented - need to add status field to User model`);

      return res.json({
        success: true,
        message: 'User status updated (Note: Add status field to User model for full functionality)',
        data: {
          id: user.id,
          email: user.email
        }
      });
    }

  } catch (error) {
    console.error('❌ Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Delete user or seller
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.body; // 'user' or 'seller'

    console.log(`🗑️ Delete - ID: ${userId}, Type: ${type}`);

    if (type === 'seller') {
      const seller = await Seller.findByPk(userId);
      
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      await seller.destroy();
      console.log(`✅ Seller deleted: ${seller.email}`);

      return res.json({
        success: true,
        message: 'Seller deleted successfully'
      });

    } else {
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Don't allow deleting admin users
      if (user.role === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete admin users'
        });
      }

      await user.destroy();
      console.log(`✅ User deleted: ${user.email}`);

      return res.json({
        success: true,
        message: 'User deleted successfully'
      });
    }

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    console.log(`👤 Update role - ID: ${userId}, New role: ${role}`);

    if (!['admin', 'seller', 'renter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, seller, or renter'
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    console.log(`✅ User role updated: ${user.email} -> ${role}`);

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    console.log('📊 Fetching user statistics...');

    const totalUsers = await User.count();
    const totalRenters = await User.count({ where: { role: 'renter' } });
    const totalStudents = await User.count({ where: { isStudent: true } });
    const totalSellers = await Seller.count();
    const activeSellers = await Seller.count({ where: { isActive: true } });

    const stats = {
      totalUsers,
      totalRenters,
      totalStudents,
      totalSellers,
      activeSellers,
      inactiveSellers: totalSellers - activeSellers
    };

    console.log('✅ User stats:', stats);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getSellers,
  getAllUsersAndSellers,
  toggleUserStatus,
  deleteUser,
  updateUserRole,
  getUserStats
};