import React, { useState } from 'react';
import { ForgotPassword } from '../../api.js';
import { Link } from 'react-router-dom';
import './password.css'; // Import the custom CSS

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
    <div className="forgetPage">
      {/* Forgot Password Card */}
      <div className="forgetCard">
        {/* Avatar Circle */}
        <div className="forgetAvatar">
          {showOtpSent ? '✓' : '?'}
        </div>

        {/* Title */}
        <h2 className="forgetTitle">
          {showOtpSent ? 'OTP Sent' : 'Forgot Password'}
        </h2>

        {/* Description */}
        <p className="forgetDescription">
          {showOtpSent 
            ? `Check your email for the 6-digit OTP sent to ${email}`
            : 'Enter your email to receive a password reset OTP'
          }
        </p>

        {!showOtpSent ? (
          /* Form */
          <form onSubmit={handleSubmit} className="forgetForm">
            <input
              type="email"
              placeholder="Enter your email"
              className="forgetInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            {/* Message Display */}
            {message && (
              <div className={`forgetMessage ${message.includes('sent') || message.includes('successfully') ? 'forgetMessage--success' : 'forgetMessage--error'}`}>
                {message}
              </div>
            )}

            {/* Dashed Line */}
            <div className="forgetSeparator"></div>

            {/* Submit Button */}
            <button
              type="submit"
              className="forgetSubmitBtn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          /* OTP Sent View */
          <div className="forgetOtpSentView">
            {/* Success Message */}
            <div className="forgetMessage forgetMessage--success">
              {message}
            </div>

            {/* Instructions */}
            <div className="forgetInstructions">
              • OTP expires in 10 minutes<br/>
              • Check your spam folder<br/>
              • Use the OTP in Reset Password page
            </div>

            {/* Dashed Line */}
            <div className="forgetSeparator"></div>

            {/* Action Buttons */}
            <div className="forgetActionButtons">
              <button
                onClick={handleReset}
                className="forgetActionBtn"
              >
                Send Again
              </button>
              <Link
                to="/reset-password"
                state={{ email }}
                className="forgetActionLink"
              >
                Reset Password
              </Link>
            </div>
          </div>
        )}

        {/* Back to Login Link */}
        <Link
          to="/login"
          className="forgetBackToLogin"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;