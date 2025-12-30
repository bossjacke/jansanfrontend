import React from 'react';
import './Admin.css';

const ErrorDisplay = ({ error }) => (
  <div className="error-display">
    {error}
  </div>
);

export default ErrorDisplay;