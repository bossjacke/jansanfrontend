import React from 'react';

const ProductSummary = ({ products }) => {
  const biogasProducts = products.filter(p => p.type === 'biogas');
  const fertilizerProducts = products.filter(p => p.type === 'fertilizer');

  return (
    <div className="product-summary">
      <h3 className="product-summary-title">Product Summary</h3>
      <div className="product-summary-grid">
        <div className="product-summary-card">
          <div className="product-summary-number">
            {products.length}
          </div>
          <div className="product-summary-label">Total Products</div>
        </div>

        <div className="product-summary-card">
          <div className="product-summary-number product-summary-number--biogas">
            {biogasProducts.length}
          </div>
          <div className="product-summary-label">Biogas Units</div>
        </div>

        <div className="product-summary-card">
          <div className="product-summary-number product-summary-number--fertilizer">
            {fertilizerProducts.length}
          </div>
          <div className="product-summary-label">Fertilizers</div>
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;