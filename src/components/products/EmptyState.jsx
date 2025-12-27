import React from 'react';

const EmptyState = ({ selectedCategory, onViewAll }) => (
  <div className="products-empty">
    <div className="products-state-icon">📦</div>
    <h3 className="products-state-title">
      {selectedCategory === 'all'
        ? 'No products available at the moment'
        : `No ${selectedCategory} products available`}
    </h3>
    <p className="products-state-text">
      {selectedCategory === 'all'
        ? 'Check back later for new products'
        : 'Try selecting a different category'}
    </p>
    <button type="button" className="products-button" onClick={onViewAll}>
      View All Products
    </button>
  </div>
);

export default EmptyState;