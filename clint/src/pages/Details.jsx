import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/header1";
import Footer from "../components/Footer";

export default function ProductDetail() {
  const location = useLocation();

  // ReviewsSlider component - No animations
  const ReviewsSlider = () => {
    const reviewsContainerRef = React.useRef(null);

    const firstNames = ["Eman", "Hamna", "Ayesha", "Subhan", "Aliya", "Zain", "Sana", "Bilal", "Hira", "Osman", "Mahnoor", "Hamza", "Sarah", "Adil", "Faiza", "Shahbaz", "Iqra", "Rizwan", "Maria", "Tariq", "Noor", "Saim", "Hafsa", "Arsalan", "Zoya"];
    const lastNames = ["Khan", "Ali", "Subhan", "Raza", "Mir", "Malik", "Shah", "Ahmed", "Qureshi", "Farooq", "Iqbal", "Tariq", "Javed", "Riaz", "Saleem", "Hussain", "Sheikh", "Zafar", "Aslam", "Saeed", "Nawaz", "Hashmi", "Aziz", "Anwar", "Sattar"];
    const reviewTexts = [
      "Absolutely love the craftsmanship! Each piece is unique and beautifully made. The attention to detail is outstanding and I receive compliments every time I wear it.",
      "The handmade jewelry is gorgeous. The quality is top-notch and the designs are elegant. Fast delivery and very friendly service.",
      "I ordered a customized necklace and it came exactly as I imagined. The finishing is perfect and it feels so premium. I highly recommend this store to everyone.",
      "Wonderful shopping experience! The jewelry looks stunning and is comfortable to wear. I appreciate the care put into packaging each item.",
      "Amazing designs with great quality. Every piece feels personal and unique. I am very happy with my purchase and will order again.",
      "The earrings I bought are so delicate and beautifully crafted. They are perfect for gifting and I can tell they are made with love and care.",
      "Exceptional service and excellent jewelry. Every piece tells a story and adds a touch of elegance to my outfits. I get asked about them all the time!",
      "High-quality handmade jewelry that looks much more expensive than it is. Really happy with my purchase and will definitely buy more.",
      "The bracelets are beautiful and sturdy. The craftsmanship is amazing and I love that each item is handmade. Excellent customer support too.",
      "Truly impressed with the attention to detail. The jewelry feels luxurious and unique. I can tell these are made by skilled artisans."
    ];

    const reviews = Array.from({ length: 120 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const stars = Math.floor(Math.random() * 3) + 3;
      const text = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      const img = `https://i.pravatar.cc/50?img=${i % 70 + 1}`;
      return { name: `${firstName} ${lastName}`, stars, text, img };
    });

    // Populate the reviews container once on mount
    useEffect(() => {
      const container = reviewsContainerRef.current;
      if (container) {
        reviews.forEach(review => {
          const div = document.createElement('div');
          div.className = 'review-card';
          div.innerHTML = `
            <div class="review-header">
              <img src="${review.img}" alt="Customer avatar" loading="lazy">
              <div class="user-name">${review.name}</div>
            </div>
            <div class="review-stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</div>
            <div class="review-text">${review.text}</div>
          `;
          container.appendChild(div);
        });
      }
    }, [reviews]);

    return (
      <div className="reviews-section">
        <h2>Customer Reviews - Handmade Jewelry</h2>
        <div className="reviews-wrapper">
          <div className="reviews-container" ref={reviewsContainerRef}></div>
        </div>
      </div>
    );
  };

  function normalizePrice(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return Number(String(val).replace(/[^\d]/g, ''));
  }

  const initialProduct = location.state?.product
    ? { ...location.state.product, price: normalizePrice(location.state.product.price) }
    : undefined;
  const [mainProduct, setMainProduct] = useState(initialProduct);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mainProduct]);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");

  const products = [
    { img: '/imgs/s1.jpg', name: 'Royal Radiance', price: '1,550', category: 'gold bangle' },
    { img: '/imgs/s2.jpg', name: 'Timeless Spark', price: '500', category: 'bangle' },
    { img: '/imgs/s3.jpg', name: 'Heritage Grace', price: '590', category: 'bangle' },
    { img: '/imgs/s5.jpg', name: 'Elegant Loop', price: '1,350', category: 'bangle' },
    { img: '/imgs/s6.jpg', name: 'Pearl Essence', price: '1,800', category: 'bangle' },
    { img: '/imgs/s7.jpg', name: 'Golden Dream', price: '1,990', category: 'bangle' },
    { img: '/imgs/s8.jpg', name: 'Textured Shine', price: '1,550', category: 'bangle' },
    { img: '/imgs/s9.jpg', name: 'Floral Dream', price: '1,800', category: 'bangle' },
    { img: '/imgs/s10.jpg', name: 'Artisan Touch', price: '1,350', category: 'bangle' },
    { img: '/imgs/s11.jpg', name: 'Enamel Blossom', price: '1,550', category: 'bangle' },
    { img: '/imgs/s12.jpg', name: 'Modern Chic', price: '550', category: 'earring' },
    { img: '/imgs/s13.jpg', name: 'Vintage Aura', price: '490', category: 'earring' },
    { img: '/imgs/s14.jpg', name: 'Pearl Drop', price: '500', category: 'earring' },
    { img: '/imgs/s15.jpg', name: 'Signature Shine', price: '150', category: 'earring' },
    { img: '/imgs/s16.jpg', name: 'Chic Hoops', price: '590', category: 'earring' },
    { img: '/imgs/s17.jpg', name: 'Crystal Spark', price: '1,200', category: 'earring' },
    { img: '/imgs/s18.jpg', name: 'Dazzle Drop', price: '1,350', category: 'earring' },
    { img: '/imgs/s19.jpg', name: 'Petal Studs', price: '1,550', category: 'earring' },
    { img: '/imgs/s20.jpg', name: 'Twist Loop', price: '1,800', category: 'earring' },
  ];

  let relatedProducts = mainProduct
    ? products.filter(
        (p) =>
          p.category === mainProduct.category &&
          (p.name !== mainProduct.name || p.img !== mainProduct.img)
      )
    : products;

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  relatedProducts = shuffle(relatedProducts).slice(0, 4);

  return (
    <>
      <Header />
      <div className="flexbox fade-in-page">
        <div className="product-detail">
          {/* Image Section */}
          <div className="product-image">
            <img
              src={mainProduct?.img || "./imgs/s11.jpg"}
              alt={mainProduct?.name || "Gold Necklace"}
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

            {/* Size (not for earrings) */}
            {mainProduct?.category !== 'earring' && (
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
                mainProduct?.category === 'earring'
                  ? !(selectedColor && quantity > 0)
                  : !(selectedSize && selectedColor && quantity > 0)
              }
              style={{
                opacity:
                  mainProduct?.category === 'earring'
                    ? selectedColor && quantity > 0
                    : selectedSize && selectedColor && quantity > 0
                  ? 1 : 0.5,
                cursor:
                  mainProduct?.category === 'earring'
                    ? selectedColor && quantity > 0
                    : selectedSize && selectedColor && quantity > 0
                  ? "pointer" : "not-allowed"
              }}
              onClick={() => {
                if (!mainProduct) return;
                if (
                  (mainProduct.category === 'earring' && !(selectedColor && quantity > 0)) ||
                  (mainProduct.category !== 'earring' && !(selectedSize && selectedColor && quantity > 0))
                ) return;
                const cartItem = {
                  id: Date.now(),
                  name: mainProduct.name,
                  category: mainProduct.category,
                  color: selectedColor,
                  size: mainProduct.category === 'earring' ? undefined : selectedSize,
                  price: Number(String(mainProduct.price).replace(/[^\d]/g, "")),
                  quantity,
                  img: mainProduct.img
                };
                let cart = [];
                try { cart = JSON.parse(localStorage.getItem("cart")) || []; } catch (e) {}
                cart.push(cartItem);
                localStorage.setItem("cart", JSON.stringify(cart));
                window.dispatchEvent(new Event('cartUpdated'));
                setCartMessage("Added to cart!");
                setTimeout(() => setCartMessage(""), 2000);
              }}
            >
              Add to Cart
            </button>
            {mainProduct?.category === 'earring'
              ? !(selectedColor && quantity > 0) && (
                <div style={{ color: 'red', marginTop: 8, fontSize: 14 }}>
                  Please select color and quantity before adding to cart.
                </div>
              )
              : !(selectedSize && selectedColor && quantity > 0) && (
                <div style={{ color: 'red', marginTop: 8, fontSize: 14 }}>
                  Please select size, color, and quantity before adding to cart.
                </div>
              )}
            {cartMessage && (
              <div style={{ color: 'green', marginTop: 8, fontSize: 14 }}>{cartMessage}</div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Slider */}
      <div className="reviews-container-wrapper">
        <ReviewsSlider />
      </div>

      {/* Related Products */}
      <div className="cointain">
        <div className="headings">
          <div className="h1">
            <h1>related products</h1>
          </div>
        </div>
        <div className={`products-grid points${relatedProducts.length <= 4 ? ' center-few' : ''}`}> 
          {relatedProducts.length === 0 ? (
            <p>No related products found.</p>
          ) : (
            relatedProducts.map((product, idx) => (
              <div
                className="product-card"
                key={idx}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setMainProduct(product);
                  setSelectedSize("");
                  setSelectedColor("");
                  setQuantity(1);
                }}
              >
                <img src={product.img} alt={product.name} />
                <div className="flex-1">
                  <div className="detail">
                    <small>{product.category}</small>
                    <h4>{product.name}</h4>
                    <p>{product.price} Rs</p>
                  </div>
                  <img src="./shopping.png" alt="" />
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