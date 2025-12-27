import React, { useState } from "react";
import { RegisterUser } from "../../api.js";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css'; // இதை import பண்ணு

function Register({ onRegister, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const notify = () => toast.success("Registration successful!");

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";

    if (!form.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = "Phone number must be at least 10 digits";

    if (!form.location.trim()) newErrors.location = "Location is required";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) newErrors.password = "Password must contain uppercase, lowercase, and number";

    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (!form.acceptTerms) newErrors.acceptTerms = "You must accept the terms and conditions";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const { confirmPassword, acceptTerms, ...formData } = form;

    try {
      const res = await RegisterUser(formData);
      setSuccessMessage(res.message || "Registration successful! Redirecting to login...");

      if (onRegister) onRegister(res);
      if (onClose) onClose();

      notify(); // Show toast notification
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorMsg = error?.message || error?.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    const value = field === 'acceptTerms' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
    if (errors[field]) { // Clear error for this field when user starts typing
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left side - Form */}
        <div className="register-form-wrapper">
          <div className="register-card">
            {/* Logo/Branding */}
            <div className="register-header">
              <div className="register-logo">
                <span className="logo-text">X</span> {/* Placeholder for logo */}
              </div>
              <h1>Create Account</h1>
              <p>Join us today and get started</p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="register-form">
              {errors.general && (
                <div className="error-message">
                  {errors.general}
                </div>
              )}

              {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
              )}

              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleInputChange('name')}
                  className={errors.name ? 'error' : ''}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (<p className="field-error">{errors.name}</p>)}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleInputChange('email')}
                  className={errors.email ? 'error' : ''}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (<p className="field-error">{errors.email}</p>)}
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleInputChange('phone')}
                  className={errors.phone ? 'error' : ''}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                />
                {errors.phone && (<p className="field-error">{errors.phone}</p>)}
              </div>

              {/* Location Field */}
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  placeholder="Enter your location (e.g., Colombo, Sri Lanka)"
                  value={form.location}
                  onChange={handleInputChange('location')}
                  className={errors.location ? 'error' : ''}
                  aria-invalid={errors.location ? 'true' : 'false'}
                />
                {errors.location && (<p className="field-error">{errors.location}</p>)}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleInputChange('password')}
                  className={errors.password ? 'error' : ''}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && (<p className="field-error">{errors.password}</p>)}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  className={errors.confirmPassword ? 'error' : ''}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                {errors.confirmPassword && (<p className="field-error">{errors.confirmPassword}</p>)}
              </div>

              {/* Terms Acceptance */}
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={handleInputChange('acceptTerms')}
                  />
                  <label htmlFor="acceptTerms">
                    I agree to the{' '}
                    <Link to="/terms">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>
                {errors.acceptTerms && (<p className="field-error">{errors.acceptTerms}</p>)}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Sign In Link */}
              <div className="signin-link">
                <span>Already have an account? </span>
                <Link to="/login">Sign in</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="register-image-section">
          <div className="image-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Education dashboard"
            className="register-image"
          />
          <div className="image-text">
            <h2>Join Our Community</h2>
            <p>Connect with thousands of learners and unlock your potential</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;