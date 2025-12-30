import React from 'react';
import './Admin.css';

const LoadingState = () => (
  <div className="loading-layout">
    <div className="loading-container">
      <h1 className="loading-title">Admin Panel</h1>
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  </div>
);

export default LoadingState;