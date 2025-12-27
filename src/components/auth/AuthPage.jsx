import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { RegisterUser } from "../../api.js";

function AuthPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  
  // Login state
  const [loginForm, setLoginForm] = useState({ email: "", password: "", rememberMe: false });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [oneTapSkipped, setOneTapSkipped] = useState(false);
  
  // Register state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    locationId: "",
    acceptTerms: false,
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Login validation
  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginForm.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!loginForm.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  // Register validation
  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerForm.name.trim()) {
      newErrors.name = "Name is required";
    } else if (registerForm.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!registerForm.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!registerForm.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(registerForm.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }
    
    if (!registerForm.locationId.trim()) {
      newErrors.locationId = "Location ID is required";
    }
    
    if (!registerForm.password) {
      newErrors.password = "Password is required";
    } else if (registerForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }
    
    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!registerForm.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }
    
    return newErrors;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validateLoginForm();
    if (Object.keys(newErrors).length > 0) {
      setLoginErrors(newErrors);
      return;
    }

    setLoginLoading(true);
    setLoginErrors({});
    try {
      const result = await login(loginForm);
      if (result.success) {
        navigate('/');
      } else {
        setLoginErrors({ general: result.error });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        navigate('/');
      } else {
        setLoginErrors({ general: result.error });
      }
    } catch (error) {
      console.error("Google login error:", error);
      setLoginErrors({ general: "Google login failed. Please try again." });
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validateRegisterForm();
    if (Object.keys(newErrors).length > 0) {
      setRegisterErrors(newErrors);
      return;
    }

    setRegisterLoading(true);
    setRegisterErrors({});
    
    const { confirmPassword, acceptTerms, ...formData } = registerForm;

    try {
      const res = await RegisterUser(formData);
      setSuccessMessage(res.message || "Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        setActiveTab('login');
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterErrors({ 
        general: error.response?.data?.message || "Registration failed. Please try again." 
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  // Handle input changes
  const handleLoginInputChange = (field) => (e) => {
    setLoginForm({ ...loginForm, [field]: e.target.value });
    if (loginErrors[field]) {
      setLoginErrors({ ...loginErrors, [field]: '' });
    }
  };

  const handleRegisterInputChange = (field) => (e) => {
    const value = field === 'acceptTerms' ? e.target.checked : e.target.value;
    setRegisterForm({ ...registerForm, [field]: value });
    if (registerErrors[field]) {
      setRegisterErrors({ ...registerErrors, [field]: '' });
    }
  };

  React.useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: "367194647798-0qjrumukncrmjj543lv31q5gop97elfk.apps.googleusercontent.com",
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left side - Forms (3/5) */}
      <div className="flex-1 lg:flex-[3] flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">X</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'login' ? 'Sign in to your account to continue' : 'Join us today and get started'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              {loginErrors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {loginErrors.general}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={handleLoginInputChange('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                    loginErrors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={loginErrors.email ? 'true' : 'false'}
                />
                {loginErrors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {loginErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={handleLoginInputChange('password')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                    loginErrors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={loginErrors.password ? 'true' : 'false'}
                />
                {loginErrors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {loginErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Google Login */}
              {oneTapSkipped && (
                <div className="mt-4">
                  <GoogleOAuthProvider clientId="367194647798-0qjrumukncrmjj543lv31q5gop97elfk.apps.googleusercontent.com">
                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setLoginErrors({ general: "Google login failed" })}
                      />
                    </div>
                  </GoogleOAuthProvider>
                </div>
              )}
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {registerErrors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {registerErrors.general}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={registerForm.name}
                  onChange={handleRegisterInputChange('name')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                    registerErrors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                />
                {registerErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {registerErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerForm.email}
                  onChange={handleRegisterInputChange('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                    registerErrors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                />
                {registerErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {registerErrors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={registerForm.phone}
                  onChange={handleRegisterInputChange('phone')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                    registerErrors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                />
                {registerErrors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {registerErrors.phone}
                  </p>
                )}
              </div>

              {/* Location ID Field */}
              <div>
                <label htmlFor="locationId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location ID
                </label>
                <input
                  id="locationId"
                  type="text"
                  placeholder="Enter your location ID"
                  value={registerForm.locationId}
                  onChange={handleRegisterInputChange('locationId')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                    registerErrors.locationId ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                />
                {registerErrors.locationId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {registerErrors.locationId}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={registerForm.password}
                  onChange={handleRegisterInputChange('password')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                    registerErrors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                />
                {registerErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {registerErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterInputChange('confirmPassword')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                    registerErrors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                />
                {registerErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {registerErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Acceptance */}
              <div>
                <div className="flex items-start">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    checked={registerForm.acceptTerms}
                    onChange={handleRegisterInputChange('acceptTerms')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{' '}
                    <Link to="/terms" className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {registerErrors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {registerErrors.acceptTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={registerLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                {registerLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing {activeTab === 'login' ? 'in' : 'up'}, you agree to our{' '}
              <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Images (2/5) */}
      <div className="hidden lg:block lg:flex-[2] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700">
          {activeTab === 'login' ? (
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              alt="Modern workspace"
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Education dashboard"
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-slate-900/70 dark:bg-slate-900/50"></div>
        </div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4">
              {activeTab === 'login' ? 'Start Your Journey' : 'Join Our Community'}
            </h2>
            <p className="text-xl opacity-90">
              {activeTab === 'login' 
                ? 'Access powerful tools and resources to grow your business'
                : 'Connect with thousands of learners and unlock your potential'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
