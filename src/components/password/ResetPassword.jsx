import React, { useState, useEffect } from 'react';
import { ResetPassword } from '../../api.js';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './password.css'; // Import the custom CSS

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  // Pre-fill email if coming from ForgotPassword page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    // Input validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage('Please enter a valid 6-digit OTP');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    try {
      const res = await ResetPassword(email, otp, newPassword);
      setMessage(res.message || 'Password reset successfully! You can now log in.');
      setMessageType('success');
      // Redirect to login after successful reset
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not reset password. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="resetPage">
      {/* Reset Password Card */}
      <div className="resetCard">
        {/* Avatar Circle */}
        <div className="resetAvatar">
          🔒
        </div>

        {/* Title */}
        <h2 className="resetTitle">Reset Password</h2>
        
        {/* Description */}
        <p className="resetDescription">
          Enter your email, OTP, and new password
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="resetForm">
          <input
            type="email"
            placeholder="Email address"
            className="resetInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="text"
            placeholder="6-digit OTP"
            className="resetInput"
            value={otp}
            onChange={handleOtpChange}
            maxLength="6"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="New password"
            className="resetInput"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="6"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            className="resetInput"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
            disabled={loading}
          />

          {/* Message Display */}
          {message && (
            <div className={`resetMessage ${messageType === 'success' ? 'resetMessage--success' : 'resetMessage--error'}`}>
              {message}
            </div>
          )}

          {/* Dashed Line */}
          <div className="resetSeparator"></div>

          {/* Submit Button */}
          <button
            type="submit"
            className="resetSubmitBtn"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Help Text */}
        <div className="resetHelpText">
          • OTP expires in 10 minutes<br/>
          • Check your email for the 6-digit code
        </div>

        {/* Back to Login Link */}
        <Link
          to="/login"
          className="resetBackToLogin"
        >
          Back to Login
        </Link>

        {/* Request OTP Link */}
        <Link
          to="/forgot-password"
          className="resetRequestOtpBtn"
        >
          Request OTP
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordPage;