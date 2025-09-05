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

// Update map view when marker moves
function MapUpdater({ markerPos, mapZoom }) {
  const map = useMap();
  useEffect(() => {
    if (markerPos) map.setView([markerPos.lat, markerPos.lng], mapZoom);
  }, [markerPos, mapZoom, map]);
  return null;
}

// Format Pakistani phone numbers
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

  const [searchQuery, setSearchQuery] = useState("");
  const [markerPos, setMarkerPos] = useState(null);
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef(null);

  const [checkoutCart, setCheckoutCart] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("checkoutCart")) || [];
      setCheckoutCart(stored);
    } catch {
      setCheckoutCart([]);
    }
  }, []);

  const totalPrice = checkoutCart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const clearCart = () => {
    setCheckoutCart([]);
    localStorage.setItem("checkoutCart", JSON.stringify([]));
    localStorage.setItem("cart", JSON.stringify([]));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = showPopup ? "hidden" : prevOverflow;
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showPopup]);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
        );
        const data = await response.json();
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setSearchQuery(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
          setMarkerPos({ lat, lng: lon });
          setMapZoom(15);
          if (mapRef.current) mapRef.current.setView([lat, lon], 15);
        }
      } catch {
        setInputError("Location search failed. Try again.");
      }
    }
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setMarkerPos(e.latlng);
        setSearchQuery(`${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
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

    try {
      const response = await fetch("https://aj-creativity-pk.vercel.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
            image: item.image,
            price: item.price,
          })),
          totalPrice,
          paymentMethod: "Cash on Delivery",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowPopup(true);
      } else {
        setInputError(data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order Error:", error);
      setInputError("❌ Failed to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="payment-container fade-in-page">
        <h1>Payment Details</h1>
        <div className="checkout-row">
          <div className="left-col">
            <section>
              <h2>User Information</h2>
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" value={userName} onChange={(e) => setUserName(e.target.value)} />
              <input type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginTop: 8 }} />
              <label>Primary Number</label>
              <input type="tel" value={primaryNumber} onChange={(e) => setPrimaryNumber(formatPhone(e.target.value))} maxLength={16} />
              <label>Alternate Number</label>
              <input type="tel" value={altNumber} onChange={(e) => setAltNumber(formatPhone(e.target.value))} maxLength={16} />
              <label>Address</label>
              <textarea rows="3" placeholder="Enter your full address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <label>Search Location or Select on Map</label>
              <input type="text" value={searchQuery} placeholder="Type a location or select on map" onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} />
              <MapContainer
                center={markerPos ? [markerPos.lat, markerPos.lng] : [33.6844, 73.0479]}
                zoom={markerPos ? mapZoom : 12}
                style={{ height: "250px", width: "100%", borderRadius: "6px" }}
                whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                <MapUpdater markerPos={markerPos} mapZoom={mapZoom} />
                <LocationPicker />
              </MapContainer>
            </section>
          </div>

          <div className="right-col">
            <section>
              <h2>Payment Method</h2>
              <select>
                <option value="cod">Cash on Delivery</option>
              </select>
            </section>

            <section className="product-card">
              <h2>Product Information</h2>
              <div className="product-info-list" style={checkoutCart.length > 2 ? { maxHeight: 220, overflowY: "auto", border: "1px solid #eee", borderRadius: 6, paddingRight: 8 } : {}}>
                {checkoutCart.length === 0 ? (
                  <div>No products in checkout.</div>
                ) : (
                  checkoutCart.map((item, idx) => (
                    <div
                      key={item.id || idx} // Use a unique key.
                      className="product-info"
                      style={{ display: "flex", alignItems: "center", marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8 }}
                    >
                      <img src={item.image} alt={item.name} style={{ width: 110, height: 110, objectFit: "cover", marginRight: 12, borderRadius: 4 }} />
                      <div>
                        <p>
                          <strong>Name:</strong> {item.name}
                        </p>
                        {item.color && (
                          <p>
                            <strong>Color:</strong> {item.color}
                          </p>
                        )}
                        {item.category && (
                          <p>
                            <strong>Category:</strong> {item.category}
                          </p>
                        )}
                        <p>
                          <strong>Size:</strong> {item.size}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Price:</strong> Rs {(item.price + 100) * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {checkoutCart.length > 0 && (
                <p style={{ marginTop: 10, fontWeight: "bold" }}>Total: Rs {totalPrice + 100}</p>
              )}
            </section>

            <div style={{ margin: "16px 0 8px 0" }}>
              <label>
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} style={{ marginRight: 8 }} />
                I accept your terms and policies.
              </label>
            </div>

            <button className="pay-btn" onClick={handlePlaceOrder} disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Confirm & Pay"}
            </button>

            {inputError && (
              <div style={{ color: "red", marginTop: 10, fontSize: 15 }}>{inputError}</div>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="order-confirm-popup">
          <div className="order-confirm-popup-content">
            <div className="order-confirm-checkmark">
              <svg viewBox="0 0 52 52">
                <circle className="order-confirm-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="order-confirm-checkmark-check" fill="none" d="M14 27l7 7 16-16" />
              </svg>
            </div>
            <h2>Order Confirmed!</h2>
            <p>
              Thank you for your purchase.
              <br />
              Your order has been placed successfully.
            </p>
            <Link to="/" onClick={clearCart}>
              Back to Home
            </Link>
            <p>Our support team will contact you within 30 minutes.</p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}