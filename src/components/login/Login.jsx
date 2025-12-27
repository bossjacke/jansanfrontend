import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import img from '../../assets/logo.png'; // Assuming this is your logo
import imglogin from '../../assets/login.jpg'; // Assuming this is your login image
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './login.css'; // Import the new CSS file

function Login({ onLogin, onClose }) {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [oneTapSkipped, setOneTapSkipped] = useState(false);
  const notify = () => toast.success("Login successful!");

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const result = await login(form);
      if (result.success) {
        notify();
        if (onLogin) onLogin();
        if (onClose) onClose();
        navigate('/');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message || "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        if (onLogin) onLogin();
        if (onClose) onClose();
        navigate('/');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message || "Google login failed. Please try again." });
    }
  };

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID", // Replace with your actual client ID
        callback: handleGoogleLogin
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setOneTapSkipped(true);
        }
      });
    }
  }, []);

  return (
    <div className="login-page">
      {/* Left side - Form */}
      <div className="login-form-area">
        <div className="login-content-wrapper">
          {/* Logo/Branding */}
          <div className="login-branding">
            <div className="login-logo-container">
              <img src={img} alt="Logo" className="login-logo" />
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            {errors.general && (
              <div className="general-error-message">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`input-field ${errors.email ? 'input-field--error' : ''}`}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="field-error-message">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`input-field ${errors.password ? 'input-field--error' : ''}`}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="field-error-message">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <div className="checkbox-group">
                <input
                  id="remember"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                  className="checkbox-input"
                />
                <label htmlFor="remember" className="checkbox-label">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="loginbtn-primary"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Google Login */}
            {oneTapSkipped && (
              <div className="google-login-container">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
                  <div className="google-login-button-wrapper">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => setErrors({ general: "Google login failed" })}
                    />
                  </div>
                </GoogleOAuthProvider>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="signup-link-wrapper">
              <span className="signup-text">Don't have an account? </span>
              <Link to="/register" className="signup-link">
                Sign up
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="login-footer-links">
            <p className="footer-text">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right side - Image */}
      <div className="login-image-area">
        <img
          src={imglogin}
          alt="Modern workspace"
          className="login-image"
        />
        <div className="image-overlay-bg"></div> {/* For gradient effect */}
        <div className="image-dark-overlay"></div> {/* For dark overlay */}
        <div className="image-text-content">
          <div className="image-text-wrapper">
            <h2 className="image-text-title">Start Your Journey</h2>
            <p className="image-text-subtitle">
              Access powerful tools and resources to grow your business
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;