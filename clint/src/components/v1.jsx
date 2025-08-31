import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'bangle',
    description: '', // ADDED: Description field to match backend
    image: null,
  });

  const API_URL = 'https://aj-creativity-pk-2dpo.vercel.app/api';

  // Fetch products from the API
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change and show a preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, image: null });
      setImagePreviewUrl(null);
    }
  };

  // Reset the form after submission
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'bangle',
      description: '', // ADDED: Reset description
      image: null,
    });
    setImagePreviewUrl(null);
    setEditingProduct(null);
  };

  // Handle form submission (Add & Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description); // ADDED: Append description
    if (formData.image) {
      data.append('image', formData.image);
    }

    const url = editingProduct
      ? `${API_URL}/products/${editingProduct._id}`
      : `${API_URL}/products/add`;
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        resetForm();
        fetchProducts();
      } else {
        setError(result.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Error saving product');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
        });
        fetchProducts();
      } catch (err) {
        setError('Error deleting product');
        console.error(err);
      }
    }
  };

  // Handle product edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description, // ADDED: Set description for edit
      image: null,
    });
    setImagePreviewUrl(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="dashboard-container">
        <h1>Product Management Dashboard</h1>

        {/* Add/Edit Product Form */}
        <div className="add-product-form">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
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
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="bangle">Bangle</option>
                <option value="gold bangle">Gold Bangle</option>
                <option value="earring">Earring</option>
              </select>
            </div>

            {/* ADDED: Description input field */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image-upload">Product Image:</label>
              <input
                type="file"
                id="image-upload"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                required={!editingProduct}
              />
              {/* Image Preview */}
              {imagePreviewUrl && (
                <div className="image-preview">
                  <img src={imagePreviewUrl} alt="Image Preview" />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
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
                      src={product.image} 
                      alt={product.name} 
                    />
                  </div>
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p>Price: ${product.price}</p>
                    <p>Category: {product.category}</p>
                    <div className="actions">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEdit(product)}>
                        Edit
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;