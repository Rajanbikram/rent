import React, { useState } from 'react';
import Modal from './Modal';

function PromoModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    expiresAt: '',
  });

  const handleSubmit = () => {
    if (!formData.code || !formData.discount || !formData.expiresAt) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
    setFormData({ code: '', discount: '', type: 'percentage', expiresAt: '' });
  };

  const handleClose = () => {
    setFormData({ code: '', discount: '', type: 'percentage', expiresAt: '' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Promo Code"
      description="Create a new promotional discount code"
      footer={
        <>
          <button className="btn btn-outline" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Create Promo
          </button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Promo Code</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., SUMMER25"
          style={{ textTransform: 'uppercase' }}
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Discount Value</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g., 15"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Discount Type</label>
          <select
            className="form-input"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (Rs.)</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Expiry Date</label>
        <input
          type="date"
          className="form-input"
          value={formData.expiresAt}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
        />
      </div>
    </Modal>
  );
}

export default PromoModal;