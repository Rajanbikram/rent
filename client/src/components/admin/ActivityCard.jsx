import React from 'react';

function ActivityCard({ title, items }) {
  return (
    <div className="card activity-card">
      <div className="activity-title">{title}</div>
      <div className="activity-list">
        {items.map((item, index) => (
          <div key={index} className="activity-item">
            <div>
              <div className="activity-item-title">{item.title}</div>
              <div className="activity-item-subtitle">{item.subtitle}</div>
            </div>
            <div>
              <div className="activity-item-value">{item.value}</div>
              <span className={`badge badge-${item.badgeType}`}>{item.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityCard;