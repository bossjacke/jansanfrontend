import React from 'react';
import './Admin.css';

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-header">
        <div>
          <h3 className="product-name">{product.name}</h3>
          <span className={`product-type ${product.type}`}>
            {product.type === 'biogas' ? '🔥 Biogas' : '🌱 Fertilizer'}
          </span>
        </div>
        <div className="product-price">
          Rs.{product.price.toLocaleString()}
        </div>
      </div>

      {product.description && (
        <p className="product-description">{product.description}</p>
      )}

      <div className="product-meta">
        {product.capacity && (
          <div>
            <span className="meta-label">Capacity:</span>
            <span className="meta-value">{product.capacity}</span>
          </div>
        )}
        {product.warrantyPeriod && (
          <div>
            <span className="meta-label">Warranty:</span>
            <span className="meta-value">{product.warrantyPeriod}</span>
          </div>
        )}
        <div>
          <span className="meta-label">Stock:</span>
          <span className="meta-value">{product.stock}</span>
        </div>
        <div>
          <span className="meta-label">Type:</span>
          <span className="meta-value capitalize">{product.type}</span>
        </div>
      </div>

      <div className="product-actions">
        <button
          className="btn-edit"
          onClick={() => onEdit(product)}
        >
          Edit
        </button>
        <button
          className="btn-delete"
          onClick={() => onDelete(product._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProductCard;