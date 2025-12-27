import React, { useState } from 'react';
import ZoomAnimation from '../transitions/ZoomAnimation.jsx';
import gasCylinderImage from '../../assets/gascylinder.avif';
import fertilizerImage from '../../assets/organicfertilizer.webp';

const ProductCard = ({ product, addToCart }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const imgSrc =
    product.image || (product.type === 'biogas' ? gasCylinderImage : fertilizerImage);

  return (
    <ZoomAnimation isAnimating={isAnimating}>
      <div className="product-card">
        <div className="product-card-image-wrapper">
          {!imgError ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="product-card-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="product-card-image-fallback">
              <div className="product-card-fallback-icon">
                {product.type === 'biogas' ? '🔥' : '🌱'}
              </div>
              <div>No Image</div>
            </div>
          )}

          <div className="product-card-badge-wrapper">
            <span
              className={
                'product-card-badge ' +
                (product.type === 'biogas'
                  ? 'product-card-badge--biogas'
                  : 'product-card-badge--fertilizer')
              }
            >
              {product.type === 'biogas' ? 'Biogas' : 'Fertilizer'}
            </span>
          </div>
        </div>

        <div className="product-card-content">
          <h3 className="product-card-title">{product.name}</h3>

          {product.description && (
            <p className="product-card-description">{product.description}</p>
          )}

          <div className="product-card-meta">
            {product.capacity && (
              <div className="product-card-meta-row">
                <strong>Capacity: </strong>
                {product.capacity}
              </div>
            )}
            {product.warrantyPeriod && (
              <div className="product-card-meta-row">
                <strong>Warranty: </strong>
                {product.warrantyPeriod}
              </div>
            )}
          </div>

          <div className="product-card-footer">
            <div className="product-card-price">
              Rs.{product.price.toLocaleString()}
            </div>
            <button
              type="button"
              className="product-card-button"
              onClick={handleAddToCart}
            >
              + Add to Cart
            </button>
          </div>
        </div>
      </div>
    </ZoomAnimation>
  );
};

export default ProductCard;
