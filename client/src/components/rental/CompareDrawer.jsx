import React from 'react';
import { useRental } from '../../contexts/RentalContext';

const CompareDrawer = ({ showToast }) => {
  const { compareList, clearCompare, toggleCompare, addToCart } = useRental();

  if (compareList.length === 0) return null;

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId);
    if (success) {
      showToast('Added to cart', 'Product added to cart successfully.');
    }
  };

  return (
    <div className="compare-drawer show">
      <div className="compare-drawer-inner container">
        <div className="compare-drawer-content">
          <div className="compare-header">
            <h3>Compare Products (<span>{compareList.length}</span>/3)</h3>
            <button className="btn btn-ghost btn-sm" onClick={clearCompare}>Clear All</button>
          </div>
          <div className="compare-grid">
            {compareList.map(product => (
              <div key={product.id} className="compare-item">
                <button className="compare-item-remove" onClick={() => toggleCompare(product)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </button>
                <div className="compare-item-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <h4>{product.name}</h4>
                <div className="compare-item-details">
                  <div className="compare-item-row">
                    <span>Price</span>
                    <span className="price">₹{product.pricePerMonth}/mo</span>
                  </div>
                  <div className="compare-item-row">
                    <span>Rating</span>
                    <span className="rating">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      {product.rating}
                    </span>
                  </div>
                  <div className="compare-item-row">
                    <span>Category</span>
                    <span style={{textTransform: 'capitalize'}}>{product.category}</span>
                  </div>
                  <div className="compare-item-row">
                    <span>Location</span>
                    <span style={{textTransform: 'capitalize'}}>{product.location}</span>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" style={{width: '100%', marginTop: '0.75rem'}} onClick={() => handleAddToCart(product.id)}>
                  Add to Cart
                </button>
              </div>
            ))}
            {Array(3 - compareList.length).fill(0).map((_, i) => (
              <div key={`empty-${i}`} className="compare-empty-slot">Add product to compare</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareDrawer;