import React, { useState } from 'react';
import { ForgotPassword } from '../../api.js';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showOtpSent, setShowOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await ForgotPassword(email);
      setMessage(res.message || 'OTP sent successfully to your email');
      setShowOtpSent(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setMessage(null);
    setShowOtpSent(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Forgot Password Card */}
      <div className="relative bg-gray-200 shadow-xl rounded-xl p-6 w-80 text-center">
        {/* Avatar Circle */}
        <div className="w-16 h-16 bg-blue-300 text-gray-700 text-2xl font-bold flex items-center justify-center rounded-full mx-auto mb-4">
          {showOtpSent ? '✓' : '?'}
        </div>

        {/* Title */}
        <h2 className="text-green-600 font-semibold text-lg mb-3">
          {showOtpSent ? 'OTP Sent' : 'Forgot Password'}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          {showOtpSent 
            ? `Check your email for the 6-digit OTP sent to ${email}`
            : 'Enter your email to receive a password reset OTP'
          }
        </p>

        {!showOtpSent ? (
          /* Form */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-green-500 text-white placeholder-white rounded-lg py-2 text-center focus:ring-2 focus:ring-green-600 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            {/* Message Display */}
            {message && (
              <div className={`text-sm ${message.includes('sent') || message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}

            {/* Dashed Line */}
            <div className="border-t-4 border-dashed border-black w-3/4 mx-auto my-1"></div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-600 text-white rounded-md py-2 w-32 mx-auto hover:bg-green-700 focus:ring-2 focus:ring-green-400"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          /* OTP Sent View */
          <div className="flex flex-col gap-4">
            {/* Success Message */}
            <div className="text-green-600 text-sm">
              {message}
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-500">
              • OTP expires in 10 minutes<br/>
              • Check your spam folder<br/>
              • Use the OTP in Reset Password page
            </div>

            {/* Dashed Line */}
            <div className="border-t-4 border-dashed border-black w-3/4 mx-auto my-1"></div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleReset}
                className="bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 focus:ring-2 focus:ring-green-400 text-sm"
              >
                Send Again
              </button>
              <Link
                to="/reset-password"
                state={{ email }}
                className="bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-sm no-underline"
              >
                Reset Password
              </Link>
            </div>
          </div>
        )}

        {/* Back to Login Link */}
        <Link
          to="/login"
          className="absolute bottom-3 left-3 text-white bg-green-600 hover:bg-green-700 rounded-md text-xs px-3 py-1"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
