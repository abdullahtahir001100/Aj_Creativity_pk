import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = 'http://localhost:5000/api/data';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productForm, setProductForm] = useState({
    _id: null,
    name: '',
    price: '',
    category: '',
    image: '',
    isFeatured: false
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        const response = await fetch(`${API_URL}/${productForm._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm)
        });
        if (!response.ok) throw new Error('Failed to update product');
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm)
        });
        if (!response.ok) throw new Error('Failed to add product');
      }
      await fetchProducts();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setProductForm(product);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      _id: null,
      name: '',
      price: '',
      category: '',
      image: '',
      isFeatured: false
    });
    setIsEditing(false);
  };

  return (
    <>
      <Header />
      <div className="dashboard-container" style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center' }}>Admin Dashboard</h1>

        {/* Product Management Form */}
        <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
            <input type="text" name="name" value={productForm.name} onChange={handleFormChange} placeholder="Product Name" required style={inputStyle} />
            <input type="text" name="price" value={productForm.price} onChange={handleFormChange} placeholder="Price (e.g., 1200)" required style={inputStyle} />
            <input type="text" name="category" value={productForm.category} onChange={handleFormChange} placeholder="Category" required style={inputStyle} />
            <input type="text" name="image" value={productForm.image} onChange={handleFormChange} placeholder="Image URL (e.g., /imgs/p1.jpg)" required style={inputStyle} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" name="isFeatured" checked={productForm.isFeatured} onChange={handleFormChange} id="isFeaturedCheckbox" />
              <label htmlFor="isFeaturedCheckbox">Mark as Featured</label>
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>{isEditing ? 'Update Product' : 'Add Product'}</button>
            {isEditing && <button type="button" onClick={resetForm} style={{ ...buttonStyle, backgroundColor: '#888' }}>Cancel</button>}
          </form>
          {loading && <p>Processing...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>

        {/* Product List */}
        <div>
          <h2>Current Products</h2>
          <div style={productGridStyle}>
            {products.length > 0 ? (
              products.map(product => (
                <div key={product._id} style={productCardStyle}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <div style={{ padding: '10px' }}>
                    <h4>{product.name}</h4>
                    {product.isFeatured && <p style={{ color: '#007bff', fontWeight: 'bold' }}>⭐ Featured</p>}
                    <p><strong>Price:</strong> {product.price} Rs</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <div style={{ marginTop: '10px' }}>
                      <button onClick={() => handleEditClick(product)} style={editButtonStyle}>Edit</button>
                      <button onClick={() => handleDelete(product._id)} style={deleteButtonStyle}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const inputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box' };
const buttonStyle = { padding: '10px 20px', color: 'white', backgroundColor: '#333', border: 'none', cursor: 'pointer' };
const productGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' };
const productCardStyle = { border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const editButtonStyle = { padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', marginRight: '10px', cursor: 'pointer' };
const deleteButtonStyle = { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' };

export default Dashboard;