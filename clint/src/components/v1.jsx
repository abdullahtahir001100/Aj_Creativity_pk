import React, { useState, useEffect } from 'react';
import Header from '../components/header1';
import Footer from '../components/Footer';

// API URL is hardcoded to fix the 'process is not defined' error
const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'bangle',
    image: null
  });

  // Products fetch karne ka function
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Component load hone par products fetch karein
  useEffect(() => {
    fetchProducts();
  }, []);

  // Form input changes handle karein
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // File input change handle karein
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  // Form submit handle karein
  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('image', formData.image);

      try {
        const response = await fetch(`${API_URL}/products/add`, {
          method: 'POST',
          body: data
        });

        const result = await response.json();
        if (result.success) {
          setFormData({
            name: '',
            price: '',
            category: 'bangle',
            image: null
          });
          fetchProducts(); // Products list ko refresh karein
        } else {
          setError(result.message || 'Failed to add product');
        }
      } catch (err) {
        setError('Error adding product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Product delete karne ka function
    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
          });

          const result = await response.json();
          if (result.success) {
            fetchProducts(); // Products list ko refresh karein
          } else {
            setError(result.message || 'Failed to delete product');
          }
        } catch (err) {
          setError('Error deleting product');
          console.error(err);
        }
      }
    };

    return (
      <>
        <Header />
        <div className="dashboard-container">
          <h1>Dashboard</h1>
          {error && <div className="error-message">{error}</div>}

          {/* Add Product Form */}
          <div className="add-product-form">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Product Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (Rs):</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="bangle">bangle</option>
                  <option value="gold bangle">gold bangle</option>
                  <option value="earring">earring</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">Product Image:</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="product-list">
            <h2>Product List</h2>
            {loading && <p>Loading products...</p>}
            {products.length === 0 && !loading ? (
              <p>No products found. Add some products!</p>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img
                        src={`${API_URL.replace('/api', '')}${product.image}`}
                        alt={product.name}
                      />
                    </div>
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p>Price: ${product.price}</p>
                      <p>Category: {product.category}</p>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  };

  export default Dashboard;