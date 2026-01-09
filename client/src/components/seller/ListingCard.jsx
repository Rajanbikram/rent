import React from 'react';
import { useState } from 'react';

const ListingCard = ({ listing, onToggleStatus, onEdit, onShare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatNPR = (amount) => `NPR ${amount.toLocaleString('en-NP')}`;
  const formatViews = (count) => count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();

  // ✅ FIXED: Convert tenureOptions object to array
  const getActiveTenures = () => {
    if (!listing.tenureOptions) return [];
    
    const tenureMap = {
      threeMonths: { label: '3mo', months: 3 },
      sixMonths: { label: '6mo', months: 6 },
      twelveMonths: { label: '12mo', months: 12 }
    };

    return Object.entries(listing.tenureOptions)
      .filter(([key, value]) => value === true)
      .map(([key]) => ({
        key,
        label: tenureMap[key]?.label || key,
        months: tenureMap[key]?.months || 0
      }));
  };

  // ✅ FIXED: Get pricing for a tenure
  const getTenurePrice = (tenureKey) => {
    if (!listing.tenurePricing) return listing.pricePerMonth;
    return listing.tenurePricing[tenureKey] || listing.pricePerMonth;
  };

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

  // ✅ FIXED: Safe array checks
  const images = Array.isArray(listing.images) && listing.images.length > 0 
    ? listing.images 
    : ['https://via.placeholder.com/300x200?text=No+Image'];

  const tags = Array.isArray(listing.tags) ? listing.tags : [];
  const deliveryZones = Array.isArray(listing.deliveryZones) ? listing.deliveryZones : [];
  const activeTenures = getActiveTenures();

  return (
    <div className={`listing-card fade-in ${listing.status === 'paused' ? 'paused' : ''}`}>
      <div className="image-carousel">
        <img 
          src={images[currentImageIndex]} 
          alt={listing.title || 'Product'}
        />
        
        {images.length > 1 && (
          <>
            <button className="carousel-btn prev" onClick={handlePrevImage}>
              ←
            </button>
            <button className="carousel-btn next" onClick={handleNextImage}>
              →
            </button>
            <div className="carousel-dots">
              {images.map((_, index) => (
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
        <div className="listing-title">{listing.title || 'Untitled'}</div>
        <div className="listing-price">
          {formatNPR(listing.pricePerMonth || 0)}
          <span>/mo</span>
        </div>

        {/* ✅ FIXED: Properly render tenure options */}
        {activeTenures.length > 0 && (
          <div className="tenure-badges">
            {activeTenures.map(tenure => (
              <span key={tenure.key} className="tenure-badge">
                {tenure.label}: {formatNPR(getTenurePrice(tenure.key))}
              </span>
            ))}
          </div>
        )}

        {/* ✅ FIXED: Safe tag rendering */}
        {tags.length > 0 && (
          <div className="tag-badges">
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="tag-badge">{tag}</span>
            ))}
          </div>
        )}

        {/* ✅ FIXED: Safe delivery zones */}
        {deliveryZones.length > 0 && (
          <div style={{ fontSize: '.75rem', color: 'var(--muted-fg)', marginTop: '.75rem' }}>
            📍 {deliveryZones.join(', ')}
          </div>
        )}

        <div className="listing-stats">
          <div className="listing-stat">👁️ {formatViews(listing.views || 0)}</div>
          <div className="listing-stat">🛒 {listing.rents || 0}</div>
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