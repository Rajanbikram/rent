import React from 'react';

function StatCard({ icon, value, label, trend, iconClass = 'primary' }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon ${iconClass}`}>{icon}</div>
        {trend && <span className="stat-trend positive">{trend}</span>}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default StatCard;