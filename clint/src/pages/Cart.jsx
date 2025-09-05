import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/main.scss";
import Header from "../components/header1";
import Footer from "../components/Footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(stored);
    } catch (e) {
      setCartItems([]);
    }
  }, []);

  // Always keep checkoutCart in sync with cartItems
  useEffect(() => {
    localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
  }, [cartItems]);
  const [shipping] = useState(100);
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const handleQtyChange = (id, value) => {
    const newCart = cartItems.map(item => {
      if(item.id === id) item.quantity = Number(value);
      return item;
    });
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
  const newCart = cartItems.filter(item => item.id !== id);
  setCartItems(newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));
  window.dispatchEvent(new Event('cartUpdated'));
  }

  const applyCoupon = (code) => {
    if(code.toUpperCase() === "SAVE500" && !couponApplied){
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discountValue = Math.round(subtotal * 0.3);
      setDiscount(discountValue);
      setCouponApplied(true);
      setCouponMessage("Coupon applied successfully! 30% discount applied.");
    } 
    else if(code.toUpperCase() === "SAVE" && !couponApplied){
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discountValue = Math.round(subtotal * 0.1);
      setDiscount(discountValue);
      setCouponApplied(true);
      setCouponMessage("Coupon applied successfully! 10% discount applied.");
    } 
     else if(code.toUpperCase() === "SAVEMORE" && !couponApplied){
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discountValue = Math.round(subtotal * 0.2);
      setDiscount(discountValue);
      setCouponApplied(true);
      setCouponMessage("Coupon applied successfully! 20% discount applied.");
    } 
     else if(code.toUpperCase() === "SAVEUS" && !couponApplied){
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discountValue = Math.round(subtotal * 0.15);
      setDiscount(discountValue);
      setCouponApplied(true);
      setCouponMessage("Coupon applied successfully! 15% discount applied.");
    } 
     else if(code.toUpperCase() === "SAVEOUR" && !couponApplied){
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discountValue = Math.round(subtotal * 0.25);
      setDiscount(discountValue);
      setCouponApplied(true);
      setCouponMessage("Coupon applied successfully! 25% discount applied.");
    } 
    else if(couponApplied){
      setCouponMessage("Coupon already applied!");
    } else {
      setCouponMessage("Invalid coupon code.");
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shipping - discount;

  return (
    <><Header />
  <div className="cart-container fade-in-page" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
      <div className="cart-header" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">Your Shopping Cart</div>

      <table className="cart-table" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <thead>
          <tr className="tr">
            <th>Product</th>
            <th>Item</th>
            <th>Category</th>
            <th>Color</th>
            <th>Size</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id} data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
              {/* یہاں img کو image سے تبدیل کیا گیا ہے */}
              <td className="cart-product-img"><img src={item.image || '/imgs/logo.png'} alt={item.name || 'Product'} /></td>
              <td className="cart-item-name">{item.name || 'N/A'}</td>
              <td className="cart-item-category">{item.category || 'N/A'}</td>
              <td className="cart-item-color">{item.color || 'N/A'}</td>
              <td className="cart-item-size">{item.size || '-'}</td>
              <td className="cart-item-price">Rs {(item.price ? item.price.toLocaleString() : '0')}</td>
              <td>
                <input 
                  type="number" 
                  value={item.quantity || 1} 
                  min="1" 
                  className="cart-qty-input"
                  onChange={(e) => handleQtyChange(item.id, e.target.value)}
                />
              </td>
              <td className="cart-item-subtotal">Rs {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
              <td>
                <div className="cart-remove-btn" onClick={() => removeItem(item.id)}></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flexbox box-1" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
      <div className="cart-coupon-section" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="cart-coupon-title">Have a Coupon?</div>
        <div className="cart-coupon-box">
          <input type="text" id="coupon-code" className="cart-coupon-input" placeholder="Enter coupon code"/>
          <button className="cart-apply-btn" onClick={() => applyCoupon(document.getElementById('coupon-code').value)}>Apply</button>
        </div>
         {couponMessage && (
            <div style={{ color: couponApplied ? 'green' : 'red', marginTop: 8, fontSize: 14 }}>{couponMessage}</div>
          )}
      </div>

      <div className="cart-order-summary" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
        <div className="cart-summary-title">Order Summary</div>
        <div className="cart-summary-item"><span>Subtotal</span><span>Rs {subtotal.toLocaleString()}</span></div>
        <div className="cart-summary-item"><span>Shipping</span><span>Rs {shipping.toLocaleString()}</span></div>
        <div className="cart-summary-item"><span>Coupon Discount</span><span>Rs {discount.toLocaleString()}</span></div>
        <div className="cart-summary-total"><span>Total</span><span>Rs {total.toLocaleString()}</span></div>
        <Link
          to="/Paymants"
          className="cart-checkout-btn"
          style={{
            pointerEvents: cartItems.length > 0 ? 'auto' : 'none',
            opacity: cartItems.length > 0 ? 1 : 0.5,
            cursor: cartItems.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          Proceed to Checkout
        </Link>
        {cartItems.length === 0 && (
          <div style={{ color: 'red', marginTop: 8, fontSize: 14 }}>
            Please add at least one product to your cart before proceeding to checkout.
          </div>
        )}
      </div>
    </div>
    </div>
    <Footer />
    </>
  )
};

export default Cart;