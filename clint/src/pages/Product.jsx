import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header1";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Footer from "../components/Footer";
import "../styles/main.scss"; // SCSS import

const priceRanges = [
    { label: "0 - 500", min: 0, max: 500 },
    { label: "501 - 1000", min: 501, max: 1000 },
    { label: "1001 - 2000", min: 1001, max: 2000 },
    { label: "2001+", min: 2001, max: Infinity }
];

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [cartMessage, setCartMessage] = useState("");
    const footerRef = useRef(null);

    const API_URL = "https://aj-creativitypk.vercel.app/api/dashboard-products";

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (selectedCategories.length > 0) {
                queryParams.append('category', selectedCategories.join(','));
            }
            if (selectedPrices.length > 0) {
                const priceRange = selectedPrices[0];
                const range = priceRanges.find(r => r.label === priceRange);
                if (range) {
                    queryParams.append('minPrice', range.min);
                    queryParams.append('maxPrice', range.max);
                }
            }
            const response = await fetch(`${API_URL}?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            setProducts(data.products || []);
            
            const allCategories = [...new Set(data.products.map(p => p.category))];
            setCategories(allCategories);
        } catch (err) {
            console.error("❌ Error fetching products:", err);
            setError("Failed to load products. Please check the backend connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategories, selectedPrices]);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handlePriceChange = (rangeLabel) => {
        setSelectedPrices((prev) =>
            prev.includes(rangeLabel) ? prev.filter((r) => r !== rangeLabel) : [...prev, rangeLabel]
        );
    };

    const handleAddToCart = (product) => {
        const cartItem = {
            id: product._id,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: 1,
            image: product.image
        };
        let cart = [];
        try { cart = JSON.parse(localStorage.getItem("cart")) || []; } catch (e) {}
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        setCartMessage("Added to cart!");
        setTimeout(() => setCartMessage(""), 2000);
    };

    const handleProductClick = (product) => {
        navigate("/details", { state: { product } });
    };

    return (
        <>
            <Header />
            <section className="product-page fade-in-page">
                <div className="container">
                    <aside className="sidebar">
                        <div className="bar" ref={useRef(null)}>
                            <div className="op-1">
                                <h3>Filter by Category</h3>
                                {categories.map((cat) => (
                                    <label key={cat}>
                                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} /> {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </label>
                                ))}
                            </div>
                            <div className="op-2">
                                <h3>Filter by Price</h3>
                                {priceRanges.map((range) => (
                                    <label key={range.label}>
                                        <input type="checkbox" checked={selectedPrices.includes(range.label)} onChange={() => handlePriceChange(range.label)} /> {range.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>
                    <div className="products-grid">
                        {loading && <div className="loading-state">Loading products...</div>}
                        {error && <div className="error-state">❌ Error: {error}</div>}
                        {!loading && !error && products.length === 0 && <div className="empty-state">No products found.</div>}
                        
                        {products.map((product) => (
                            <div className="product-card" key={product._id} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                                <LazyLoadImage
                                    alt={product.name}
                                    src={product.image || "https://via.placeholder.com/400x200?text=No+Image"}
                                    effect="blur"
                                    width="100%"
                                    height="300px"
                                    style={{ objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }}
                                />
                                <div className="flex-1">
                                    <div className="detail">
                                        <small>{product.category}</small>
                                        <h4>{product.name}</h4>
                                        <p>{product.price.toLocaleString()} Rs</p>
                                    </div>
                                    <img src="./shopping.png" alt="Add to cart" className="carts" style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); handleAddToCart(product); }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {cartMessage && (
                <div style={{ position: 'fixed', top: 10, right: 30, background: '#4BB543', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.13)' }}>
                    {cartMessage}
                </div>
            )}
            <div ref={footerRef}>
                <Footer />
            </div>
        </>
    );
};

export default Product;