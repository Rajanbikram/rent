import React from 'react';
import '../styles/components.css';

const DealsCarousel = ({ deals, showToast, onLoginClick }) => {
  const handleViewDeal = () => {
    if (onLoginClick) {
      onLoginClick(); // Show login page
    } else {
      showToast('Login Required', 'Please login to view exclusive deals');
    }
  };

  return (
    <div className="deals-carousel">
      {deals.map((deal) => (
        <div key={deal.id} className="deal-card">
          <div className="deal-image-container">
            <img
              src={deal.image}
              alt={deal.title}
              className="deal-image"
            />
            <div className="deal-discount-badge">
              {deal.discount}% OFF
            </div>
          </div>

          <div className="deal-body">
            <span className="deal-badge">{deal.badge}</span>
            <h3 className="deal-title">{deal.title}</h3>
            <p className="deal-description">{deal.description}</p>
            <button
              onClick={handleViewDeal}
              className="btn-view-deal"
            >
              View Deals
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DealsCarousel;