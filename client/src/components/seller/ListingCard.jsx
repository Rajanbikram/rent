import React from 'react';
import { useState } from 'react';

const ListingCard = ({ listing, onToggleStatus, onEdit, onShare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatNPR = (amount) => `NPR ${amount.toLocaleString('en-NP')}`;
  const formatViews = (count) => count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className={`listing-card fade-in ${listing.status === 'paused' ? 'paused' : ''}`}>
      <div className="image-carousel">
        <img 
          src={listing.images[currentImageIndex]} 
          alt={listing.title}
        />
        
        {listing.images.length > 1 && (
          <>
            <button className="carousel-btn prev" onClick={handlePrevImage}>
              ←
            </button>
            <button className="carousel-btn next" onClick={handleNextImage}>
              →
            </button>
            <div className="carousel-dots">
              {listing.images.map((_, index) => (
                <span
                  key={index}
                  className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}

        <span className={`status-badge ${listing.status}`}>
          {listing.status === 'active' ? 'Active' : 'Paused'}
        </span>
      </div>

      <div className="listing-content">
        <div className="listing-title">{listing.title}</div>
        <div className="listing-price">
          {formatNPR(listing.pricePerMonth)}
          <span>/mo</span>
        </div>

        <div className="tenure-badges">
          {listing.tenureOptions.map(tenure => (
            <span key={tenure} className="tenure-badge">
              {tenure}mo: {formatNPR(listing.tenurePricing[tenure])}
            </span>
          ))}
        </div>

        <div className="tag-badges">
          {listing.tags.map(tag => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>

        <div style={{ fontSize: '.75rem', color: 'var(--muted-fg)', marginTop: '.75rem' }}>
          📍 {listing.deliveryZones.join(', ')}
        </div>

        <div className="listing-stats">
          <div className="listing-stat">👁️ {formatViews(listing.views)}</div>
          <div className="listing-stat">🛒 {listing.rents}</div>
        </div>

        <div className="listing-actions">
          <div className="switch-container">
            <div
              className={`switch ${listing.status === 'active' ? 'active' : ''}`}
              onClick={() => onToggleStatus(listing.id)}
            >
              <div className="switch-handle" />
            </div>
            <span style={{ fontSize: '.75rem', color: 'var(--muted-fg)' }}>
              {listing.status === 'active' ? 'Active' : 'Paused'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '.25rem' }}>
            <button className="icon-btn" onClick={() => onEdit(listing.id)}>
              ✏️
            </button>
            <button className="icon-btn" onClick={() => onShare(listing.id)}>
              🔗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;