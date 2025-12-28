import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "/api" : "https://sambackend-production.up.railway.app/api");
console.log("Using API URL:", API_URL);

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No auth token found in localStorage');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to handle API errors consistently
const handleApiError = (error, operation) => {
  console.error(`${operation} Error:`, error);
  
  // Handle network errors
  if (!error.response) {
    const errorMsg = error.message || 'Network error. Please check your connection and try again.';
    console.error(`${operation} Network Error:`, errorMsg);
    throw new Error(errorMsg);
  }
  
  // Get error message from response
  const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || `An error occurred during ${operation}.`;
  
  // Handle specific HTTP status codes
  switch (error.response.status) {
    case 400:
      throw new Error(errorMessage || 'Invalid request. Please check your input.');
    case 401:
      throw new Error('Unauthorized. Please login again.');
    case 403:
      throw new Error('Access denied. You do not have permission to perform this action.');
    case 404:
      throw new Error('Resource not found.');
    case 422:
      throw new Error(errorMessage || 'Invalid data provided.');
    case 500:
      throw new Error(errorMessage || 'Server error. Please try again later.');
    default:
      throw new Error(errorMessage);
  }
};

// Helper function to validate required parameters
const validateRequired = (value, paramName) => {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${paramName} is required`);
  }
};

// User API functions
export const RegisterUser = async (userData) => {
  try {
    validateRequired(userData, 'User data');
    validateRequired(userData.email, 'Email');
    validateRequired(userData.password, 'Password');
    
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
  } catch (err) {
    handleApiError(err, 'User Registration');
  }
};

export const LoginUser = async (credentials) => {
  try {
    validateRequired(credentials, 'Credentials');
    validateRequired(credentials.email, 'Email');
    validateRequired(credentials.password, 'Password');
    
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    return res.data;
  } catch (err) {
    handleApiError(err, 'User Login');
  }
};

export const GoogleLogin = async (credential) => {
  try {
    validateRequired(credential, 'Google credential');
    
    const res = await axios.post(`${API_URL}/auth/google-login`, { credential });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Google Login');
  }
};

export const ForgotPassword = async (email) => {
  try {
    validateRequired(email, 'Email');
    
    const res = await axios.post(`${API_URL}/password/forgot-password`, { email });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Forgot Password');
  }
};

export const ResetPassword = async (email, otp, newPassword) => {
  try {
    validateRequired(email, 'Email');
    validateRequired(otp, 'OTP');
    validateRequired(newPassword, 'New password');
    
    const res = await axios.post(`${API_URL}/password/reset-password`, {
      email,
      otp,
      newPassword
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Reset Password');
  }
};

// Product API functions
export const getAllProducts = async () => {
  try {
    console.log('Fetching products from:', `${API_URL}/products`);
    const res = await axios.get(`${API_URL}/products`);
    console.log('Products response:', res.data);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Get All Products');
  }
};

export const getProductById = async (productId) => {
  try {
    validateRequired(productId, 'Product ID');
    
    const res = await axios.get(`${API_URL}/products/${productId}`);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Get Product by ID');
  }
};

export const createProduct = async (productData) => {
  try {
    validateRequired(productData, 'Product data');
    validateRequired(productData.name, 'Product name');
    validateRequired(productData.price, 'Product price');
    
    const res = await axios.post(`${API_URL}/products`, productData, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Create Product');
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    validateRequired(productId, 'Product ID');
    validateRequired(productData, 'Product data');
    
    const res = await axios.put(`${API_URL}/products/${productId}`, productData, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Update Product');
  }
};

export const deleteProduct = async (productId) => {
  try {
    validateRequired(productId, 'Product ID');
    
    const res = await axios.delete(`${API_URL}/products/${productId}`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Delete Product');
  }
};

// Cart API functions
export const getCart = async () => {
  try {
    const res = await axios.get(`${API_URL}/cart`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    const error = handleApiError(err, 'Get Cart');
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    validateRequired(productId, 'Product ID');
    validateRequired(quantity, 'Quantity');
    
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    const res = await axios.post(`${API_URL}/cart/add`, {
      productId,
      quantity
    }, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    const error = handleApiError(err, 'Add to Cart');
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    validateRequired(itemId, 'Item ID');
    validateRequired(quantity, 'Quantity');
    
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    const res = await axios.put(`${API_URL}/cart/item/${itemId}`, {
      quantity
    }, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    const error = handleApiError(err, 'Update Cart Item');
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    validateRequired(itemId, 'Item ID');
    
    const res = await axios.delete(`${API_URL}/cart/item/${itemId}`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    const error = handleApiError(err, 'Remove from Cart');
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const res = await axios.delete(`${API_URL}/cart/clear`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Clear Cart');
  }
};

export const getCartSummary = async () => {
  try {
    const res = await axios.get(`${API_URL}/cart/summary`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Get Cart Summary');
  }
};

// Order API functions
export const createOrder = async (orderData) => {
  try {
    validateRequired(orderData, 'Order data');
    validateRequired(orderData.items, 'Order items');
    validateRequired(orderData.shippingAddress, 'Shipping address');
    
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    // Validate each item in the order
    orderData.items.forEach((item, index) => {
      validateRequired(item.productId, `Item ${index + 1} - Product ID`);
      validateRequired(item.quantity, `Item ${index + 1} - Quantity`);
      validateRequired(item.price, `Item ${index + 1} - Price`);
      
      if (item.quantity <= 0) {
        throw new Error(`Item ${index + 1} - Quantity must be greater than 0`);
      }
      if (item.price <= 0) {
        throw new Error(`Item ${index + 1} - Price must be greater than 0`);
      }
    });
    
    // Validate shipping address structure
    const requiredAddressFields = ['fullName', 'phone', 'addressLine1', 'city', 'postalCode', 'country'];
    requiredAddressFields.forEach(field => {
      validateRequired(orderData.shippingAddress[field], `Shipping address - ${field}`);
    });

    // Map field names if needed (frontend might send 'street' instead of 'addressLine1')
    if (orderData.shippingAddress.street && !orderData.shippingAddress.addressLine1) {
      orderData.shippingAddress.addressLine1 = orderData.shippingAddress.street;
    }
    
    console.log('📤 Sending order data to backend:', JSON.stringify(orderData, null, 2));
    const res = await axios.post(`${API_URL}/orders/create`, orderData, {
      headers: getAuthHeaders()
    });
    console.log('📥 Order creation response:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ Order API Error:', err);
    
    // If it's a validation error, re-throw it directly
    if (err.message && (
        err.message.includes('is required') || 
        err.message.includes('must be greater than 0') || 
        err.message.includes('Order must contain')
    )) {
      throw err;
    }
    
    // For API errors (network or server response), use the error handler
    const error = handleApiError(err, 'Create Order');
    throw error;
  }
};

export const getMyOrders = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_URL}/orders/my?${queryString}` : `${API_URL}/orders/my`;
    const res = await axios.get(url, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Get My Orders');
  }
};

