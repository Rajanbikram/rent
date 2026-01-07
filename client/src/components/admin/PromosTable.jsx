import React from 'react';
import { useToast } from '../../hooks/useToast';

function PromosTable({ promos, onToggle, onDelete }) {
  const { showToast } = useToast();

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    showToast('Copied!', `Promo code ${code} copied to clipboard`);
  };

  return (
    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Discount</th>
              <th>Type</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map(promo => (
              <tr key={promo.id}>
                <td>
                  <div className="promo-code">
                    <code>{promo.code}</code>
                    <button 
                      className="btn btn-ghost btn-icon" 
                      onClick={() => copyToClipboard(promo.code)} 
                      title="Copy"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="font-bold">
                  {promo.type === 'percentage' ? `${promo.discount}%` : `Rs. ${promo.discount}`}
                </td>
                <td><span className="badge badge-outline">{promo.type === 'percentage' ? 'Percentage' : 'Fixed'}</span></td>
                <td>{promo.usageCount} times</td>
                <td className="text-muted">{promo.expiresAt}</td>
                <td>
                  <div className="switch-container">
                    <div 
                      className={`switch ${promo.isActive ? 'active' : ''}`} 
                      onClick={() => onToggle(promo)}
                    ></div>
                    <span className={`switch-label ${promo.isActive ? 'text-success' : 'text-muted'}`}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn btn-ghost btn-icon text-destructive" 
                    onClick={() => onDelete(promo)} 
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PromosTable;