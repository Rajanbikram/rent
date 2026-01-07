const { PromoCode } = require('../../models/admin');

exports.getAllPromos = async (req, res) => {
  try {
    const promos = await PromoCode.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(promos);
  } catch (error) {
    console.error('Get promos error:', error);
    res.status(500).json({ error: 'Server error fetching promo codes' });
  }
};

exports.createPromo = async (req, res) => {
  try {
    const { code, discount, type, expiresAt } = req.body;

    if (!code || !discount || !type || !expiresAt) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingPromo = await PromoCode.findOne({ where: { code } });
    if (existingPromo) {
      return res.status(400).json({ error: 'Promo code already exists' });
    }

    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      discount,
      type,
      expiresAt,
      isActive: true,
      usageCount: 0
    });

    res.status(201).json({ message: 'Promo code created successfully', promo });
  } catch (error) {
    console.error('Create promo error:', error);
    res.status(500).json({ error: 'Server error creating promo code' });
  }
};

exports.togglePromo = async (req, res) => {
  try {
    const { id } = req.params;

    const promo = await PromoCode.findByPk(id);
    if (!promo) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    promo.isActive = !promo.isActive;
    await promo.save();

    res.json({ 
      message: `Promo code ${promo.isActive ? 'activated' : 'deactivated'}`, 
      promo 
    });
  } catch (error) {
    console.error('Toggle promo error:', error);
    res.status(500).json({ error: 'Server error toggling promo code' });
  }
};

exports.deletePromo = async (req, res) => {
  try {
    const { id } = req.params;

    const promo = await PromoCode.findByPk(id);
    if (!promo) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    await promo.destroy();

    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    console.error('Delete promo error:', error);
    res.status(500).json({ error: 'Server error deleting promo code' });
  }
};