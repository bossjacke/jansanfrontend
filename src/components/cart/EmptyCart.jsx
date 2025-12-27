import React from 'react';

const EmptyCart = ({ onStartShopping }) => (
    <div style={{
        textAlign: 'center',
        padding: '60px 20px'
    }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛒</div>
        <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>Your cart is empty</h3>
        <p style={{ color: '#999', marginBottom: '25px', fontSize: '16px' }}>Add some products to get started!</p>
        <button 
            style={{
                padding: '12px 30px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
            }}
            onClick={onStartShopping}
        >
            Start Shopping
        </button>
    </div>
);

export default EmptyCart;