import React from 'react';

const CartSummary = ({ totalAmount, onContinueShopping, onCheckout }) => {
  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #eee',
      marginTop: '25px'
    }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>Order Summary</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ color: '#666' }}>Total Amount:</span>
          <span style={{ fontWeight: '500', color: '#333' }}>Rs.{totalAmount.toLocaleString()}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#666' }}>Delivery:</span>
          <span style={{ color: '#333' }}>Free (3-5 days)</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <button
          style={{
            flex: 1,
            backgroundColor: '#f0f0f0',
            color: '#333',
            padding: '12px',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
            border: '1px solid #ddd'
          }}
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>

        <button
          style={{
            flex: 1,
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
            border: 'none'
          }}
          onClick={onCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
