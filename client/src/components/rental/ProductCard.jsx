import React from 'react';
import { useRental } from '../../contexts/RentalContext';

const ProductCard = ({ product, onViewDetails, showToast }) => {
  const { favorites, compareList, addToCart, toggleFavorite, toggleCompare } = useRental();
  
  const isFavorite = favorites.includes(product.id);
  const isCompare = compareList.some(p => p.id === product.id);
  const discount = Math.round(((product.originalPrice - product.pricePerMonth) / product.originalPrice) * 100);
  
  const badgeConfig = {
    hotDeal: { class: 'badge-hot-deal', text: '🔥 Hot Deal' },
    studentOffer: { class: 'badge-student-offer', text: '🎓 Student Offer' },
    limitedTime: { class: 'badge-limited-time', text: '⏰ Limited Time' }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product.id);
    if (success) {
      showToast('Added to cart', `${product.name || product.title || 'Product'} has been added to your cart.`);
    } else {
      showToast('Error', 'Failed to add to cart. Please login.', 'error');
    }
  };

  const handleToggleCompare = () => {
    toggleCompare(product);
    if (!isCompare && compareList.length >= 3) {
      showToast('Limit reached', 'You can compare up to 3 products.', 'error');
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image || product.images?.[0] || '/placeholder.png'} 
          alt={product.name || product.title || 'Product'} 
          className="product-image" 
        />
        <div className="product-badges">
          {product.badge && badgeConfig[product.badge] && (
            <span className={`badge ${badgeConfig[product.badge].class}`}>
              {badgeConfig[product.badge].text}
            </span>
          )}
          {discount > 0 && <span className="badge badge-success">{discount}% OFF</span>}
        </div>
        <button className={`favorite-btn ${isFavorite ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
        <div className="product-quick-actions">
          <button className="btn btn-sm" onClick={() => onViewDetails(product)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            View
          </button>
          <button className={`btn btn-sm btn-compare ${isCompare ? 'active' : ''}`} onClick={handleToggleCompare}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
              <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
              <path d="M7 21h10"/>
              <path d="M12 3v18"/>
              <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="product-content">
        <div className="product-meta">
          <span className="badge badge-secondary" style={{textTransform: 'capitalize'}}>{product.category}</span>
          <span className="product-location">📍 {product.location}</span>
        </div>
        
        <h3 className="product-title">{product.name || product.title || 'Unnamed Product'}</h3>
        
        <div className="product-price">
          <span className="current">₹{product.pricePerMonth?.toLocaleString('en-IN') || 0}</span>
          <span className="period">/month</span>
          {discount > 0 && <span className="original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>}
        </div>
        <button className="btn btn-primary" onClick={handleAddToCart}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;