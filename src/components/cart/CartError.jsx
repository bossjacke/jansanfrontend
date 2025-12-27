import React from 'react';

const CartError = ({ error }) => (
    <div style={{
        backgroundColor: '#ffebee',
        border: '1px solid #ffcdd2',
        color: '#c62828',
        padding: '10px 15px',
        borderRadius: '5px',
        marginBottom: '15px'
    }}>
        {error}
    </div>
);

export default CartError;