import React from 'react';

function QuickStatCard({ icon, value, label, iconStyle }) {
  return (
    <div className="card quick-stat-card">
      <div className="quick-stat-icon" style={iconStyle}>
        {icon}
      </div>
      <div>
        <div className="quick-stat-value">{value}</div>
        <div className="quick-stat-label">{label}</div>
      </div>
    </div>
  );
}

export default QuickStatCard;