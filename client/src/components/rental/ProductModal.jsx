import React, { useState, useEffect } from 'react';
import { rentalAPI } from '../../services/api';

const ProductModal = ({ product, isOpen, onClose, onBookNow, showToast }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      fetchProductDetails();
    }
  }, [product, isOpen]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await rentalAPI.getProductById(product.id);
      setProductDetails(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!product || !isOpen) return null;

  const discount = Math.round(((product.originalPrice - product.pricePerMonth) / product.originalPrice) * 100);
  const details = productDetails || product;

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div style={{textAlign: 'center', padding: '2rem'}}>Loading details...</div>
          ) : (
            <div className="product-detail-grid">
              <div className="product-detail-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-detail-info">
                <div className="product-detail-badges">
                  <span className="badge badge-secondary" style={{textTransform: 'capitalize'}}>{product.category}</span>
                  <span className="badge" style={{background: 'var(--secondary)', color: 'var(--secondary-foreground)'}}>
                    📍 {product.location}
                  </span>
                  {discount > 0 && <span className="badge badge-success">{discount}% OFF</span>}
                </div>
                <div className="product-detail-rating">
                  <div className="stars">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={star <= Math.round(product.rating) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={star <= Math.round(product.rating) ? 'filled' : 'empty'}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <span style={{fontWeight: 500}}>{product.rating}</span>
                  <span style={{color: 'var(--muted-foreground)'}}>({product.reviewCount} reviews)</span>
                </div>
                <div className="product-detail-price-box">
                  <div className="product-detail-price">
                    <span className="current">₹{product.pricePerMonth.toLocaleString('en-IN')}</span>
                    <span className="period">/month</span>
                  </div>
                  {discount > 0 && (
                    <div className="product-detail-savings">
                      <span className="original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="save">Save ₹{(product.originalPrice - product.pricePerMonth).toLocaleString('en-IN')}/month</span>
                    </div>
                  )}
                </div>
                <div className="product-detail-description">
                  <h4>Description</h4>
                  <p>{product.description}</p>
                </div>
                <div className="product-detail-actions">
                  <button className="btn btn-primary" onClick={() => { onClose(); /* Add to cart logic */ }}>
                    Add to Cart
                  </button>
                  <button className="btn btn-accent" onClick={() => onBookNow(product)}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {details.reviews && details.reviews.length > 0 && (
            <div className="reviews-section">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                </svg>
                Customer Reviews
              </h4>
              {details.reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-user">
                      <div className="review-avatar">{review.userName.charAt(0)}</div>
                      <span className="review-name">{review.userName}</span>
                    </div>
                    <div className="review-stars">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={star <= review.rating ? 'var(--warning)' : 'none'} stroke={star <= review.rating ? 'var(--warning)' : 'var(--muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-date">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;