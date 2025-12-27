import React from 'react';

const ErrorState = ({ error, onRetry }) => (
  <div className="products-full-page">
    <div className="products-center-box">
      <div className="products-state">
        <div className="products-state-icon">⚠️</div>
        <h2 className="products-state-title">Oops! Something went wrong</h2>
        <p className="products-state-text">{error}</p>
        <button type="button" className="products-button" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  </div>
);

export default ErrorState;