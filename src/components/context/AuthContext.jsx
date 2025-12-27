import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoginUser, RegisterUser, GoogleLogin } from '../../api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      // For now, we'll just set the user from localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await LoginUser(credentials);
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error details:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await GoogleLogin(credential);
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true };
      }
      return { success: false, error: 'Google login failed' };
    } catch (error) {
      console.error('Google login error details:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Google login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await RegisterUser(userData);
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Registration error details:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    googleLogin,
    register,
    logout,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
