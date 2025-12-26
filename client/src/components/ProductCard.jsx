import React, { useState } from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, showToast, onLoginClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleBookNow = () => {
    if (onLoginClick) {
      onLoginClick(); // Show login page
    } else {
      showToast('Login Required', 'Please login to book this item');
    }
  };

  const handleAddToCart = () => {
    if (onLoginClick) {
      onLoginClick(); // Show login page
    } else {
      showToast('Login Required', 'Please login to add items to cart');
    }
  };

  // Generate star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < fullStars ? 'text-yellow-500' : 'text-gray-300'}>
        {i < fullStars ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <div className="product-card">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.title}
        className="product-image"
      />

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

        {/* Price and Rating */}
        <div className="product-footer">
          <div className="product-price-row">
            <div>
              <div className="product-price">
                Rs. {product.price}
                {product.tenureDiscount && (
                  <span className="discount-badge ml-2">
                    {product.tenureDiscount} off
                  </span>
                )}
              </div>
              <div className="product-rating">
                {product.rating} 
                <span className="stars-inline">
                  {renderStars(product.rating)}
                </span>
                ({product.reviews})
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
          <h4 className="expanded-title">Customer Reviews</h4>
          <div className="expanded-reviews">
            {product.review_snippet ? (
              <p className="review-text">"{product.review_snippet}"</p>
            ) : (
              <>
                <p className="review-text">
                  "Great quality furniture! Perfect for my apartment in Kathmandu." - Priya S.
                </p>
                <p className="review-text">
                  "Fast delivery and excellent customer service. Highly recommended!" - Rajesh K.
                </p>
              </>
            )}
          </div>
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