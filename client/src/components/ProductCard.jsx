import React, { useState } from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, showToast, onLoginClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleBookNow = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      showToast('Login Required', 'Please login to book this item');
    }
  };

  const handleAddToCart = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      showToast('Login Required', 'Please login to add items to cart');
    }
  };

  return (
    <div className={`product-card ${showDetails ? 'expanded' : ''}`}>
      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.title}
          className="product-image"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      </div>

      {/* Product Content */}
      <div className="product-content">
        <div>
          <h4 className="product-title">{product.title}</h4>
          <div className="product-meta">
            Category: {product.category} • {product.location}
          </div>

          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="badges-row">
              {product.badges.map((badge, index) => (
                <span key={index} className="badge-pill">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price - NO RATING */}
        <div className="product-footer">
          <div className="product-price">
            Rs. {product.price}
            {product.tenureDiscount && (
              <span className="discount-badge">
                {product.tenureDiscount} off
              </span>
            )}
          </div>

          {/* Action Buttons - NO ICONS */}
          <div className="product-actions">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn-view-details"
            >
              {showDetails ? 'Less' : 'View Details'}
            </button>
            <button
              onClick={handleBookNow}
              className="btn-book-now"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="product-expanded">
          <h4 className="expanded-title">Product Details</h4>
          
          {/* Description */}
          <div className="expanded-section">
            <p className="detail-text">
              {product.description || 'High-quality rental item available in your area. Contact us for more details.'}
            </p>
          </div>

          {/* Delivery Zones */}
          {product.deliveryZones && product.deliveryZones.length > 0 && (
            <div className="expanded-section">
              <h5 className="expanded-subtitle">Available In</h5>
              <div className="badges-row">
                {product.deliveryZones.map((zone, index) => (
                  <span key={index} className="badge-pill">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tenure Options */}
          {product.tenureOptions && (
            <div className="expanded-section">
              <h5 className="expanded-subtitle">Rental Duration Options</h5>
              <div className="tenure-options">
                {product.tenureOptions.threeMonths && <span className="tenure-badge">3 Months</span>}
                {product.tenureOptions.sixMonths && <span className="tenure-badge">6 Months</span>}
                {product.tenureOptions.twelveMonths && <span className="tenure-badge">12 Months</span>}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="btn-add-cart-active"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;