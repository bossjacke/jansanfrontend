import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ amount, orderId, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Payment system not loaded');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amount,
          orderId: orderId,
          currency: 'inr'
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        data.data.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await fetch('http://localhost:3003/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId: orderId
          })
        });

        onPaymentSuccess(paymentIntent);
      } else {
        setError('Payment was not successful');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      onPaymentError(err);
      setLoading(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border rounded-md bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processing...' : `Pay Rs.${amount}`}
      </button>
    </form>
  );
};

const StripePayment = ({ amount, orderId, onPaymentSuccess, onPaymentError }) => {
  const [stripe, setStripe] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initStripe = async () => {
      try {
        const response = await fetch('http://localhost:3003/api/payment/stripe-config');
        const { publishableKey } = await response.json();
        const stripeInstance = await loadStripe(publishableKey);
        setStripe(stripeInstance);
      } catch (err) {
        setError('Failed to load payment system');
        console.error('Stripe initialization error:', err);
      }
    };

    initStripe();
  }, []);

  const createPaymentIntent = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amount,
          orderId: orderId,
          currency: 'inr'
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      setClientSecret(data.data.clientSecret);
    } catch (err) {
      setError(err.message);
      onPaymentError?.(err);
    } finally {
      setLoading(false);
    }
  };

  if (!stripe) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Secure Payment</h2>
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-lg font-semibold">Amount: Rs.{amount}</p>
          {orderId && <p className="text-sm text-gray-500">Order ID: {orderId}</p>}
        </div>
        <button
          onClick={createPaymentIntent}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Initializing...' : `Pay Rs.${amount}`}
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Secured by Stripe</p>
          <p className="mt-1">Your payment information is encrypted and secure</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Secure Payment</h2>
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-lg font-semibold">Amount: Rs.{amount}</p>
          {orderId && <p className="text-sm text-gray-500">Order ID: {orderId}</p>}
        </div>
        <button
          onClick={createPaymentIntent}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Initializing...' : `Pay Rs.${amount}`}
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Secured by Stripe</p>
          <p className="mt-1">Your payment information is encrypted and secure</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Secure Payment</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-lg font-semibold">Amount: Rs.{amount}</p>
        {orderId && <p className="text-sm text-gray-500">Order ID: {orderId}</p>}
      </div>
      <Elements stripe={stripe} options={{ clientSecret }}>
        <CheckoutForm
          amount={amount}
          orderId={orderId}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      </Elements>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Secured by Stripe</p>
        <p className="mt-1">Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};

export default StripePayment;
