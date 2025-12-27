import React, { useState, useEffect } from 'react';
import { ResetPassword } from '../../api.js';
import { useNavigate, Link, useLocation } from 'react-router-dom';

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Reset Password Card */}
      <div className="relative bg-gray-200 shadow-xl rounded-xl p-6 w-80 text-center">
        {/* Avatar Circle */}
        <div className="w-16 h-16 bg-blue-300 text-gray-700 text-2xl font-bold flex items-center justify-center rounded-full mx-auto mb-4">
          🔒
        </div>

        {/* Title */}
        <h2 className="text-green-600 font-semibold text-lg mb-3">Reset Password</h2>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          Enter your email, OTP, and new password
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email address"
            className="bg-green-500 text-white placeholder-white rounded-lg py-2 text-center focus:ring-2 focus:ring-green-600 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="text"
            placeholder="6-digit OTP"
            className="bg-green-500 text-white placeholder-white rounded-lg py-2 text-center focus:ring-2 focus:ring-green-600 focus:outline-none"
            value={otp}
            onChange={handleOtpChange}
            maxLength="6"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="New password"
            className="bg-green-500 text-white placeholder-white rounded-lg py-2 text-center focus:ring-2 focus:ring-green-600 focus:outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="6"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            className="bg-green-500 text-white placeholder-white rounded-lg py-2 text-center focus:ring-2 focus:ring-green-600 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
            disabled={loading}
          />

          {/* Message Display */}
          {message && (
            <div className={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Help Text */}
        <div className="text-xs text-gray-500 mt-3">
          • OTP expires in 10 minutes<br/>
          • Check your email for the 6-digit code
        </div>

        {/* Back to Login Link */}
        <Link
          to="/login"
          className="absolute bottom-3 left-3 text-white bg-green-600 hover:bg-green-700 rounded-md text-xs px-3 py-1"
        >
          Back to Login
        </Link>

        {/* Request OTP Link */}
        <Link
          to="/forgot-password"
          className="absolute bottom-3 right-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-xs px-3 py-1"
        >
          Request OTP
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
