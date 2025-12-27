import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAdminOrders, getOrderDetails, updateOrderStatus } from '../../api.js';

const OrderManagement = ({ onOrdersUpdate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [statusUpdateModal, setStatusUpdateModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchAllOrders();
  }, [filter, searchTerm, currentPage]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(filter !== 'all' && { status: filter }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await getAdminOrders(params);

      if (response.success) {
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
        setError('');
      } else {
        setError(response.message || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Network error. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status, notes) => {
    try {
      const response = await updateOrderStatus(orderId, {
        status: status,
        adminNotes: notes
      });

      if (response.success) {
        toast.success('Order status updated successfully');
        setStatusUpdateModal(false);
        setAdminNotes('');
        setSelectedStatus('');
        fetchAllOrders();
        if (showOrderDetails) {
          fetchOrderDetails(orderId);
        }
        // Notify parent component to refresh its count
        if (onOrdersUpdate) {
          onOrdersUpdate();
        }
      } else {
        toast.error(response.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Network error. Please try again.');
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await getOrderDetails(orderId);

      if (response.success) {
        setSelectedOrder(response.data);
        setShowOrderDetails(true);
      } else {
        toast.error(response.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      toast.error('Network error. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return '#ffc107';
      case 'Delivered':
        return '#28a745';
      case 'Cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Processing':
        return '⏳ Processing';
      case 'Delivered':
        return '✅ Delivered';
      case 'Cancelled':
        return '❌ Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const openStatusUpdateModal = (order, status) => {
    setSelectedOrder(order);
    setSelectedStatus(status);
    setAdminNotes('');
    setStatusUpdateModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="order-header">
        <h2>Order Management</h2>
        <div className="order-controls">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header-info">
                <div className="order-id">
                  <strong>Order ID:</strong> {order._id}
                </div>
                <div className="order-date">
                  <strong>Date:</strong> {formatDate(order.createdAt)}
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                  >
                    {getStatusText(order.orderStatus)}
                  </span>
                </div>
              </div>
              
              <div className="order-details">
                <div className="customer-info">
                  <strong>Customer:</strong> {order.userId?.name || 'N/A'}
                </div>
                <div className="order-total">
                  <strong>Total:</strong> Rs.{order.totalAmount}
                </div>
                <div className="order-items">
                  <strong>Items:</strong> {order.products?.length || 0}
                </div>
              </div>

              <div className="order-actions">
                <button
                  onClick={() => fetchOrderDetails(order._id)}
                  className="btn btn-primary"
                >
                  View Details
                </button>
                <select
                  onChange={(e) => openStatusUpdateModal(order, e.target.value)}
                  value=""
                  className="status-select"
                >
                  <option value="">Update Status</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Order Details</h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>Status:</strong> {getStatusText(selectedOrder.orderStatus)}</p>
                <p><strong>Total:</strong> Rs.{selectedOrder.totalAmount}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              </div>
              
              <div className="customer-details">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.userId?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedOrder.userId?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.userId?.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress?.addressLine1 || 'N/A'}</p>
              </div>

              <div className="order-products">
                <h4>Products</h4>
                {selectedOrder.products?.map((product, index) => (
                  <div key={index} className="product-item">
                    <p><strong>Product:</strong> {product.productId?.name || 'N/A'}</p>
                    <p><strong>Quantity:</strong> {product.quantity}</p>
                    <p><strong>Price:</strong> Rs.{product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusUpdateModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Order Status</h3>
              <button
                onClick={() => setStatusUpdateModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Current Status:</strong> {getStatusText(selectedOrder.orderStatus)}</p>
              
              <div className="form-group">
                <label>New Status:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Status</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admin Notes:</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="form-control"
                  rows="3"
                  placeholder="Add any notes about this status update..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setStatusUpdateModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateOrderStatus(selectedOrder._id, selectedStatus, adminNotes)}
                className="btn btn-primary"
                disabled={!selectedStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
