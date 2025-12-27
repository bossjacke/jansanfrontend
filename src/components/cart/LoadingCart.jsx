import React from 'react';

const LoadingCart = () => (
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
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '30px' }}>Shopping Cart</h1>
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
                <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '4px solid #eee', 
                    borderTop: '4px solid #4CAF50', 
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    animation: 'spin 1s linear infinite'
                }}></div>
                Loading your cart...
            </div>
        </div>
    </div>
);

// Add this CSS to your global styles or in a style tag
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default LoadingCart;