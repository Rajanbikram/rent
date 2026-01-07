const { Admin, LoginLog } = require('../../models/admin');
const { Op } = require('sequelize');

exports.getAllUsers = async (req, res) => {
  try {
    const { search, sortBy = 'createdAt', order = 'DESC' } = req.query;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await Admin.findAll({
      where: whereClause,
      order: [[sortBy, order]],
      attributes: ['id', 'name', 'email', 'role', 'status', 'rating', 'isStudentVerified', 'createdAt']
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await Admin.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Server error updating role' });
  }
};

exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Admin.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = user.status === 'active' ? 'banned' : 'active';
    await user.save();

    res.json({ 
      message: `User ${user.status === 'banned' ? 'banned' : 'unbanned'} successfully`, 
      user 
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Server error banning user' });
  }
};

exports.getUserLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await LoginLog.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json(logs);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Server error fetching logs' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await Admin.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error resetting password' });
  }
};