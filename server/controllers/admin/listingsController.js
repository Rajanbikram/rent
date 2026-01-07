const { Listing } = require('../../models/admin');

exports.getAllListings = async (req, res) => {
  try {
    const { status } = req.query;

    const whereClause = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const listings = await Listing.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Server error fetching listings' });
  }
};

exports.approveListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    listing.status = 'approved';
    await listing.save();

    res.json({ message: 'Listing approved successfully', listing });
  } catch (error) {
    console.error('Approve listing error:', error);
    res.status(500).json({ error: 'Server error approving listing' });
  }
};

exports.rejectListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    listing.status = 'rejected';
    await listing.save();

    res.json({ message: 'Listing rejected successfully', listing });
  } catch (error) {
    console.error('Reject listing error:', error);
    res.status(500).json({ error: 'Server error rejecting listing' });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await listing.destroy();

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Server error deleting listing' });
  }
};