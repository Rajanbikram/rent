const { Payment } = require('../../models/admin');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = {};
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    console.log('💳 Fetching payments with filter:', whereClause);
    
    const payments = await Payment.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      raw: true
    });

    console.log('✅ Found', payments.length, 'payments');
    
    res.status(200).json(payments);
    
  } catch (error) {
    console.error('❌ Get payments error:', error);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      error: 'Server error fetching payments',
      message: error.message
    });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    console.log('📊 Fetching payment stats...');
    
    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'completed' }
    });
    
    const pendingPayments = await Payment.count({
      where: { status: 'pending' }
    });
    
    const completedPayments = await Payment.count({
      where: { status: 'completed' }
    });
    
    const failedPayments = await Payment.count({
      where: { status: 'failed' }
    });
    
    const totalPayments = await Payment.count();
    
    // Calculate VAT (13% of revenue)
    const totalVAT = totalRevenue ? Math.round(totalRevenue * 0.13) : 0;
    
    const stats = {
      totalRevenue: totalRevenue || 0,
      totalVAT: totalVAT,
      totalWithVAT: (totalRevenue || 0) + totalVAT,
      pendingPayments,
      completedPayments,
      failedPayments,
      totalPayments,
      vatRate: '13%'
    };
    
    console.log('✅ Payment stats:', stats);
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('❌ Get payment stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching payment stats',
      message: error.message
    });
  }
};

// Calculate VAT
exports.calculateVAT = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid amount' 
      });
    }
    
    const vatRate = 0.13; // Nepal VAT rate (13%)
    const vatAmount = Math.round(amount * vatRate);
    const totalWithVat = amount + vatAmount;
    
    console.log('🧮 VAT calculated:', { amount, vatAmount, totalWithVat });
    
    res.json({
      success: true,
      baseAmount: amount,
      vatAmount,
      vatRate: '13%',
      totalWithVat
    });
    
  } catch (error) {
    console.error('❌ Calculate VAT error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error calculating VAT',
      message: error.message
    });
  }
};

// Get single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('💳 Fetching payment ID:', id);
    
    const payment = await Payment.findByPk(id);
    
    if (!payment) {
      console.log('❌ Payment not found:', id);
      return res.status(404).json({ 
        success: false,
        error: 'Payment not found' 
      });
    }
    
    console.log('✅ Payment found:', id);
    
    res.status(200).json({
      success: true,
      payment
    });
    
  } catch (error) {
    console.error('❌ Get payment error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching payment',
      message: error.message
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('🔄 Updating payment status:', id, '→', status);
    
    // Validate status
    if (!['pending', 'completed', 'failed'].includes(status)) {
      console.log('❌ Invalid status:', status);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid status',
        validStatuses: ['pending', 'completed', 'failed']
      });
    }
    
    const payment = await Payment.findByPk(id);
    
    if (!payment) {
      console.log('❌ Payment not found:', id);
      return res.status(404).json({ 
        success: false,
        error: 'Payment not found' 
      });
    }

    // Update status
    payment.status = status;
    await payment.save();
    
    console.log('✅ Payment status updated:', id, '→', status);
    
    res.status(200).json({ 
      success: true,
      message: 'Payment status updated successfully', 
      payment 
    });
    
  } catch (error) {
    console.error('❌ Update payment error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error updating payment',
      message: error.message
    });
  }
};