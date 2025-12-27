import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrderById, cancelOrder } from '../../api.js';
import './Checkout.css'; // Import custom CSS

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrderById(orderId);
      if (data.success) {
        setOrder(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrderHandler = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const data = await cancelOrder(orderId);
      if (data.success) {
        toast.success('Order cancelled successfully');
        fetchOrderDetails(); // Refresh order details
      } else {
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Network error. Please try again.');
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Processing': return 'orderDetailStatus--processing';
      case 'Delivered': return 'orderDetailStatus--delivered';
      case 'Cancelled': return 'orderDetailStatus--cancelled';
      default: return 'orderDetailStatus--default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Processing': return '⏳ Processing';
      case 'Delivered': return '✅ Delivered';
      case 'Cancelled': return '❌ Cancelled';
      default: return status;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'pending': return '⏳ Cash on Delivery';
      case 'paid': return '✅ Paid';
      case 'failed': return '❌ Failed';
      case 'cancelled': return '❌ Cancelled';
      default: return status;
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

  if (loading) {
    return (
      <div className="orderDetailContainer">
        <div className="orderDetailLoading">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orderDetailContainer">
        <div className="orderDetailError">
          {error}
          <button onClick={fetchOrderDetails} className="orderDetailBtnRetry">Retry</button>
        </div>
        <button onClick={() => navigate('/orders')} className="orderDetailBtnBack">
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="orderDetailContainer">
        <div className="orderDetailError">Order not found</div>
        <button onClick={() => navigate('/orders')} className="orderDetailBtnBack">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="orderDetailContainer">
      <div className="orderDetailHeader">
        <button onClick={() => navigate('/orders')} className="orderDetailBtnBack">
          ← Back to Orders
        </button>
        <h1 className="orderDetailHeaderTitle">Order Details</h1>
      </div>

      <div className="orderDetailContent">
        {/* Order Header */}
        <div className="orderDetailHeaderCard">
          <div className="orderDetailTitleSection">
            <h2>Order #{order.orderNumber}</h2>
            <p className="orderDetailDate">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="orderDetailStatuses">
            <span 
              className={`orderDetailStatusBadge ${getStatusColorClass(order.orderStatus)}`}
            >
              {getStatusText(order.orderStatus)}
            </span>
            <span className="orderDetailPaymentStatusBadge">
              {getPaymentStatusText(order.paymentStatus || 'pending')}
            </span>
          </div>
        </div>

        {/* Order Timeline */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="orderDetailTimeline">
            <h3>Order Timeline</h3>
            <div className="orderDetailTimelineItems">
              {order.statusHistory.map((item, index) => (
                <div key={index} className="orderDetailTimelineItem">
                  <div className="orderDetailTimelineDot"></div>
                  <div className="orderDetailTimelineContent">
                    <span className="orderDetailTimelineStatus">{getStatusText(item.status)}</span>
                    <span className="orderDetailTimelineDate">{formatDate(item.timestamp)}</span>
                    {item.note && <p className="orderDetailTimelineNote">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="orderDetailDetailsGrid">
          {/* Order Information */}
          <div className="orderDetailInfoCard">
            <h3>Order Information</h3>
            <div className="orderDetailInfoGrid">
              <div className="orderDetailInfoItem">
                <label className="orderDetailInfoLabel">Order Number:</label>
                <span className="orderDetailInfoValue">{order.orderNumber}</span>
              </div>
              <div className="orderDetailInfoItem">
                <label className="orderDetailInfoLabel">Order Date:</label>
                <span className="orderDetailInfoValue">{formatDate(order.createdAt)}</span>
              </div>
              <div className="orderDetailInfoItem">
                <label className="orderDetailInfoLabel">Payment Method:</label>
                <span className="orderDetailInfoValue">Cash on Delivery</span>
              </div>
              <div className="orderDetailInfoItem">
                <label className="orderDetailInfoLabel">Payment Status:</label>
                <span className="orderDetailInfoValue">{getPaymentStatusText(order.paymentStatus || 'pending')}</span>
              </div>
              <div className="orderDetailInfoItem">
                <label className="orderDetailInfoLabel">Order Status:</label>
                <span className="orderDetailInfoValue">{getStatusText(order.orderStatus)}</span>
              </div>
              {order.deliveryDate && (
                <div className="orderDetailInfoItem">
                  <label className="orderDetailInfoLabel">Delivery Date:</label>
                  <span className="orderDetailInfoValue">{formatDate(order.deliveryDate)}</span>
                </div>
              )}
              {order.estimatedDelivery && !order.deliveryDate && (
                <div className="orderDetailInfoItem">
                  <label className="orderDetailInfoLabel">Estimated Delivery:</label>
                  <span className="orderDetailInfoValue">{formatDate(order.estimatedDelivery)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="orderDetailShippingAddressCard">
            <h3>Shipping Address</h3>
            <div className="orderDetailAddressContent">
              {order.shippingAddress ? (
                <>
                  <p className="orderDetailAddressName"><strong>{order.shippingAddress.fullName}</strong></p>
                  <p className="orderDetailAddressLine">{order.shippingAddress.addressLine1}</p>
                  <p className="orderDetailAddressLine">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p className="orderDetailAddressLine">{order.shippingAddress.country}</p>
                  <p className="orderDetailAddressPhone">📱 {order.shippingAddress.phone}</p>
                </>
              ) : (
                <p>{order.deliveryLocation}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="orderDetailProductsCard">
          <h3>Products ({order.products.length})</h3>
          <div className="orderDetailProductsList">
            {order.products.map((product, index) => (
              <div key={index} className="orderDetailProductItem">
                <div className="orderDetailProductInfo">
                  <h4 className="orderDetailProductName">{product.productId?.name || 'Product'}</h4>
                  <p className="orderDetailProductDescription">
                    {product.productId?.description || 'No description available'}
                  </p>
                  <p className="orderDetailProductType">
                    Type: {product.productId?.type || 'N/A'}
                  </p>
                </div>
                <div className="orderDetailProductDetails">
                  <div className="orderDetailProductQuantity">
                    <label>Quantity:</label>
                    <span>{product.quantity}</span>
                  </div>
                  <div className="orderDetailProductPrice">
                    <label>Price:</label>
                    <span>Rs.{product.price?.toLocaleString()}</span>
                  </div>
                  <div className="orderDetailProductSubtotal">
                    <label>Subtotal:</label>
                    <span>Rs.{(product.price * product.quantity)?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="orderDetailSummaryCard">
          <h3>Order Summary</h3>
          <div className="orderDetailSummaryItems">
            <div className="orderDetailSummaryRow">
              <span>Subtotal ({order.products.length} items):</span>
              <span>Rs.{order.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="orderDetailSummaryRow">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="orderDetailSummaryRow orderDetailSummaryRow--total">
              <span>Total:</span>
              <span>{order.formattedTotal || `Rs.${order.totalAmount?.toLocaleString()}`}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="orderDetailPaymentInfoCard">
          <h3>Payment Information</h3>
          <div className="orderDetailPaymentDetails">
            <div className="orderDetailPaymentItem">
              <label>Payment Method:</label>
              <span>Cash on Delivery</span>
            </div>
            <div className="orderDetailPaymentItem">
              <label>Payment Status:</label>
              <span>{getPaymentStatusText(order.paymentStatus || 'pending')}</span>
            </div>
            <div className="orderDetailPaymentItem">
              <label>Amount:</label>
              <span>Rs.{order.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="orderDetailPaymentItem">
              <label>Payment Instructions:</label>
              <span>Please pay when you receive your order</span>
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        {order.adminNotes && (
          <div className="orderDetailAdminNotesCard">
            <h3>Admin Notes</h3>
            <p>{order.adminNotes}</p>
          </div>
        )}

        {/* Order Actions */}
        <div className="orderDetailActionsCard">
          <h3>Actions</h3>
          <div className="orderDetailActionButtons">
            {order.orderStatus === 'Processing' && (
              <button
                className="orderDetailBtnAction orderDetailBtnAction--cancel"
                onClick={cancelOrderHandler}
              >
                Cancel Order
              </button>
            )}
            <button 
              className="orderDetailBtnAction orderDetailBtnAction--print"
              onClick={() => window.print()}
            >
              Print Order
            </button>
            <button 
              className="orderDetailBtnAction orderDetailBtnAction--support"
              onClick={() => toast.info('Contact support at support@example.com')}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
