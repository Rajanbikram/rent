import React, { useState } from 'react';
import Modal from './Modal';

function VatCalculator({ isOpen, onClose }) {
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);

  const calculateVat = (value) => {
    setAmount(value);
    if (value && !isNaN(value) && parseFloat(value) > 0) {
      const base = parseFloat(value);
      const vat = Math.round(base * 0.13);
      const total = base + vat;
      setResult({ base, vat, total });
    } else {
      setResult(null);
    }
  };

  const handleClose = () => {
    setAmount('');
    setResult(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nepal VAT Calculator"
      description="Calculate 13% VAT for Nepal rental transactions"
      footer={
        <button className="btn btn-primary" onClick={handleClose}>
          Close
        </button>
      }
    >
      <div className="form-group">
        <label className="form-label">Base Amount (Rs.)</label>
        <input
          type="number"
          className="form-input"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => calculateVat(e.target.value)}
        />
      </div>
      {result && (
        <div style={{ display: 'block', background: 'var(--muted)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="text-muted">Base Amount:</span>
            <span>Rs. {result.base.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="text-muted">VAT (13%):</span>
            <span className="text-primary">Rs. {result.vat.toLocaleString()}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span className="font-bold">Total with VAT:</span>
            <span className="font-bold" style={{ fontSize: '1.125rem' }}>Rs. {result.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default VatCalculator;