import React, { useState, useEffect } from "react";
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
        if (response.status === 404) throw new Error("Order not found with this ID.");
        if (!response.ok) throw new Error(`Error fetching order (Status: ${response.status}).`);
        const data = await response.json();
        return data.order || data; 
    } catch (error) {
        console.error("Error fetching single order:", error);
        throw error;
    }
};

// --- API CALL: CANCEL ORDER REQUEST ---
const requestCancelOrder = async (orderId) => {
    // Yeh woh backend endpoint hai jo order status ko 'requested' mein badalega
    const API_URL = `https://aj-creativity-pk.vercel.app/api/orders/${orderId}/cancel-request`;
    
    try {
        const response = await fetch(API_URL, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to submit cancel request on server.");
        }
        
        const data = await response.json();
        return data.order; // Server se updated order object return hona chahiye
    } catch (error) {
        throw error;
    }
};
// ----------------------------------------------------------------------


export default function MyOrdersPage() { 
    const [order, setOrder] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false); // New state to manage immediate UI feedback
    
    // --- Initial Load: Check LocalStorage for Order ID ---
    useEffect(() => {
        const checkLocalStorageAndLoad = async () => {
            const lastPlacedOrderId = localStorage.getItem('lastPlacedOrderId');
            
            if (lastPlacedOrderId) {
                try {
                    const singleOrder = await fetchSingleOrder(lastPlacedOrderId);
                    if (singleOrder) {
                        setOrder(singleOrder); 
                    } else {
                        setError("Order details could not be loaded. Please try refreshing.");
                    }
                } catch (err) {
                    setError(`❌ Failed to load order: ${err.message}.`);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkLocalStorageAndLoad();
    }, []);

    // --- HANDLER: Order Cancel Request ---
    const handleCancelRequest = async (orderId) => {
        if (!window.confirm("Kya aap sach mein yeh order cancel karna chahte hain?")) {
            return;
        }

        setStatusMessage({ type: 'info', text: 'Cancel request server par bhej rahe hain...' });
        setIsCancelling(true); // Button ko turant disable karke 'Requested' state mein laane ke liye
        
        // Optimistic UI update: Turant status ko 'requested' mein badalna
        setOrder(prevOrder => ({ 
            ...prevOrder, 
            status: 'requested' 
        }));

        try {
            const updatedOrder = await requestCancelOrder(orderId);
            
            // Server se aaye hue final status se update karna ('requested' ya 'cancelled')
            setOrder(updatedOrder); 
            setStatusMessage({ 
                type: 'success', 
                text: `Request bhej di gayi hai! Naya status: ${updatedOrder.status}.` 
            });

        } catch (err) {
            // Agar request fail ho gayi, toh purana status wapas karna (ya 'pending' agar pehle tha)
            setOrder(prevOrder => ({ 
                ...prevOrder, 
                status: 'pending' // Ya order.status ko wapas set karein agar error aane par revert karna ho
            }));
            
            setStatusMessage({ 
                type: 'error', 
                text: err.message || 'Cancel request process karne mein error. Dobara prayas karein.' 
            });
            
        } finally {
            setIsCancelling(false);
        }
    };


    // --- Render Logic ---

    if (loading) {
        return (
            <>
                <Header />
                <div className="ajc-orders-container">
                    <h1 className="ajc-orders-title">Order Details 🧾</h1>
                    <div className="ajc-loading-message">Order details load ho rahe hain...</div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="ajc-orders-container">
                    <h1 className="ajc-orders-title">Order Details 🧾</h1>
                    <div className="ajc-error-message">{error}</div>
                    <Link to="/" className="ajc-order-details-button" style={{maxWidth: '300px', margin: '20px auto'}}>Go Home</Link>
                </div>
                <Footer />
            </>
        );
    }
    
    // Order successfully load hone par
    if (order) {
        // Status checks
        const currentStatus = order.status || 'pending';
        const isPending = currentStatus === 'pending';
        // Button 'Requested' tab dikhega jab status 'requested' ho ya 'isCancelling' state true ho
        const showRequested = currentStatus === 'requested' || isCancelling; 
        const isCompletedOrCancelled = currentStatus === 'completed' || currentStatus === 'cancelled';

        return (
            <>
                <Header />
                <div className="ajc-orders-container">
                    <h1 className="ajc-orders-title">Order #**{order._id.slice(-8)}** Details </h1>
                    
                    {/* Status Message Block */}
                    {statusMessage && (
                       <div className={`ajc-action-message ajc-action-message--${statusMessage.type}`}>
                          {statusMessage.text}
                       </div>
                    )}
                    
                    {/* 1. ORDER SUMMARY & STATUS BLOCK */}
                    <div className="ajc-detail-card ajc-summary-info" style={{marginBottom: '20px'}}>
                        <h2>Order Summary & Status</h2>
                        <div className="ajc-order-detail-grid"> 
                            {/* Left Column (Details) */}
                            <div style={{gridColumn: '1 / span 1'}}>
                                <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                <p><strong>Delivery Address:</strong> {order.address}, {order.location}</p>
                            </div>
                            
                            {/* Right Column (Status & Total) */}
                            <div style={{textAlign: 'right', gridColumn: '1 / span 1'}}>
                                <p><strong>Current Status:</strong> 
                                    <span className={`ajc-order-status ajc-status-${currentStatus.toLowerCase().replace(' ', '-')}`}>
                                        {currentStatus}
                                    </span>
                                </p>
                                <h3>Total Paid: **{formatPrice(order.totalPrice)}**</h3>
                            </div>
                        </div>
                    </div>
                        
                    {/* 2. PRODUCTS LIST/TABLE */}
                    <div className="ajc-detail-card ajc-products-list-full" style={{marginTop: '20px'}}>
                        <h2>Items Ordered ({order.products.length})</h2>
                        
                        {order.products.map((item, index) => (
                            <div key={index} className="ajc-product-item-row">
                                
                                {/* Image, Details, Quantity, Price (same as before) */}
                                <div style={{width: '60px'}} className="ajc-col-img">
                                    <img src={item.image} alt={item.name} className="ajc-product-image-thumb" />
                                </div>
                                <div className="ajc-product-details-col">
                                    <h4>{item.name}</h4>
                                    <p>Size: {item.size} | Color: {item.color}</p>
                                </div>
                                <span className="ajc-product-qty">x{item.quantity}</span>
                                <span className="ajc-product-price-col">{formatPrice(item.price * item.quantity)}</span>
                                
                                {/* --- CANCEL BUTTON PER PRODUCT (UPDATED LOGIC) --- */}
                                <span className="ajc-col-action" style={{width: '120px', marginLeft: '10px'}}>
                                    {showRequested ? (
                                        <button className="ajc-cancel-btn requested" disabled>Requested</button>
                                    ) : isCompletedOrCancelled ? (
                                        <button 
                                            className={`ajc-cancel-btn ${currentStatus.toLowerCase()}`} 
                                            disabled 
                                            style={{color: currentStatus === 'cancelled' ? '#dc3545' : '#155724', 
                                                    borderColor: currentStatus === 'cancelled' ? '#dc3545' : '#155724'}}
                                        >
                                            {currentStatus === 'cancelled' ? 'Cancelled' : 'Delivered'}
                                        </button>
                                    ) : (
                                        <button 
                                            className="ajc-cancel-btn"
                                            onClick={() => handleCancelRequest(order._id)}
                                            disabled={!isPending} // Sirf pending orders hi cancel ho sakte hain
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </span>
                                
                            </div>
                        ))}
                    </div>
                    
                </div >
                <Footer />
            </>
        );
    }
    
    // Agar koi order ID store nahi hai (default view)
    return (
         <>
            <Header />
            <div className="ajc-orders-container">
                <h1 className="ajc-orders-title">My Orders</h1>
                <div className="ajc-empty-orders-message">
                    Aapke browser mein koi bhi naye order ki jaankari nahi hai.
                </div>
                <Link to="/" className="ajc-order-details-button" style={{maxWidth: '300px', margin: '20px auto'}}>Go Back to Home</Link>
            </div>
            <Footer />
        </>
    );
}