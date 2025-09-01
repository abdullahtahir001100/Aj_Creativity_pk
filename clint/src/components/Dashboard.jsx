import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard-header.scss'; // Import the SCSS file

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dwnnadeb0';
const CLOUDINARY_UPLOAD_PRESET = 'aj_creativity_preset';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Updated API URL to match your backend's new root path
const API_URL = 'https://server-nine-kappa-75.vercel.app/api/data';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dynamicForms, setDynamicForms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [initialProduct, setInitialProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const { data } = await response.json(); // Correctly destructure to get the array
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newForms = files.map(file => ({
        id: URL.createObjectURL(file), // Use a temporary ID for keying
        name: '',
        price: '',
        category: '',
        imageFile: file,
        imagePreviewUrl: URL.createObjectURL(file),
        placement: 'latest'
      }));
      setDynamicForms(newForms);
      setIsEditing(false);
    } else {
      setDynamicForms([]);
    }
  };

  const handleFormChange = (e, formId) => {
    const { name, value } = e.target;
    setDynamicForms(prevForms =>
      prevForms.map(form =>
        form.id === formId ? { ...form, [name]: value } : form
      )
    );
  };

  const uploadImages = async () => {
    if (dynamicForms.length === 0) return [];
    setUploading(true);
    const imageUrls = [];

    for (const form of dynamicForms) {
      if (!form.imageFile) continue;

      const formData = new FormData();
      formData.append('file', form.imageFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message);
        }
        
        const data = await response.json();
        imageUrls.push(data.secure_url);

      } catch (err) {
        setError(`Upload error: ${err.message}`);
        setUploading(false);
        return null;
      }
    }
    setUploading(false);
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const imageUrls = await uploadImages();
    if (!imageUrls) {
      setLoading(false);
      return;
    }

    const successfulUploads = [];
    for (let i = 0; i < dynamicForms.length; i++) {
        const form = dynamicForms[i];
        const productData = {
          name: form.name,
          price: form.price,
          category: form.category,
          image: [imageUrls[i]],
          placement: form.placement
        };
        try {
          const productResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
          });
          if (!productResponse.ok) throw new Error('Failed to add product');
          successfulUploads.push(productData.name);
        } catch (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
    }
    await fetchProducts();
    resetForm();
    alert(`Successfully added ${successfulUploads.length} product(s)!`);
    setLoading(false);
  };
  
  const handleEditClick = (product) => {
    setInitialProduct(product);
    setDynamicForms([{
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageFile: null,
      imagePreviewUrl: product.image[0],
      placement: product.placement
    }]);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formToUpdate = dynamicForms[0];
    let imageUrl = formToUpdate.imagePreviewUrl;
    
    if (formToUpdate.imageFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', formToUpdate.imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const uploadResponse = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Cloudinary upload failed');
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
      } catch (err) {
        setError(err.message);
        setUploading(false);
        setLoading(false);
        return;
      }
      setUploading(false);
    }
    const updatedData = {
      name: formToUpdate.name,
      price: formToUpdate.price,
      category: formToUpdate.category,
      image: [imageUrl],
      placement: formToUpdate.placement
    };
    try {
      const response = await fetch(`${API_URL}/${formToUpdate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error('Failed to update product');
      await fetchProducts();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
    setDynamicForms([]);
    setInitialProduct(null);
    setIsEditing(false);
  };

  return (
    <>
      <div className="dashboard-container">
        <h1>Manage Home Products</h1>
        {/* Product Management Section */}
        <div className="product-management">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product(s)'}</h2>
          {!isEditing && (
            <input type="file" onChange={handleFileChange} multiple className="input-file" />
          )}
        </div>
        {dynamicForms.length > 0 && (
          <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
            {dynamicForms.map((form, index) => (
              <div key={form.id} className="form-container">
                <div className="form-row">
                  <img src={form.imagePreviewUrl} alt={`Preview ${index}`} className="image-preview" />
                  <p>{form.imageFile?.name || 'Current Image'}</p>
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => handleFormChange(e, form.id)}
                  placeholder="Product Name"
                  required
                  className="form-input"
                />
                <input
                  type="text"
                  name="price"
                  value={form.price}
                  onChange={(e) => handleFormChange(e, form.id)}
                  placeholder="Price (e.g., 1200)"
                  required
                  className="form-input"
                />
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={(e) => handleFormChange(e, form.id)}
                  placeholder="Category"
                  required
                  className="form-input"
                />
                <select
                  name="placement"
                  value={form.placement}
                  onChange={(e) => handleFormChange(e, form.id)}
                  className="form-input"
                >
                  <option value="latest">Latest Products</option>
                  <option value="featured">Featured Products</option>
                  <option value="none">None</option>
                </select>
              </div>
            ))}
            <button type="submit" disabled={loading || uploading} className="submit-button">
              {loading ? 'Processing...' : (isEditing ? 'Update Product' : 'Add Products')}
            </button>
            <button type="button" onClick={resetForm} className="cancel-button">
              Cancel
            </button>
          </form>
        )}
        {uploading && <p className="loading-text">Uploading images...</p>}
        {error && <p className="error-text">Error: {error}</p>}
        <div className='main'> 
          <h2>Current Products</h2>
          <div className="product-grid">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product._id} className="product-card">
                  <img src={product.image[0]} alt={product.name} className="product-image" />
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p><strong>Placement:</strong> {product.placement}</p>
                    <p><strong>Price:</strong> {product.price} Rs</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <div className="product-buttons">
                      <button onClick={() => handleEditClick(product)} className="edit-button">Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="delete-button">Delete</button>
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
    </>
  );
};

export default Dashboard;