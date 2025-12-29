const RentalFavorite = require('../../models/rental/Favorite');
const RentalProduct = require('../../models/rental/Product');

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await RentalFavorite.findAll({ 
      where: { userId: req.user.id },
      include: [{ model: RentalProduct, as: 'product' }]
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const existing = await RentalFavorite.findOne({ where: { userId: req.user.id, productId } });
    
    if (existing) {
      await existing.destroy();
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    }
    
    await RentalFavorite.create({ userId: req.user.id, productId });
    res.status(201).json({ message: 'Added to favorites', isFavorite: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};