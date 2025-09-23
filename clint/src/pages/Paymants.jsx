import React, { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";



import Header from "../components/header1";

import Footer from "../components/Footer";

import "../styles/main.scss";



// Fix Leaflet default icon issue

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",

    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",

    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",

});



function MapUpdater({ markerPos, mapZoom }) {

    const map = useMap();

    useEffect(() => {

        if (markerPos) map.setView([markerPos.lat, markerPos.lng], mapZoom);

    }, [markerPos, mapZoom, map]);

    return null;

}



const formatPhone = (val) => {

    return (

        "+92 " +

        val

            .replace(/^(\+92\s*|92\s*|0)/, "")

            .replace(/\D/g, "")

            .slice(0, 10)

    );

};



export default function PaymentPage() {

    const [acceptTerms, setAcceptTerms] = useState(false);

    const [email, setEmail] = useState("");

    const [userName, setUserName] = useState("");

    const [primaryNumber, setPrimaryNumber] = useState("+92 ");

    const [altNumber, setAltNumber] = useState("+92 ");

    const [address, setAddress] = useState("");

    const [inputError, setInputError] = useState("");

    const [showPopup, setShowPopup] = useState(false);

    const [paymentStatus, setPaymentStatus] = useState(null);



    const [searchQuery, setSearchQuery] = useState("");

    const [markerPos, setMarkerPos] = useState(null);

    const [mapZoom, setMapZoom] = useState(12);

    const mapRef = useRef(null);



    const [checkoutCart, setCheckoutCart] = useState([]);

    const [couponDiscount, setCouponDiscount] = useState(0);



    const [isSubmitting, setIsSubmitting] = useState(false);

    

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");



    useEffect(() => {

        try {

            const storedCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];

            const storedDiscount = JSON.parse(localStorage.getItem("couponDiscount")) || 0;

            setCheckoutCart(storedCart);

            setCouponDiscount(storedDiscount);

        } catch {

            setCheckoutCart([]);

            setCouponDiscount(0);

        }

    }, []);



    const subtotal = checkoutCart.reduce(

        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),

        0

    );



    const shipping = 100;

    const totalPrice = subtotal + shipping - couponDiscount;



    const clearCart = () => {

        setCheckoutCart([]);

        localStorage.setItem("checkoutCart", JSON.stringify([]));

        localStorage.setItem("cart", JSON.stringify([]));

        localStorage.removeItem("couponDiscount");

        window.dispatchEvent(new Event("cartUpdated"));

    };



    useEffect(() => {

        const prevOverflow = document.body.style.overflow;

        document.body.style.overflow = showPopup ? "hidden" : prevOverflow;

        return () => {

            document.body.style.overflow = prevOverflow;

        };

    }, [showPopup]);



    const performSearch = async () => {

        if (!searchQuery.trim()) return;

        try {

            const response = await fetch(

                `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`

            );

            const data = await response.json();

            if (data.length > 0) {

                const lat = parseFloat(data[0].lat);

                const lon = parseFloat(data[0].lon);

                const addressText = data[0].display_name;

                setSearchQuery(addressText);

                setMarkerPos({ lat, lng: lon });

                setMapZoom(15);

                if (mapRef.current) mapRef.current.setView([lat, lon], 15);

                setInputError("");

            } else {

                setInputError("Location not found.");

            }

        } catch {

            setInputError("Location search failed. Try again.");

        }

    };



    const handleSearch = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            performSearch();

        }

    };



    const LocationPicker = () => {

        useMapEvents({

            click(e) {

                setMarkerPos(e.latlng);

                fetch(

                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`

                )

                    .then((res) => res.json())

                    .then((data) => {

                        if (data && data.display_name) {

                            setSearchQuery(data.display_name);

                        } else {

                            setSearchQuery(`${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);

                        }

                    })

                    .catch(() => {

                        setSearchQuery(`${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);

                    });

            },

        });

        return markerPos ? <Marker position={markerPos} /> : null;

    };



    const handlePlaceOrder = async () => {

        if (!acceptTerms) {

            return setInputError("You must accept our terms and policies.");

        }

        if (!userName.trim() || !primaryNumber.trim() || !address.trim() || !searchQuery.trim()) {

            return setInputError("Please fill in all required fields including location.");

        }

        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

            return setInputError("Please enter a valid email.");

        }

        if (address.replace(/[^a-zA-Z0-9]/g, "").length < 10) {

            return setInputError("Address must include at least 10 letters/numbers.");

        }

        if (primaryNumber.replace(/\D/g, "").length < 12) {

            return setInputError("Primary number is invalid.");

        }



        setInputError("");

        setIsSubmitting(true);



        const orderDetails = {

            userName,

            email,

            primaryNumber,

            altNumber,

            address,

            location: searchQuery,

            products: checkoutCart.map((item) => ({

                name: item.name,

                size: item.size,

                color: item.color || "",

                category: item.category || "",

                quantity: item.quantity,

                image: Array.isArray(item.img) ? item.img[0] : item.img,

                price: item.price,

            })),

            subtotal,

            shipping,

            couponDiscount,

            totalPrice,

            paymentMethod: selectedPaymentMethod,

        };



        try {

            const response = await fetch("https://aj-creativity-pk.vercel.app/api/orders", {

                method: "POST",

                headers: { "Content-Type": "application/json" },

                body: JSON.stringify(orderDetails),

            });

            const data = await response.json();



            if (data.success) {

                if (selectedPaymentMethod === 'cod') {

                    setPaymentStatus("cod");

                    setShowPopup(true);

                } else {

                    if (data.redirectUrl) {

                        window.location.href = data.redirectUrl;

                    } else {

                        setPaymentStatus("success");

                        setShowPopup(true);

                    }

                }

            } else {

                setPaymentStatus("failed");

                setShowPopup(true);

                setInputError(data.message || "Failed to place order.");

            }

        } catch (error) {

            console.error("Order Error:", error);

            setPaymentStatus("failed");

            setShowPopup(true);

            setInputError("❌ Failed to connect to server.");

        } finally {

            setIsSubmitting(false);

        }

    };

    

    const getPopupContent = () => {

        if (paymentStatus === 'cod') {

            return (

                <div className="order-confirm-popup-content">

                    <div className="order-confirm-checkmark">

                        <svg viewBox="0 0 52 52">

                            <circle className="order-confirm-checkmark-circle" cx="26" cy="26" r="25" fill="none" />

                            <path className="order-confirm-checkmark-check" fill="none" d="M14 27l7 7 16-16" />

                        </svg>

                    </div>

                    <h2>Order Confirmed!</h2>

                    <p>Thank you for your purchase.<br />Your order has been placed successfully and will be delivered via **Cash on Delivery**.</p>

                    <Link to="/" onClick={clearCart}>Back to Home</Link>

                    <p>Our support team will contact you within 30 minutes.</p>

                </div>

            );

        } else if (paymentStatus === 'success') {

            return (

                <div className="order-confirm-popup-content">

                    <div className="order-confirm-checkmark">

                        <svg viewBox="0 0 52 52">

                            <circle className="order-confirm-checkmark-circle" cx="26" cy="26" r="25" fill="none" />

                            <path className="order-confirm-checkmark-check" fill="none" d="M14 27l7 7 16-16" />

                        </svg>

                    </div>

                    <h2>Payment Confirmed!</h2>

                    <p>Your payment was successful and your order has been placed. We've sent a confirmation email to you.</p>

                    <Link to="/" onClick={clearCart}>Back to Home</Link>

                </div>

            );

        } else if (paymentStatus === 'failed') {

            return (

                <div className="order-confirm-popup-content error">

                    <h2>Payment Failed!</h2>

                    <p>❌ Your payment could not be processed. Please try again or select a different method.</p>

                    <button onClick={() => setShowPopup(false)}>Try Again</button>

                </div>

            );

        } else {

            return null;

        }

    };



    return (

        <>

            <Header />

            <div className="checkout-page-container">

                <h1 className="checkout-title">Complete Your Purchase</h1>

                <div className="checkout-grid">

                    <div className="checkout-form-section">

                        <div className="form-card">

                            <h2 className="form-title">User Information</h2>

                            <label className="form-label">Full Name</label>

                            <input type="text" placeholder="Enter your full name" value={userName} onChange={(e) => setUserName(e.target.value)} className="input-field" />

                            

                            <label className="form-label">Email (optional)</label>

                            <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />



                            <label className="form-label">Primary Number</label>

                            <input type="tel" value={primaryNumber} onChange={(e) => setPrimaryNumber(formatPhone(e.target.value))} maxLength={16} className="input-field" />



                            <label className="form-label">Alternate Number (optional)</label>

                            <input type="tel" value={altNumber} onChange={(e) => setAltNumber(formatPhone(e.target.value))} maxLength={16} className="input-field" />



                            <label className="form-label">Full Address</label>

                            <textarea rows="3" placeholder="Street, City, Postal Code" value={address} onChange={(e) => setAddress(e.target.value)} className="textarea-field" />



                            <label className="form-label">Search Location or Select on Map</label>

                            <div className="search-field-container">

                                <input 

                                    type="text" 

                                    value={searchQuery} 

                                    placeholder="Type a location to search" 

                                    onChange={(e) => setSearchQuery(e.target.value)} 

                                    onKeyDown={handleSearch} 

                                    className="input-field"

                                />

                                <button onClick={performSearch} className="search-button" aria-label="Search location">

                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">

                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>

                                    </svg>

                                </button>

                            </div>



                            <MapContainer

                                center={markerPos ? [markerPos.lat, markerPos.lng] : [33.6844, 73.0479]}

                                zoom={markerPos ? mapZoom : 12}

                                style={{ height: "250px", width: "100%", borderRadius: "8px", border: "1px solid #e0e0e0" }}

                                whenCreated={(mapInstance) => (mapRef.current = mapInstance)}

                            >

                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

                                <MapUpdater markerPos={markerPos} mapZoom={mapZoom} />

                                <LocationPicker />

                            </MapContainer>

                        </div>

                    </div>



                    <div className="checkout-summary-section">

                        <div className="summary-card">

                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-product-list">

                                {checkoutCart.length === 0 ? (

                                    <div className="empty-cart-message">No products in checkout.</div>

                                ) : (

                                    checkoutCart.map((item, idx) => (

                                        <div key={item.id || idx} className="summary-product-item">

                                            <div className="product-info-left">

                                                <img src={item.img} alt={item.name} className="product-thumb" />

                                                <div className="product-details">

                                                    <span className="product-name">{item.name}</span>

                                                    {item.size && <span className="product-variant">Size: {item.size}</span>}

                                                </div>

                                            </div>

                                            <div className="product-info-right">

                                                <span className="product-quantity">x{item.quantity}</span>

                                                <span className="product-price">Rs {(item.price || 0) * (item.quantity || 1)}</span>

                                            </div>

                                        </div>

                                    ))

                                )}

                            </div>

                            <div className="price-breakdown">

                                <div className="price-row">

                                    <span>Subtotal</span>

                                    <span>Rs {subtotal}</span>

                                </div>

                                <div className="price-row">

                                    <span>Shipping</span>

                                    <span>Rs {shipping}</span>

                                </div>

                                {couponDiscount > 0 && (

                                    <div className="price-row">

                                        <span>Discount</span>

                                        <span>- Rs {couponDiscount}</span>

                                    </div>

                                )}

                                <div className="price-row total-row">

                                    <span>Total Amount</span>

                                    <span className="total-amount">Rs {totalPrice}</span>

                                </div>

                            </div>

                        </div>



                        <div className="payment-card">

                            <h2 className="payment-title">Choose Payment Method</h2>

                            <div className="payment-options">

                                <label className="payment-option">

                                    <input type="radio" name="payment_method" value="cod" checked={selectedPaymentMethod === 'cod'} onChange={(e) => setSelectedPaymentMethod(e.target.value)} />

                                    <div className="option-content">

                                        <img src="./cash-on-delivery.png" alt="Cash on Delivery" className="payment-icon" />

                                        <span>Cash on Delivery</span>

                                    </div>

                                </label>

                                <label className="payment-option">

                                    <input type="radio" name="payment_method" value="jazzcash" checked={selectedPaymentMethod === 'jazzcash'} onChange={(e) => setSelectedPaymentMethod(e.target.value)} />

                                    <div className="option-content">

                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/JazzCash_logo_%282025%29.png" alt="JazzCash" className="payment-icon" />

                                        <span>JazzCash</span>

                                    </div>

                                </label>

                                <label className="payment-option">

                                    <input type="radio" name="payment_method" value="easypaisa" checked={selectedPaymentMethod === 'easypaisa'} onChange={(e) => setSelectedPaymentMethod(e.target.value)} />

                                    <div className="option-content">

                                        <img src="./Easypaisa Icon Vector.svg" alt="Easypaisa" className="payment-icon" />

                                        <span>Easypaisa</span>

                                    </div>

                                </label>

                                <label className="payment-option">

                                    <input type="radio" name="payment_method" value="visa" checked={selectedPaymentMethod === 'visa'} onChange={(e) => setSelectedPaymentMethod(e.target.value)} />

                                    <div className="option-content">

                                        <img src="./visa.png" alt="Visa Card" className="payment-icon" />

                                        <span>Visa Card</span>

                                    </div>

                                </label>

                            </div>

                        </div>



                   
                    </div>

                </div>
     <div className="form-footer">

                            <div className="terms-checkbox-container">

                                <label className="terms-label">

                                    <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />

                                    I accept your <a href="#">terms and policies</a>.

                                </label>

                            </div>

                            <button className="confirm-pay-button" onClick={handlePlaceOrder} disabled={isSubmitting}>

                                {isSubmitting ? "Processing..." : `Confirm & Pay Rs ${totalPrice}`}

                            </button>

                            {inputError && <div className="error-message">{inputError}</div>}

                        </div>

            </div>

            

            {showPopup && (

                <div className="order-confirm-popup">

                    {getPopupContent()}

                </div>

            )}

            <Footer />

        </>

    );

}