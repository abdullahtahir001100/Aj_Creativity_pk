import React, { useState } from "react";
import Header from "../components/header1"; 
import Footer from "../components/Footer"; 
import "../styles/main.scss"; 

// Helper functions (unchanged)
const formatPrice = (price) => `Rs ${price ? price.toLocaleString('en-PK') : 0}`;
const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-PK");

// --- API FETCH FUNCTION: Number AUR Naam dono check honge (AND logic) ---
const fetchOrders = async (contactNumber, userName) => {
    
    // Validation
    const cleanedNumber = contactNumber.replace(/\D/g, "");
    const cleanedName = userName.trim();

    if (cleanedNumber.length < 12) {
        throw new Error("Phone number should be a valid 12 digits (with +92).");
    }
    if (cleanedName.length < 3) {
        throw new Error("Full Name field requires at least 3 characters.");
    }
    
    // FRONT-END: Dono (Number AND Name) values ko API URL mein query parameters ke roop mein bhejna.
    const API_URL = 
        `https://aj-creativity-pk.vercel.app/api/orders?primaryNumber=${cleanedNumber}&userName=${encodeURIComponent(cleanedName)}`;
    
    console.log(`Sending AND request: Number=${cleanedNumber}, Name=${cleanedName}`);
    
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Server Error: Failed to fetch orders (Status: ${response.status}).`);
        }

        const data = await response.json();
        
        // Agar backend mein AND condition theek se kaam kar rahi hai, toh yahan sirf matching orders aayenge.
        return data.orders || []; 
        
    } catch (error) {
        console.error("Error fetching live orders:", error);
        throw error;
    }
};
// ------------------------------------------------------------------------


export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);
    
    // Two Search States:
    const [numberQuery, setNumberQuery] = useState(""); 
    const [nameQuery, setNameQuery] = useState("");
    
    // Phone number format karne ka logic (same as your PaymentPage)
    const formatPhone = (val) => {
         return (
             "+92 " +
             val
                 .replace(/^(\+92\s*|92\s*|0)/, "")
                 .replace(/\D/g, "")
                 .slice(0, 10)
         );
    };

    const handleSearchOrders = async (e) => {
        if (e) e.preventDefault();
        
        setLoading(true);
        setError(null);
        setOrders([]);
        
        try {
            // Front-end dono values ko bhej raha hai
            const fetchedOrders = await fetchOrders(numberQuery, nameQuery); 
            
            if (fetchedOrders.length === 0) {
                 setError(`❌ Koi order nahi mila. Order kiye gaye Phone number "${numberQuery}" aur Naam "${nameQuery}" ka record **match nahi hua**.`);
            }
            setOrders(fetchedOrders);
            
        } catch (err) {
            setError(`❌ ${err.message || "Orders load nahi ho paye. Network issue."}`);
        } finally {
            setLoading(false);
        }
    };

    const hasSearched = numberQuery.replace(/\D/g, "").length >= 12 && nameQuery.trim().length >= 3;
    
    return (
        <>
            <Header />
            <div className="ajc-orders-container">
                <h1 className="ajc-orders-title">Apne Orders Track Karein 🔒</h1>
                
                {/* Search Form */}
                <form className="ajc-order-search-form" onSubmit={handleSearchOrders}>
                    <input
                        type="text"
                        placeholder="1. Apna Full Name Darj Karein (Order mein diya gaya)"
                        value={nameQuery}
                        onChange={(e) => setNameQuery(e.target.value)}
                        className="ajc-search-input ajc-input-name"
                        required 
                    />
                    <input
                        type="tel"
                        placeholder="2. Apna Primary Number Darj Karein (+92...)"
                        value={numberQuery}
                        onChange={(e) => setNumberQuery(formatPhone(e.target.value))}
                        maxLength={16}
                        className="ajc-search-input ajc-input-number"
                        required 
                    />
                    <button type="submit" className="ajc-search-button" disabled={loading}>
                        {loading ? "Searching..." : "Search Orders"}
                    </button>
                </form>

                {/* Loading and Error Messages */}
                {loading && <div className="ajc-loading-message">Orders search ho rahe hain...</div>}
                {error && <div className="ajc-error-message">{error}</div>}
                
                {/* Orders List */}
                {!loading && !error && orders.length > 0 && (
                    <div className="ajc-orders-list">
                        {orders.map((order) => (
                             <div key={order._id || Math.random()} className="ajc-order-card">
                                <div className="ajc-order-header">
                                    <span className="ajc-order-id">Order ID: **#{order._id ? order._id.slice(-8) : 'N/A'}**</span>
                                    <span className={`ajc-order-status ajc-status-${(order.status || 'pending').toLowerCase().replace(' ', '-')}`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                                <div className="ajc-order-body">
                                    <p>
                                        <strong>Date:</strong> {formatDate(order.createdAt)}
                                    </p>
                                    <p>
                                        <strong>Customer:</strong> {order.userName}
                                    </p>
                                    <p>
                                        <strong>Total Amount:</strong> **{formatPrice(order.totalPrice)}**
                                    </p>
                                    <p>
                                        <strong>Delivery Location:</strong> {order.location}
                                    </p>
                                </div>
                                <div className="ajc-order-products-preview">
                                    {order.products.slice(0, 3).map((product, pIdx) => (
                                        <img key={pIdx} src={product.image} alt={product.name} className="ajc-product-image-thumb" />
                                    ))}
                                    {order.products.length > 3 && (
                                        <span className="ajc-more-items-count">+{order.products.length - 3} aur</span>
                                    )}
                                </div>
                                <button className="ajc-order-details-button" 
                                        onClick={() => alert(`Aap Order ID: ${order._id} ki details dekh rahe hain.`)}>
                                    Details Dekhein
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Initial Message and No Orders Found */}
                {!loading && !error && orders.length === 0 && !hasSearched && (
                     <div className="ajc-empty-orders-message">
                        Apna naam aur primary number darj karke apne orders search karein.
                     </div>
                )}
            </div>
            <Footer />
        </>
    );
}