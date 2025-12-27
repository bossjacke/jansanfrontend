import React from 'react';

const LoadingState = () => (
  <div className="products-full-page">
    <div className="products-center-box">
      <div className="products-state">
        <div className="loading-spinner" />
        <h2 className="products-state-title">Loading Products</h2>
        <p className="products-state-text">
          Please wait while we fetch our products...
        </p>
      </div>
    </div>
  </div>
);

export default LoadingState;