import React from 'react';
import { useRental } from '../../contexts/RentalContext';
import ProductCard from './ProductCard';

const ProductGrid = ({ onViewDetails, showToast }) => {
  const { products, loading } = useRental();

  if (loading) {
    return <div style={{textAlign: 'center', padding: '3rem'}}>Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found matching your filters.</p>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="products-header">
        <h2>Browse Products <span id="productCount">({products.length} items)</span></h2>
      </div>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onViewDetails={onViewDetails}
            showToast={showToast}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;