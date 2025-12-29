const Rental = require('../../models/rental/Rental');
const RentalProduct = require('../../models/rental/Product');
const RentalCart = require('../../models/rental/Cart');

exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.findAll({ 
      where: { userId: req.user.id },
      include: [{ model: RentalProduct, as: 'product' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRental = async (req, res) => {
  try {
    const { productId, tenure, address, paymentMethod } = req.body;
    const product = await RentalProduct.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + tenure);
    
    const rental = await Rental.create({
      userId: req.user.id,
      productId,
      startDate,
      endDate,
      tenure,
      status: 'booked',
      monthlyRent: product.pricePerMonth,
      totalAmount: product.pricePerMonth * tenure,
      address,
      paymentMethod
    });
    
    await RentalCart.destroy({ where: { userId: req.user.id, productId } });
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRentalStatus = async (req, res) => {
  try {
    const rental = await Rental.findOne({ where: { userId: req.user.id, id: req.params.id } });
    if (!rental) return res.status(404).json({ error: 'Rental not found' });
    
    await rental.update({ status: req.body.status });
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.renewRental = async (req, res) => {
  try {
    const rental = await Rental.findOne({ where: { userId: req.user.id, id: req.params.id } });
    if (!rental) return res.status(404).json({ error: 'Rental not found' });
    
    const newEndDate = new Date(rental.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + rental.tenure);
    
    await rental.update({ endDate: newEndDate, status: 'active' });
    res.json({ message: 'Rental renewed successfully', rental });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};