// src/pages/ProductDashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/header1";
import Footer from "../components/Footer";
import "../styles/product-management.scss"; // Styling import

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  const API_URL = "https://aj-creativitypk.vercel.app/api/dashboard-products";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch products. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      image: "",
    });
    setShowModal(true);
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`${API_URL}/${productId}`, {
          method: "DELETE",
        });
        fetchProducts(); // Refresh the list
      } catch (err) {
        setError("Failed to delete product.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_URL}/${currentProduct._id}` : API_URL;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        fetchProducts();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to save product.");
    }
  };

  const renderProductList = () => {
    if (loading) return <div className="loading-state">Loading products...</div>;
    if (error) return <div className="error-state">Error: {error}</div>;
    if (products.length === 0) return <div className="empty-state">No products added yet.</div>;
    
    return (
      <div className="product-list-container">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="product-image" />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Price:</strong> {product.price}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEditClick(product)} className="edit-btn">Edit</button>
              <button onClick={() => handleDeleteClick(product._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <div className="product-form-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{isEditing ? "Edit Product" : "Add New Product"}</h2>
            <button onClick={() => setShowModal(false)} className="modal-close-button">×</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-input" required step="0.01" />
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input type="url" name="image" value={formData.image} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowModal(false)} className="form-button cancel">Cancel</button>
              <button type="submit" className="form-button submit">{isEditing ? "Update Product" : "Add Product"}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h1>Product Management</h1>
        <button onClick={handleAddClick} className="add-product-btn">
          + Add New Product
        </button>
        {renderProductList()}
      </div>
      <Footer />
      {renderModal()}
    </>
  );
};

export default ProductDashboard;