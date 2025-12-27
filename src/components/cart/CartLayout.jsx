import React from 'react';

const CartLayout = ({ children, itemCount }) => (
    <div style={{
        minHeight: 'calc(100vh - 80px)',
        padding: '30px 20px',
        backgroundColor: '#f5f5f5'
    }}>
        <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                borderBottom: '1px solid #eee',
                paddingBottom: '15px'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>Shopping Cart</h1>
                <div style={{ fontSize: '14px', color: '#666' }}>
                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                </div>
            </div>
            {children}
        </div>
    </div>
);

export default CartLayout;