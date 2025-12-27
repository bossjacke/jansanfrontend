import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCart, getMyOrders, createOrder, cancelOrder } from '../../api.js';
import './Checkout.css'; // Import custom CSS


function Orders() {
  const { user, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', postalCode: '', country: 'Sri Lanka'
  });
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.fromCart && user) {
      fetchCartAndShowCheckout();
    } else {
      fetchOrders();
    }
  }, [user, location.state]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchCartAndShowCheckout = async () => {
    try {
      setLoading(true);
      const data = await getCart();

      if (data.data.items.length > 0) {
        setCart(data.data);
        setShowCheckout(true);
      } else {
        setShowCheckout(false);
        fetchOrders(); // If cart is empty, show regular orders
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      setShowCheckout(false);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const createOrderHandler = async () => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      toast.warning('Please fill in all shipping address fields');
      return;
    }

    try {
      setOrderProcessing(true);

      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName: user?.fullName || user?.name || '',
          phone: user?.phone || '',
          addressLine1: shippingAddress.street,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country
        },
        totalAmount: cart.totalAmount,
        paymentMethod: 'cash_on_delivery'
      };

      await createOrder(orderData); // Assuming success field is inside data.success

      setSuccessMessage('Order placed successfully! Cash on delivery selected.');
      setShowCheckout(false);
      setCart(null);
      fetchOrders();

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create order');
    } finally {
      setOrderProcessing(false);
    }
  };

  const cancelCheckout = () => {
    setShowCheckout(false);
    setCart(null);
    fetchOrders();
  };

  if (loading) return (
    <div className="ordersPage ordersPage--loading">
      <div className="ordersContentWrapper">
        <h1 className="ordersTitle">My Orders</h1>
        <div className="ordersLoading">Loading...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="ordersPage ordersPage--error">
      <div className="ordersContentWrapper">
        <h1 className="ordersTitle">My Orders</h1>
        <div className="ordersError">
          <div className="ordersErrorMessage">{error}</div>
          <button className="ordersBtnPrimary" onClick={fetchOrders}>Retry</button>
        </div>
      </div>
    </div>
  );

  const CheckoutForm = () => (
    <div className="ordersCheckoutForm">
      <h1 className="ordersTitle">Checkout</h1>
      
      <div className="ordersCheckoutSummary">
        <h3 className="ordersCheckoutSummaryTitle">Order Summary</h3>
        {cart.items.map((item) => (
          <div key={item.productId?._id || item.productId} className="ordersCheckoutSummaryItem">
            <div>
              <div className="ordersCheckoutSummaryProductName">{item.productId?.name || 'Product'}</div>
              <div className="ordersCheckoutSummaryProductType">
                {item.productId?.type === 'biogas' ? '🔥 Biogas Unit' : '🌱 Fertilizer'}
              </div>
              <div className="ordersCheckoutSummaryProductQtyPrice">Qty: {item.quantity} × Rs.{item.price}</div>
            </div>
            <div className="ordersCheckoutSummaryProductTotal">Rs.{(item.price * item.quantity).toLocaleString()}</div>
          </div>
        ))}
        <div className="ordersCheckoutSummaryTotal">
          <div className="ordersCheckoutSummaryTotalLabel">Total</div>
          <div className="ordersCheckoutSummaryTotalValue">Rs.{cart.totalAmount.toLocaleString()}</div>
        </div>
      </div>

      <div className="ordersCheckoutShipping">
        <h3 className="ordersCheckoutShippingTitle">Shipping Address</h3>
        <div className="ordersCheckoutShippingGrid">
          <input type="text" name="street" value={shippingAddress.street} onChange={handleAddressChange} 
            className="ordersCheckoutInputField" placeholder="Street Address *" required />
          <div className="ordersCheckoutShippingGrid2Col">
            <input type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange} 
              className="ordersCheckoutInputField" placeholder="City *" required />
            <input type="text" name="state" value={shippingAddress.state} onChange={handleAddressChange} 
              className="ordersCheckoutInputField" placeholder="State" />
          </div>
          <div className="ordersCheckoutShippingGrid2Col">
            <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleAddressChange} 
              className="ordersCheckoutInputField" placeholder="Postal Code *" required />
            <input type="text" name="country" value={shippingAddress.country} onChange={handleAddressChange} 
              className="ordersCheckoutInputField" placeholder="Country" />
          </div>
        </div>
      </div>

      <div className="ordersCheckoutPaymentMethod">
        <div className="ordersCheckoutPaymentMethodTitle"><strong>Payment Method:</strong> Cash on Delivery</div>
        <div className="ordersCheckoutPaymentMethodText">Pay when you receive your order</div>
      </div>

      <div className="ordersCheckoutActions">
        <button className="ordersBtnSecondary" onClick={cancelCheckout} disabled={orderProcessing}>Cancel</button>
        <button className="ordersBtnPrimary" onClick={createOrderHandler} disabled={orderProcessing}>
          {orderProcessing ? 'Processing...' : `Place Order • Rs.${cart.totalAmount.toLocaleString()}`}
        </button>
      </div>
    </div>
  );

  const OrderCard = ({ order }) => {
    const getStatusColorClass = (status) => {
      switch (status) {
        case 'Processing': return 'ordersOrderStatus--processing';
        case 'Delivered': return 'ordersOrderStatus--delivered';
        case 'Cancelled': return 'ordersOrderStatus--cancelled';
        default: return 'ordersOrderStatus--default';
      }
    };

    return (
      <div className="ordersOrderCard">
        <div className="ordersOrderCardHeader">
          <div>
            {/* <div className="ordersOrderNumber">Order #{order.orderNumber || order._id} </div> */}
            <div className="ordersOrderDate">{order.products.map((product, index) => product.productId?.name.slice(0, 18 ))}</div>
          </div>
          <div className={`ordersOrderStatusBadge ${getStatusColorClass(order.orderStatus)}`}>
            {order.orderStatus}
          </div>
        </div>

        <div className="ordersOrderCardProducts">
          {order.products && order.products.length > 0 ? (
            order.products.map((product, index) => (
              <div key={index} className="ordersOrderCardProductItem">
                <div className="ordersOrderCardProductInfo">
                  <div className="ordersOrderCardProductName">{product.productId?.name || 'Product'}</div>
                  <div className="ordersOrderDate">{formatDate(order.createdAt)}</div>
                  <div className="ordersOrderCardProductType">
                    {product.productId?.type === 'biogas' ? '🔥 Biogas Unit' : '🌱 Fertilizer'}
                  </div>
                  <div className="ordersOrderCardProductQtyPrice">Qty: {product.quantity} × Rs.{product.price}</div>
                </div>
                <div className="ordersOrderCardProductTotal">Rs.{(product.price * product.quantity).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div className="ordersOrderCardNoProducts">No products found</div>
          )}
        </div>

        <div className="ordersOrderCardSummaryTotal">
          <div><strong>Total Amount:</strong></div>
          <div className="ordersOrderCardTotalValue">Rs.{(order.totalAmount || 0).toLocaleString()}</div>
        </div>

        {order.deliveryDate && (
          <div className="ordersOrderCardDelivery">
            <div><strong>Delivery Date:</strong></div>
            <div className="ordersOrderCardDeliveryDate">{formatDate(order.deliveryDate)}</div>
          </div>
        )}

        <div className="ordersOrderCardActions">
          <button 
            className="ordersBtnViewDetails" 
            onClick={() => navigate(`/orders/${order._id}`)}
          >
            View Details
          </button>
          {order.orderStatus === 'Delivered' && (
            <button 
              className="ordersBtnPrimary" 
              onClick={() => toast.info('Review feature coming soon!')}
            >
              Write Review
            </button>
          )}
          {order.orderStatus === 'Processing' && (
            <button 
              className="ordersBtnCancelOrder" 
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this order?')) {
                  cancelOrder(order._id).then(() => {
                    toast.success('Order cancelled successfully');
                    fetchOrders();
                  }).catch(err => {
                    toast.error(err.message || 'Failed to cancel order');
                  });
                }
              }}
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="ordersPage">
      <div className="ordersContentWrapper">
        {successMessage && (
          <div className="ordersMessageSuccess">
            {successMessage}
            <button onClick={() => setSuccessMessage('')} className="ordersMessageCloseBtn">×</button>
          </div>
        )}
        {showCheckout && cart ? <CheckoutForm /> : (
          <div>
            <div className="ordersHeader">
              <h1 className="ordersTitle">My Orders</h1>
              <div className="ordersCount">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</div>
            </div>

            {orders.length === 0 ? (
              <div className="ordersEmptyState">
                <div className="ordersEmptyStateIcon">📦</div>
                <h3 className="ordersEmptyStateTitle">No orders yet</h3>
                <p className="ordersEmptyStateText">Start shopping to see your orders here!</p>
                <button className="ordersBtnPrimary" onClick={() => navigate('/products')}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="ordersList">
                {orders.map((order) => <OrderCard key={order._id} order={order} />)}
              </div>
            )}

            {orders.length > 0 && (
              <div className="ordersStatsSection">
                <h3 className="ordersStatsTitle">Order Summary</h3>
                <div className="ordersStatsGrid">
                  {[
                    { label: 'Total Orders', value: orders.length, colorClass: 'ordersStatValue--default' },
                    { label: 'Processing', value: orders.filter(o => o.orderStatus === 'Processing').length, colorClass: 'ordersStatValue--processing' },
                    { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'Delivered').length, colorClass: 'ordersStatValue--delivered' },
                    { label: 'Cancelled', value: orders.filter(o => o.orderStatus === 'Cancelled').length, colorClass: 'ordersStatValue--cancelled' }
                  ].map(({ label, value, colorClass }) => (
                    <div key={label} className="ordersStatCard">
                      <div className={`ordersStatValue ${colorClass}`}>{value}</div>
                      <div className="ordersStatLabel">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
