// server/controllers/admin/ordersController.js
// Updated to work with rentals table structure

const { Order } = require('../../models/admin');

// Get all orders with optional status filter
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = {};
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    console.log('📦 Fetching orders with filter:', whereClause);
    
    const orders = await Order.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      raw: true
    });

    console.log('✅ Found', orders.length, 'orders');
    
    res.status(200).json(orders);
    
  } catch (error) {
    console.error('❌ Get orders error:', error);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      error: 'Server error fetching orders',
      message: error.message
    });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📦 Fetching order ID:', id);
    
    const order = await Order.findByPk(id);
    
    if (!order) {
      console.log('❌ Order not found:', id);
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }
    
    console.log('✅ Order found:', id);
    
    res.status(200).json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('❌ Get order error:', error);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching order',
      message: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('🔄 Updating order status:', id, '→', status);
    
    // Validate status - using rentals table status values
    if (!['booked', 'active', 'ending-soon', 'returned'].includes(status)) {
      console.log('❌ Invalid status:', status);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid status',
        validStatuses: ['booked', 'active', 'ending-soon', 'returned']
      });
    }
    
    const order = await Order.findByPk(id);
    
    if (!order) {
      console.log('❌ Order not found:', id);
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Update status
    order.status = status;
    await order.save();
    
    console.log('✅ Order status updated:', id, '→', status);
    
    res.status(200).json({ 
      success: true,
      message: 'Order status updated successfully', 
      order 
    });
    
  } catch (error) {
    console.error('❌ Update order error:', error);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      success: false,
      error: 'Server error updating order',
      message: error.message
    });
  }
};

// Mark order as returned (convenience method)
exports.returnOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📦 Returning order:', id);
    
    const order = await Order.findByPk(id);
    
    if (!order) {
      console.log('❌ Order not found:', id);
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    order.status = 'returned';
    await order.save();
    
    console.log('✅ Order returned:', id);
    
    res.status(200).json({ 
      success: true,
      message: 'Order marked as returned successfully', 
      order 
    });
    
  } catch (error) {
    console.error('❌ Return order error:', error);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      success: false,
      error: 'Server error returning order',
      message: error.message
    });
  }
};