import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getAllProducts, getAdminOrders } from '../../api.js';
import AdminLayout from './AdminLayout.jsx';
import AdminHeader from './AdminHeader.jsx';
import LoadingState from './LoadingState.jsx';
import ErrorDisplay from './ErrorDisplay.jsx';
import ProductTab from './ProductTab.jsx';
import UsersTab from './UsersTab.jsx';
import OrderManagement from './OrderManagement.jsx';
import './Admin.css';

function Admin() {
  const { token, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!isAuthenticated) return navigate('/login');
    if (!isAdmin) return navigate('/');
    
    setLoading(false);
    fetchInitialData();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchInitialData = async () => {
    try {
      const usersResponse = await getAllUsers();
      setUsers(usersResponse.users || []);
      
      const productsResponse = await getAllProducts();
      setProducts(productsResponse.data || []);
      
      const ordersResponse = await getAdminOrders({ page: 1, limit: 50 });
      setOrders(ordersResponse.data?.orders || []);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load dashboard data');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.users || []);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error refreshing products:', err);
    }
  };

  const refreshOrders = async () => {
    try {
      const response = await getAdminOrders({ page: 1, limit: 50 });
      setOrders(response.data?.orders || []);
    } catch (err) {
      console.error('Error refreshing orders:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  if (loading) return <LoadingState />;

  return (
    <AdminLayout>
      <AdminHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        productsLength={products.length} 
        usersLength={users.length} 
        ordersLength={orders.length} 
      />

      {error && <ErrorDisplay error={error} />}

      {activeTab === 'products' && <ProductTab onProductsUpdate={refreshProducts} />}
      {activeTab === 'users' && <UsersTab users={users} onUserUpdate={fetchUsers} />}
      {activeTab === 'orders' && <OrderManagement onOrdersUpdate={refreshOrders} />}
    </AdminLayout>
  );
}

export default Admin;