export const getOrderById = async (orderId) => {
  try {
    validateRequired(orderId, 'Order ID');
    
    const res = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Get Order by ID');
  }
};

export const cancelOrder = async (orderId) => {
  try {
    validateRequired(orderId, 'Order ID');
    
    const res = await axios.delete(`${API_URL}/orders/${orderId}/cancel`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Cancel Order');
  }
};


// Admin API functions
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/users`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Get All Users');
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    validateRequired(userId, 'User ID');
    validateRequired(role, 'Role');
    
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      throw new Error('Role must be either "user" or "admin"');
    }
    
    const res = await axios.put(`${API_URL}/users/${userId}/role`, {
      role
    }, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Update User Role');
  }
};

export const deleteUser = async (userId) => {
  try {
    validateRequired(userId, 'User ID');
    
    const res = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Delete User');
  }
};

// Admin Order Management API functions
export const getAdminOrders = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_URL}/orders/admin/orders?${queryString}` : `${API_URL}/orders/admin/orders`;
    const res = await axios.get(url, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Get Admin Orders');
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    validateRequired(orderId, 'Order ID');
    
    const res = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Get Order Details');
  }
};

export const updateOrderStatus = async (orderId, statusData) => {
  try {
    validateRequired(orderId, 'Order ID');
    validateRequired(statusData, 'Status data');
    validateRequired(statusData.status, 'Status');
    
    const validStatuses = ['Processing', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(statusData.status)) {
      throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
    }
    
    const res = await axios.put(`${API_URL}/orders/${orderId}/status`, statusData, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Update Order Status');
  }
};
