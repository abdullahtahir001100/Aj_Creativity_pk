import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header1"; 
import Footer from "../components/Footer";
import Loader from "../components/loader";
import TestimonialSlider from '../components/testi'; 


export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to shuffle an array for random product display
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  // Helper to normalize price string to a number
  function normalizePrice(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return Number(String(val).replace(/[^\d]/g, ''));
  }

  // Helper to retrieve the main product from sessionStorage on page refresh
  const getProductFromStorage = () => {
    const savedProduct = sessionStorage.getItem('mainProduct');
    if (savedProduct) {
      try {
        return JSON.parse(savedProduct);
      } catch (e) {
        console.error("Could not parse product from session storage", e);
        return undefined;
      }
    }
    return undefined;
  };

  const initialProduct = location.state?.product
    ? { ...location.state.product, price: normalizePrice(location.state.product.price) }
    : getProductFromStorage();

  const [mainProduct, setMainProduct] = useState(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");

  // Scroll to top, set main product, and persist to sessionStorage
  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state?.product) {
      const newProduct = { ...location.state.product, price: normalizePrice(location.state.product.price) };
      setMainProduct(newProduct);
      sessionStorage.setItem('mainProduct', JSON.stringify(newProduct));
      // Reset options when product changes
      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);
    }
  }, [location.state?.product]);

  // Fetch related products from the backend when the main product changes
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      // Return if there's no main product or it lacks a category
      if (!mainProduct || !mainProduct.category) {
        setRelatedProducts([]);
        return;
      }

      setLoadingRelated(true);
       // Define your two API endpoints in an array.
       const apiEndpoints = [
        'https://server-nine-kappa-75.vercel.app/api/data',
        'https://server-nine-kappa-75.vercel.app/api/data' // This is the second API endpoint option
      ];

      try {
         // Use Promise.all to fetch from both endpoints concurrently
         const responses = await Promise.all(
          apiEndpoints.map(url => fetch(url))
        );

        // Check if all responses are successful
        responses.forEach(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        });

        // Parse JSON from all responses
        const jsonDataArray = await Promise.all(
          responses.map(res => res.json())
        );
        
        // Combine the data arrays from all successful API responses into one array
        const allProducts = jsonDataArray.flatMap(data => {
            if (data.success && Array.isArray(data.data)) {
                return data.data;
            }
            // You can log a warning for any API that doesn't return the expected format
            console.warn("An API response was not in the expected format:", data);
            return []; // Return an empty array for this response to avoid errors
        });

        // De-duplicate the combined list of products based on their _id
        const uniqueProducts = Array.from(new Map(allProducts.map(item => [item._id, item])).values());

        if (uniqueProducts.length > 0) {
          // Filter products:
          // 1. Match the category of the main product.
          // 2. Exclude the main product itself from the list.
          const filtered = uniqueProducts.filter(
            (p) => p.category === mainProduct.category && p._id !== mainProduct._id
          );
          
          // Shuffle the filtered list and take the first 4 items
          const finalRelatedProducts = shuffle(filtered).slice(0, 4);
          setRelatedProducts(finalRelatedProducts);
        } else {
          console.error("Failed to fetch related products from all sources.");
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [mainProduct]); // This effect runs whenever mainProduct changes

  return (
    <>
      <Header />
      <div className="flexbox fade-in-page">
        <div className="product-detail">
          {/* Image Section */}
          <div className="product-image">
            <img
              src={mainProduct?.image || "/imgs/s11.jpg"}
              alt={mainProduct?.name || "Product Image"}
            />
          </div>

          {/* Details Section */}
          <div className="product-info">
            <h1>{mainProduct?.name || "Elegant Gold Necklace"}</h1>
            <p className="price">{mainProduct?.price ? `${mainProduct.price} Rs` : "$299.00"}</p>
            {mainProduct?.category && (
              <p className="category">Category: {mainProduct.category}</p>
            )}
            <p className="desc">
              A timeless piece crafted with precision. Perfect for weddings,
              parties, and special occasions.
            </p>

            {/* Size (not for earringss) */}
            {mainProduct?.category !== 'earrings' && (
              <div className="option-group">
                <label>Size:</label>
                <div className="options">
                  {["Small", "Medium", "Large", "Extra Large"].map((size) => (
                    <button
                      key={size}
                      className={selectedSize === size ? "active" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
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
                  {(mainProduct?.category === 'gold bangle'
                    ? ["gold"]
                    : ["gold", "silver", "rose", "black", "green", "yellow", "Red"]
                  ).map((color) => (
                    <span
                      key={color}
                      className={`color-dot ${color} ${selectedColor === color ? "active" : ""}`}
                      onClick={() => setSelectedColor(color)}
                    ></span>
                  ))}
                </div>
              </div>
              <div className="option-group">
                <label>Quantity:</label>
                <div className="quantity">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    −
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="add-to-cart"
              disabled={
                mainProduct?.category === 'earrings'
                  ? !(selectedColor && quantity > 0)
                  : !(selectedSize && selectedColor && quantity > 0)
              }
              style={{
                opacity: (mainProduct?.category === 'earrings' ? (selectedColor && quantity > 0) : (selectedSize && selectedColor && quantity > 0)) ? 1 : 0.5,
                cursor: (mainProduct?.category === 'earrings' ? (selectedColor && quantity > 0) : (selectedSize && selectedColor && quantity > 0)) ? "pointer" : "not-allowed"
              }}
              onClick={() => {
                if (!mainProduct) return;
                const isearrings = mainProduct.category === 'earrings';
                const canAddToCart = isearrings ? (selectedColor && quantity > 0) : (selectedSize && selectedColor && quantity > 0);
                
                if (!canAddToCart) return;

                const cartItem = {
                  id: mainProduct._id || Date.now(),
                  name: mainProduct.name,
                  category: mainProduct.category,
                  color: selectedColor,
                  size: isearrings ? undefined : selectedSize,
                  price: normalizePrice(mainProduct.price),
                  quantity,
                  img: mainProduct.image
                };
                
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                cart.push(cartItem);
                localStorage.setItem("cart", JSON.stringify(cart));
                window.dispatchEvent(new Event('cartUpdated'));
                setCartMessage("Added to cart!");
                setTimeout(() => setCartMessage(""), 2000);
              }}
            >
              Add to Cart
            </button>
            {/* Validation Messages */}
            {cartMessage && <div style={{ color: 'green', marginTop: 8, fontSize: 14 }}>{cartMessage}</div>}
          </div>
        </div>
      </div>
      <section className='padd1'> 
       <div className="heading">
            <div className="h1">
              <h1>What Our Customers Say</h1>
            </div>
          </div>
      {/* This is where you render the imported Testimonial Slider */}
      <TestimonialSlider />
      </section>
      {/* Related Products Section */}
      <div className="cointain">
        <div className="headings">
          <div className="h1">
            <h1>Related Products</h1>
          </div>
        </div>
        <div className={`products-grid points${relatedProducts.length <= 4 ? ' center-few' : ''}`}>
          {loadingRelated ? (
            <p><Loader /></p>
          ) : relatedProducts.length === 0 ? (
            <p>No related products found.</p>
          ) : (
            relatedProducts.map((product) => (
              <div
                className="product-card"
                key={product._id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate('/details', { state: { product } });
                }}
              >
                <img src={product.image} alt={product.name} />
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

