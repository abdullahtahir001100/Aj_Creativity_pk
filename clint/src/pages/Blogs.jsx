import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header1";
import Footer from "../components/Footer";
import "../styles/main.scss";

// Helper functions (unchanged)
const formatPrice = (price) => `Rs ${price ? price.toLocaleString('en-PK') : 0}`;
const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-PK");

// --- API FETCH FUNCTION (ID se Single Order Fetch) ---
const fetchSingleOrder = async (orderId) => {
  if (!orderId) return null;
  const API_URL = `https://aj-creativity-pk.vercel.app/api/orders/${orderId}`;

  try {
    const response = await fetch(API_URL);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Error fetching order (Status: ${response.status}).`);
    const data = await response.json();
    return data.order || data;
  } catch (error) {
    console.error("Error fetching single order:", error);
    return null;
  }
};

// --- API CALL: CANCEL ORDER REQUEST ---
const requestCancelOrder = async (orderId) => {
  const API_URL = `https://aj-creativity-pk.vercel.app/api/orders/${orderId}/cancel-request`;
  try {
    const response = await fetch(API_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit cancel request on server.");
    }
    const data = await response.json();
    return data.order;
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------------------------------------


export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // --- Master Fetcher: Loads ALL stored Order IDs ---
  const loadAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    const storedIds = JSON.parse(localStorage.getItem('myOrderIds')) || [];

    if (storedIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const orderPromises = storedIds.map(id => fetchSingleOrder(id));
      const fetchedOrders = await Promise.all(orderPromises);

      const validOrders = fetchedOrders.filter(order => order !== null);

      // Naye order ko pehle dikhane ke liye reverse karna
      setOrders(validOrders.reverse());

    } catch (err) {
      setError(`❌ Orders load karne mein error aayi. Please refresh.`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllOrders();
  }, [loadAllOrders]);


  // --- HANDLER: User ne order ko permanently delete kiya ---
  const handleRemoveOrder = (orderId) => {
    if (!window.confirm("Aapke browser se yeh order history permanently delete ho jayegi. Continue?")) {
      return;
    }

    // 1. LocalStorage se ID hatana
    const storedIds = JSON.parse(localStorage.getItem('myOrderIds')) || [];
    const updatedIds = storedIds.filter(id => id !== orderId);
    localStorage.setItem('myOrderIds', JSON.stringify(updatedIds));

    // 2. State update karna
    setOrders(prev => prev.filter(order => order._id !== orderId));
    setStatusMessage({ type: 'success', text: `Order ID ${orderId.slice(-8)} history se hata diya gaya hai.` });
  };


  // --- HANDLER: Order Cancel Request ---
  const handleCancelRequest = async (orderId) => {
    if (!window.confirm("Kya aap sach mein yeh order cancel karna chahte hain?")) {
      return;
    }
    setStatusMessage({ type: 'info', text: `Order ${orderId.slice(-8)} ke liye request bhej rahe hain...` });

    // Optimistic UI update: Turant status ko 'requested' mein badalna
    setOrders(prevOrders => prevOrders.map(order =>
      order._id === orderId ? { ...order, status: 'requested' } : order
    ));

    try {
      const updatedOrder = await requestCancelOrder(orderId);

      // Server se aaye hue final status se orders array ko update karna
      setOrders(prevOrders => prevOrders.map(order =>
        order._id === orderId ? updatedOrder : order
      ));

      setStatusMessage({
        type: 'success',
        text: `Request bhej di gayi hai! Order ${orderId.slice(-8)} ka naya status: ${updatedOrder.status}.`
      });

    } catch (err) {
      // Agar request fail ho gayi, toh UI ko wapas 'pending' mein badalna
      setOrders(prevOrders => prevOrders.map(order =>
        order._id === orderId ? { ...order, status: 'pending' } : order
      ));

      setStatusMessage({
        type: 'error',
        text: err.message || 'Cancel request process karne mein error.'
      });
    }
  };


  // --- Render Logic ---

  if (loading) {
    return (<> <Header /><div className="ajc-orders-container"><h1 className="ajc-orders-title">My Orders 🧾</h1><div className="ajc-loading-message">Saare orders load ho rahe hain...</div></div><Footer /></>);
  }

  if (error) {
    return (<> <Header /><div className="ajc-orders-container"><h1 className="ajc-orders-title">My Orders 🧾</h1><div className="ajc-error-message">{error}</div><Link to="/" className="ajc-order-details-button" style={{ maxWidth: '300px', margin: '20px auto' }}>Go Home</Link></div><Footer /></>);
  }

  const hasOrders = orders.length > 0;

  return (
    <>
      <Header />
      <div className="ajc-orders-container">
        <h1 className="ajc-orders-title">My Order History ({orders.length} orders)</h1>



        {!hasOrders && (
          <div className="ajc-empty-orders-message">
            Aapke browser mein koi bhi order history nahi mili.
            <Link to="/" className="ajc-order-details-button" style={{ maxWidth: '300px', margin: '20px auto' }}>Start Shopping</Link>
          </div>
        )}

        {/* --- ORDERS LIST: Har order ka ek alag card --- */}
        {hasOrders && orders.map((order) => {
          const currentStatus = order.status || 'pending';
          const isPending = currentStatus === 'pending';
          const isRequested = currentStatus === 'requested';
          const isCompletedOrCancelled = currentStatus === 'completed' || currentStatus === 'cancelled';

          return (
            <div key={order._id} className="ajc-order-card ajc-detail-view" style={{ marginBottom: '40px', padding: '0' }}>

              {/* 1. ORDER SUMMARY (Using Flexer and ajc-detail-card for style grouping) */}
              <div className="back">
                <div className="flexer">

                  <div className="ajc-detail-card ajc-order-summary">
                    <h2>Order Info</h2>
                    <p><strong>Order ID:</strong> #{order._id.slice(-8)}</p>
                    <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                    <p><strong>Payment:</strong> {order.paymentMethod}</p>
                    <p><strong>Status:</strong>
                      <span className={`ajc-order-status ajc-status-${currentStatus.toLowerCase().replace(' ', '-')}`}>
                        {currentStatus}
                      </span>
                    </p>
                    <h3>Total: {formatPrice(order.totalPrice)}</h3>
                  </div>

                  <div className="ajc-detail-card ajc-delivery-address">
                    <h2>Delivery Address</h2>
                    <p><strong>Receiver:</strong> {order.userName}</p>
                    <p><strong>Contact:</strong> {order.primaryNumber}</p>
                    <p><strong>Full Address:</strong> {order.address}</p>
                    <p><strong>Location:</strong> {order.location}</p>
                  </div>
                 
                </div>
                 <div className="ajc-products-list-full" style={{ marginTop: '20px' }}>


                    {order.products.map((item, index) => (
                      <div key={index} className="ajc-product-item-row ajc-product-row-mobile" style={{ margin: '0 25px' }}>

                        {/* Image */}
                        <div style={{ width: '60px' }} className="ajc-col-img">
                          <img src={item.image} alt={item.name} className="ajc-product-image-thumb" />
                        </div>

                        {/* Details */}
                        <div className="ajc-product-details-col">
                          <h4>{item.name}</h4>
                          <p>Size: {item.size} | Color: {item.color}</p>
                        </div>

                        {/* Qty & Price */}
                        <div className="ajc-product-info-wrap">
                          <span className="ajc-product-qty">x{item.quantity}</span>
                          <span className="ajc-product-price-col">{formatPrice(item.price * item.quantity)}</span>
                        </div>

                        {/* --- CANCEL/DELETE ACTIONS --- */}
                        <span className="ajc-col-action" style={{ width: '120px', marginLeft: '10px' }}>
                          {isCompletedOrCancelled ? (
                            <button
                              className={`ajc-cancel-btn ${currentStatus.toLowerCase()}`}
                              disabled
                              style={{
                                color: currentStatus === 'cancelled' ? '#dc3545' : '#155724',
                                borderColor: currentStatus === 'cancelled' ? '#dc3545' : '#155724'
                              }}
                            >
                              {currentStatus === 'cancelled' ? 'Cancelled' : 'Delivered'}
                            </button>
                          ) : (
                            <button
                              className={`ajc-cancel-btn ${isRequested ? 'requested' : ''}`}
                              onClick={() => handleCancelRequest(order._id)}
                              disabled={!isPending && !isRequested}
                            >
                              {isPending ? 'Cancel Order' : 'Requested'}
                            </button>
                          )}
                        </span>

                      </div>
                    ))}
                  </div>
              </div>

              {/* 2. PRODUCTS LIST/TABLE (Full Width) */}


              {/* 3. REMOVE BUTTON */}
              <div style={{ textAlign: 'right', padding: '15px 25px 10px' }}>
                <button
                  onClick={() => handleRemoveOrder(order._id)}
                  className="ajc-remove-history-btn"
                >
                   Remove from History
                </button>
              </div>

            </div>
          );
        })}

      </div>
      <Footer />
    </>
  );
}