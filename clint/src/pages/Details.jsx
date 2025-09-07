import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/header1"; 
import Footer from "../components/Footer";
import Loader from "../components/loader";
import TestimonialSlider from '../components/testi'; 

export default function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const API_URL_PRIMARY = 'https://aj-creativity-pk-2dpo.vercel.app/api';
  const API_URL_SECONDARY = 'https://server-nine-kappa-75.vercel.app/api';

  const shuffle = (array) => {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  
  const normalizePrice = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return Number(String(val).replace(/[^\d]/g, ''));
  };

  const [mainProduct, setMainProduct] = useState(location.state?.product || null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(!mainProduct);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [customColor, setCustomColor] = useState(
    "conic-gradient(red, orange, yellow, green, cyan, blue, violet, red)"
  ); 
  const [quantity, setQuantity] = useState(1);

  // नई states
  const [cartMessage, setCartMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showGoToCart, setShowGoToCart] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const productFromState = location.state?.product;

    if (productFromState) {
        setMainProduct({ ...productFromState, price: normalizePrice(productFromState.price) });
        setLoading(false);
        setSelectedSize("");
        setSelectedColor("");
        setQuantity(1);
    } else if (id) {
      const fetchProductById = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL_PRIMARY}/products/${id}`);
          const data = await response.json();
          if (data.success && data.data) {
            setMainProduct({ ...data.data, price: normalizePrice(data.data.price) });
          } else {
            navigate('/product');
          }
        } catch (error) {
          console.error("Error fetching product by ID:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProductById();
    }
  }, [id, location.state?.product, navigate]);

  useEffect(() => {
    if (!mainProduct) return;
    const fetchRelatedProducts = async () => {
      setLoadingRelated(true);
      const apiEndpoints = [`${API_URL_SECONDARY}/data`, `${API_URL_PRIMARY}/products`];
      try {
        const responses = await Promise.all(apiEndpoints.map(url => fetch(url).then(res => res.json())));
        const allProducts = responses.flatMap(data => (data.success && Array.isArray(data.data)) ? data.data : []);
        const uniqueProducts = Array.from(new Map(allProducts.map(item => [item._id, item])).values());
        const filtered = uniqueProducts.filter(p => p.category === mainProduct.category && p._id !== mainProduct._id);
        setRelatedProducts(shuffle(filtered).slice(0, 4));
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };
    fetchRelatedProducts();
  }, [mainProduct]);

  if (loading || !mainProduct) {
    return <Loader />;
  }
  
  const handleCustomColorChange = (e) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    setSelectedColor(newColor);
  };
  
  const handleAddToCart = () => {
    const isearrings = mainProduct.category === 'earrings';
    const canAddToCart = isearrings ? (selectedColor && quantity > 0) : (selectedSize && selectedColor && quantity > 0);
    
    if (!canAddToCart) return;

    setIsPlacingOrder(true);

    setTimeout(() => {
      const cartItem = {
        id: mainProduct._id,
        name: mainProduct.name,
        category: mainProduct.category,
        color: selectedColor,
        size: isearrings ? undefined : selectedSize,
        price: mainProduct.price,
        quantity,
        img: mainProduct.image
      };
      
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      setIsPlacingOrder(false);
      setCartMessage("✅ Added to cart!");
      setShowGoToCart(true);

      setTimeout(() => {
        setCartMessage("");
        setShowGoToCart(false);
      }, 4000);
    }, 1500); // 1.5 second fake delay
  };
  
  return (
    <>
      <Header />
      {/* Popup Message */}
      {cartMessage && (
        <div style={{
          position: "fixed",
          top: "15px",
          right: "15px",
          background: "#4caf50",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
          zIndex: 9999,
          animation: "fadeInOut 4s ease",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span>{cartMessage}</span>
          {showGoToCart && (
            <button
              onClick={() => navigate("/cart")}
              style={{
                background: "white",
                color: "#4caf50",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Go to Cart
            </button>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes dots {
            0% { content: ""; }
            33% { content: "."; }
            66% { content: ".."; }
            100% { content: "..."; }
          }
          .dots::after {
            content: "";
            animation: dots 1.5s steps(3, end) infinite;
          }
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-20px); }
          }
        `}
      </style>

      <div className="flexbox fade-in-page">
        <div className="product-detail">
          {/* Image Section */}
          <div className="product-image">
            <img src={mainProduct.image} alt={mainProduct.name} />
          </div>

          {/* Details Section */}
          <div className="product-info">
            <h1>{mainProduct.name}</h1>
            <p className="price">{mainProduct.price} Rs</p>
            {mainProduct.category && (<p className="category">Category: {mainProduct.category}</p>)}
            <p className="desc">
              A timeless piece crafted with precision. Perfect for weddings, parties, and special occasions.
            </p>

            {/* Size (not for earrings) */}
            {mainProduct.category !== 'earrings' && (
              <div className="option-group">
                <label>Size:</label>
                <div className="options">
                  {["Small", "Medium", "Large", "Extra Large"].map((size) => (
                    <button key={size} className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color and Quantity */}
            <div className="flex">
              <div className="option-group">
                <label>Color:</label>
                <div className="color-options">
                  {(mainProduct.category === 'gold bangle' ? ["gold"] : ["gold", "silver", "rose", "black", "green", "yellow", "Red"])
                  .map((color) => (
                    <span key={color} className={`color-dot ${color} ${selectedColor === color ? "active" : ""}`} onClick={() => setSelectedColor(color)}></span>
                  ))}
                  
                  {/* Custom Color Picker */}
                  <label
                    className="multi-color-picker"
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "25px",
                      height: "27px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      cursor: "pointer",
                      marginLeft: "8px"
                    }}
                  >
                    <span
                      className="preview"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: customColor,
                      }}
                    ></span>
                    <input
                      type="color"
                      value={selectedColor.startsWith("#") ? selectedColor : "#e66465"}
                      onChange={handleCustomColorChange}
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="option-group">
                <label>Quantity:</label>
                <div className="quantity">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="add-to-cart"
              onClick={handleAddToCart}
              disabled={isPlacingOrder}
              style={{
                opacity: isPlacingOrder ? 0.7 : 1,
                cursor: isPlacingOrder ? "wait" : "pointer"
              }}
            >
              {isPlacingOrder ? (
                <span>Placing Order<span className="dots"></span></span>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </div>
      
      <section className='padd1'> 
        <div className="heading"><div className="h1"><h1>What Our Customers Say</h1></div></div>
        <TestimonialSlider />
      </section>
      
      {/* Related Products Section */}
      <div className="cointain">
        <div className="headings">
          <div className="h1"><h1>Related Products</h1></div>
        </div>
        <div className={`products-grid points${relatedProducts.length <= 4 ? ' center-few' : ''}`}>
          {loadingRelated ? (
            <Loader />
          ) : relatedProducts.length === 0 ? (
            <p>No related products found.</p>
          ) : (
            relatedProducts.map((product) => (
              <div
                className="product-card"
                key={product._id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const slug = product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                  const productForState = { ...product, image: Array.isArray(product.image) ? product.image[0] : product.image };
                  navigate(`/product/${slug}/${product._id}`, { state: { product: productForState } });
                }}
              >
                <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.name} />
                <div className="flex-1">
                  <div className="detail">
                    <small>{product.category}</small>
                    <h4>{product.name}</h4>
                    <p>{product.price} Rs</p>
                  </div>
                  <img src="/shopping.png" alt="Add to cart" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
