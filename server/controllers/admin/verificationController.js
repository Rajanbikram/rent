const { StudentVerification, Admin } = require('../../models/admin');

exports.getAllVerifications = async (req, res) => {
  try {
    const verifications = await StudentVerification.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(verifications);
  } catch (error) {
    console.error('Get verifications error:', error);
    res.status(500).json({ error: 'Server error fetching verifications' });
  }
};

exports.approveVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const verification = await StudentVerification.findByPk(id);
    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    verification.status = 'approved';
    await verification.save();

    // Update user's student verification status
    await Admin.update(
      { isStudentVerified: true },
      { where: { id: verification.userId } }
    );

    res.json({ message: 'Student verification approved', verification });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({ error: 'Server error approving verification' });
  }
};

exports.rejectVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const verification = await StudentVerification.findByPk(id);
    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    verification.status = 'rejected';
    await verification.save();

    res.json({ message: 'Student verification rejected', verification });
  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(500).json({ error: 'Server error rejecting verification' });
  }
};