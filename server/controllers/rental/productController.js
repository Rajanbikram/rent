const RentalProduct = require('../../models/rental/Product');
const RentalReview = require('../../models/rental/Review');
const { Op } = require('sequelize');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, location, search, minPrice, maxPrice } = req.query;
    const where = {};
    
    if (category && category !== 'all') where.category = category;
    if (location && location !== 'all') where.location = location;
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (minPrice || maxPrice) {
      where.pricePerMonth = {};
      if (minPrice) where.pricePerMonth[Op.gte] = parseInt(minPrice);
      if (maxPrice) where.pricePerMonth[Op.lte] = parseInt(maxPrice);
    }
    
    const products = await RentalProduct.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await RentalProduct.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const reviews = await RentalReview.findAll({ where: { productId: product.id } });
    res.json({ ...product.toJSON(), reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await RentalProduct.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await RentalProduct.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await RentalProduct.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};