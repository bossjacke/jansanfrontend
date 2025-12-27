import React from 'react';

const ZoomAnimation = ({ children, isAnimating }) => {
  return (
    <div 
      className={`transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
      }`}
    >
      {children}
    </div>
  );
};

export default ZoomAnimation;
