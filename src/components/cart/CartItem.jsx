import React, { useState } from 'react';
import gascylinder from '../../assets/gascylinder.avif';
import organicfertilizer from '../../assets/organicfertilizer.webp';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        border: '1px solid #eee'
      }}>
        <div style={{ color: '#f44336' }}>Error: Item data is missing</div>
      </div>
    );
  }

  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (item._id) onUpdateQuantity(item._id, newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (item._id) onUpdateQuantity(item._id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (item._id) onRemove(item._id);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '15px',
      border: '1px solid #eee'
    }}>
      <div style={{ width: '80px', height: '80px', marginRight: '15px', flexShrink: 0 }}>
        {item.productId?.image ? (
          <img 
            src={item.productId.image} 
            alt={item.productId?.name || 'Product'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
          />
        ) : (
          <>
            {item.productId?.type?.toLowerCase().includes('biogas') || 
             item.productId?.name?.toLowerCase().includes('biogas') ||
             item.productId?.type?.toLowerCase().includes('gas') ||
             item.productId?.name?.toLowerCase().includes('gas') ? (
              <img 
                src={gascylinder} 
                alt="Biogas Product" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
              />
            ) : item.productId?.type?.toLowerCase().includes('fertilizer') || 
                    item.productId?.name?.toLowerCase().includes('fertilizer') ||
                    item.productId?.type?.toLowerCase().includes('organic') ||
                    item.productId?.name?.toLowerCase().includes('organic') ? (
              <img 
                src={organicfertilizer} 
                alt="Fertilizer Product" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9e9e9e',
                fontSize: '14px'
              }}>
                No Image
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
          {item.productId?.name || 'Unknown Product'}
        </h4>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
          {item.productId?.type || 'Unknown Type'}
        </p>
        <p style={{ fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '10px' }}>
          Rs.{(item.price || 0).toLocaleString()}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <button
            style={{
              backgroundColor: '#f0f0f0',
              padding: '5px 10px',
              borderRadius: '4px 0 0 4px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={handleDecrease}
            disabled={quantity <= 1}
          >
            -
          </button>

          <span style={{
            padding: '0 15px',
            backgroundColor: '#f9f9f9',
            borderTop: '1px solid #ddd',
            borderBottom: '1px solid #ddd'
          }}>
            {quantity}
          </span>

          <button
            style={{
              backgroundColor: '#f0f0f0',
              padding: '5px 10px',
              borderRadius: '0 4px 4px 0',
              border: '1px solid #ddd',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={handleIncrease}
          >
            +
          </button>
        </div>

        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '10px', color: '#333' }}>
          Total: Rs.{((item.price || 0) * quantity).toLocaleString()}
        </p>

        <button 
          type="button" 
          style={{
            padding: '8px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onClick={handleRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
