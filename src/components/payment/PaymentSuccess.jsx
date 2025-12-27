import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Get payment details from URL params or state
    const queryParams = new URLSearchParams(location.search);
    const paymentIntentId = queryParams.get('payment_intent');
    const paymentIntentClientSecret = queryParams.get('payment_intent_client_secret');

    if (paymentIntentId) {
      // Fetch payment details from backend
      fetchPaymentDetails(paymentIntentId);
    } else {
      setLoading(false);
    }
  }, [location]);

  const fetchPaymentDetails = async (paymentIntentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/api/payment/by-intent/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentDetails(data.data);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your order has been confirmed and is being processed.
        </p>

        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium">{paymentDetails._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{paymentDetails.formattedAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600 capitalize">{paymentDetails.status}</span>
              </div>
              {paymentDetails.orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{paymentDetails.orderId.orderNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(paymentDetails.paidAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            View My Orders
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>A confirmation email has been sent to your registered email address.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
