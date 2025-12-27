import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { getMyOrders, cancelOrder } from '../../api.js';
import './Checkout.css'; // Import custom CSS

const OrderSummarySection = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data.data.orders || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId);
      await cancelOrder(orderId);
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: 'Cancelled' }
            : order
        )
      );
      
      setShowCancelConfirm(null);
      toast.success('Order cancelled successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const confirmCancelOrder = (orderId) => {
    setShowCancelConfirm(orderId);
  };

  const cancelConfirmation = () => {
    setShowCancelConfirm(null);
  };

  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Processing': return 'orderSummarySectionStatusBadge--processing';
      case 'Delivered': return 'orderSummarySectionStatusBadge--delivered';
      case 'Cancelled': return 'orderSummarySectionStatusBadge--cancelled';
      default: return 'orderSummarySectionStatusBadge--default';
    }
  };

  if (!user) return null;

  return (
    <div className="orderSummarySection">
      <div 
        className="orderSummarySectionHeader"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="orderSummarySectionTitleGroup">
          <h2 className="orderSummarySectionTitle">
            <svg className="orderSummarySectionTitleIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Orders Summary
          </h2>
          <p className="orderSummarySectionSubtitle">View your recent orders and track their status</p>
        </div>
        <div className="orderSummarySectionMeta">
          {orders.length > 0 && (
            <span className="orderSummarySectionCount">
              {orders.length} Orders
            </span>
          )}
          <svg 
            className={`orderSummarySectionToggleIcon ${isExpanded ? 'orderSummarySectionToggleIcon--expanded' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="orderSummarySectionContent">
          {loading && (
            <div className="orderSummarySectionLoading">
              <div className="orderSummarySectionLoadingText">Loading orders...</div>
            </div>
          )}

          {error && (
            <div className="orderSummarySectionError">
              <div className="orderSummarySectionErrorMessage">{error}</div>
              <button
                onClick={fetchOrders}
                className="orderSummarySectionBtnPrimary"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="orderSummarySectionEmptyState">
              <div className="orderSummarySectionEmptyStateIcon">📦</div>
              <h3 className="orderSummarySectionEmptyStateTitle">No orders yet</h3>
              <p className="orderSummarySectionEmptyStateText">Start shopping to see your orders here!</p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <>
              <div className="orderSummarySectionStats">
                <h3 className="orderSummarySectionStatsTitle">Order Statistics</h3>
                <div className="orderSummarySectionStatsGrid">
                  {[
                    { label: 'Total Orders', value: orders.length, colorClass: 'orderSummarySectionStatValue--default' },
                    { label: 'Processing', value: orders.filter(o => o.orderStatus === 'Processing').length, colorClass: 'orderSummarySectionStatValue--processing' },
                    { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'Delivered').length, colorClass: 'orderSummarySectionStatValue--delivered' },
                    { label: 'Cancelled', value: orders.filter(o => o.orderStatus === 'Cancelled').length, colorClass: 'orderSummarySectionStatValue--cancelled' }
                  ].map(({ label, value, colorClass }) => (
                    <div key={label} className="orderSummarySectionStatCard">
                      <div className={`orderSummarySectionStatValue ${colorClass}`}>{value}</div>
                      <div className="orderSummarySectionStatLabel">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="orderSummarySectionOrderList">
                {orders.map((order) => (
                  <div key={order._id} className="orderSummarySectionOrderItem">
                    <div className="orderSummarySectionOrderItemHeader">
                      <div>
                        <div className="orderSummarySectionOrderNumber">Order #{order.orderNumber || order._id?.slice(-8)}</div>
                        <div className="orderSummarySectionOrderDate">{formatDate(order.createdAt)}</div>
                      </div>
                      <div className="orderSummarySectionOrderMetaActions">
                        <div className={`orderSummarySectionStatusBadge ${getStatusColorClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </div>
                        {order.orderStatus === 'Processing' && (
                          <button
                            onClick={() => confirmCancelOrder(order._id)}
                            disabled={cancellingOrderId === order._id}
                            className="orderSummarySectionBtnCancel"
                          >
                            {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="orderSummarySectionOrderProducts">
                      {order.products && order.products.slice(0, 3).map((product, index) => (
                        <div key={index} className="orderSummarySectionOrderProductItem">
                          <div className="orderSummarySectionOrderProductName">
                            <span>{product.productId?.name || 'Product'}</span>
                            <span className="orderSummarySectionOrderProductQuantity">×{product.quantity}</span>
                          </div>
                          <span className="orderSummarySectionOrderProductTotal">Rs.{(product.price * product.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      {order.products && order.products.length > 3 && (
                        <div className="orderSummarySectionMoreItems">+{order.products.length - 3} more items</div>
                      )}
                    </div>

                    <div className="orderSummarySectionOrderTotal">
                      <div className="orderSummarySectionOrderTotalLabel">Total:</div>
                      <div className="orderSummarySectionOrderTotalValue">Rs.{(order.totalAmount || 0).toLocaleString()}</div>
                    </div>
                  </div>
                ))}

                {/* Cancel Confirmation Modal */}
                {showCancelConfirm && (
                  <div className="orderSummarySectionModalOverlay">
                    <div className="orderSummarySectionModal">
                      <h3 className="orderSummarySectionModalTitle">Confirm Order Cancellation</h3>
                      <p className="orderSummarySectionModalText">
                        Are you sure you want to cancel this order? This action cannot be undone.
                      </p>
                      <div className="orderSummarySectionModalActions">
                        <button
                          onClick={cancelConfirmation}
                          className="orderSummarySectionBtnSecondary"
                        >
                          No, Keep Order
                        </button>
                        <button
                          onClick={() => handleCancelOrder(showCancelConfirm)}
                          disabled={cancellingOrderId === showCancelConfirm}
                          className="orderSummarySectionBtnDanger"
                        >
                          {cancellingOrderId === showCancelConfirm ? 'Cancelling...' : 'Yes, Cancel Order'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="orderSummarySectionViewAllContainer">
                <button
                  onClick={() => window.location.href = '/orders'}
                  className="orderSummarySectionBtnViewAll"
                >
                  View All Orders
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummarySection;
