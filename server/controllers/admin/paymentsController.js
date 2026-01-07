const { Payment } = require('../../models/admin');

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Server error fetching payments' });
  }
};

exports.calculateVAT = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const vatRate = 0.13; // Nepal VAT rate
    const vatAmount = Math.round(amount * vatRate);
    const totalWithVat = amount + vatAmount;

    res.json({
      baseAmount: amount,
      vatAmount,
      vatRate: '13%',
      totalWithVat
    });
  } catch (error) {
    console.error('Calculate VAT error:', error);
    res.status(500).json({ error: 'Server error calculating VAT' });
  }
};

exports.getPaymentStats = async (req, res) => {
  try {
    const { Payment } = require('../../models/admin');
    const { Op } = require('sequelize');

    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'completed' }
    });

    const totalVAT = await Payment.sum('vatAmount', {
      where: { status: 'completed' }
    });

    const pendingPayments = await Payment.count({
      where: { status: 'pending' }
    });

    res.json({
      totalRevenue: totalRevenue || 0,
      totalVAT: totalVAT || 0,
      pendingPayments,
      vatRate: '13%'
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ error: 'Server error fetching payment stats' });
  }
};