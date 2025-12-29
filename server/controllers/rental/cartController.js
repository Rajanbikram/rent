const RentalCart = require('../../models/rental/Cart');
const RentalProduct = require('../../models/rental/Product');

exports.getCart = async (req, res) => {
  try {
    const items = await RentalCart.findAll({ 
      where: { userId: req.user.id },
      include: [{ model: RentalProduct, as: 'product' }]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, tenure = 3 } = req.body;
    const existing = await RentalCart.findOne({ where: { userId: req.user.id, productId } });
    
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }
    
    const item = await RentalCart.create({ userId: req.user.id, productId, quantity, tenure });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const item = await RentalCart.findOne({ where: { userId: req.user.id, id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Cart item not found' });
    
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const deleted = await RentalCart.destroy({ where: { userId: req.user.id, id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await RentalCart.destroy({ where: { userId: req.user.id } });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};