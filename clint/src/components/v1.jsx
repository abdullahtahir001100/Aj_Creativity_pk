import React, { useState, useEffect } from 'react';
// Make sure you create and import the CSS file for styling
// import './Dashboard.css'; 

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [productsToAdd, setProductsToAdd] = useState([]);

    const API_URL = 'https://aj-creativity-pk-2dpo.vercel.app/api';

    const initialProductState = {
        name: '',
        price: '',
        category: 'bangle',
        imageFile: null,
        imageUrl: '',
        imagePreviewUrl: null
    };

    // Fetches the product list from the server
    const fetchProducts = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            // Added { cache: 'no-cache' } to prevent the browser from showing old data
            const response = await fetch(`${API_URL}/products`, { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            // Correctly sets state based on API response like: {"success":true, "data":[...]}
            setProducts(data.data || []); 
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products when the component first loads
    useEffect(() => {
        fetchProducts();
    }, []);

    // Clean up temporary image preview URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            productsToAdd.forEach(p => {
                if (p.imagePreviewUrl && p.imageFile) {
                    URL.revokeObjectURL(p.imagePreviewUrl);
                }
            });
        };
    }, [productsToAdd]);

    // --- Form Handling Functions ---

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newProducts = Array.from(files).map(file => ({
                ...initialProductState,
                imageFile: file,
                imagePreviewUrl: URL.createObjectURL(file)
            }));
            setProductsToAdd(newProducts);
        }
    };

    const handleAddManually = () => {
        setProductsToAdd([...productsToAdd, { ...initialProductState }]);
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...productsToAdd];
        updatedProducts[index][name] = value;
        setProductsToAdd(updatedProducts);
    };

    const handleUrlChange = (index, e) => {
        const { value } = e.target;
        const updatedProducts = [...productsToAdd];
        updatedProducts[index].imageUrl = value;
        updatedProducts[index].imagePreviewUrl = value;
        setProductsToAdd(updatedProducts);
    };

    const handleRemoveProduct = (index) => {
        if (productsToAdd[index].imagePreviewUrl && productsToAdd[index].imageFile) {
            URL.revokeObjectURL(productsToAdd[index].imagePreviewUrl);
        }
        const updatedProducts = productsToAdd.filter((_, i) => i !== index);
        setProductsToAdd(updatedProducts);
    };
    
    const resetForm = () => {
        setProductsToAdd([]);
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
    };

    // --- Submit Handler ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (productsToAdd.length === 0) {
            setError("Please add at least one product.");
            return;
        }
        setUploading(true);
        setError(null);

        let allSuccess = true;
        for (const product of productsToAdd) {
            const data = new FormData();
            data.append('name', product.name);
            data.append('price', product.price);
            data.append('category', product.category);

            if (product.imageFile) {
                data.append('image', product.imageFile);
            } else if (product.imageUrl) {
                data.append('image', product.imageUrl);
            } else {
                setError(`Please provide an image or URL for product: "${product.name || 'Untitled'}"`);
                allSuccess = false;
                break;
            }

            try {
                const response = await fetch(`${API_URL}/products/add`, {
                    method: 'POST',
                    body: data,
                });
                const result = await response.json();
                if (!result.success) {
                    setError(result.message || `Failed to save product: "${product.name}"`);
                    allSuccess = false;
                    break;
                }
            } catch (err) {
                setError(`Server error while saving product: "${product.name}"`);
                allSuccess = false;
                break;
            }
        }

        setUploading(false);
        if (allSuccess) {
            alert('All products added successfully!');
            resetForm();
            // This is the most important step: Re-fetch the product list to show the new product.
            fetchProducts(); 
        }
    };
    
    // --- JSX to Render ---

    return (
        <div className="dashboard-container">
            <h1>Product Management Dashboard</h1>
            
            <div className="add-product-form">
                <h2>Add New Product(s)</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="add-options">
                        <div className="form-group">
                            <label htmlFor="image-upload">Option 1: Select Images From Computer</label>
                            <input type="file" id="image-upload" onChange={handleFileChange} accept="image/*" multiple />
                        </div>
                        <div className="form-group">
                            <label>Option 2: Add Manually with URL</label>
                            <button type="button" onClick={handleAddManually} className="add-manual-btn">
                                + Add a Product Manually
                            </button>
                        </div>
                    </div>
                    <hr/>
                    {productsToAdd.map((product, index) => (
                        <div key={index} className="product-form-entry">
                            <h4>Product {index + 1}</h4>
                            <div className="product-details-with-preview">
                                {product.imagePreviewUrl && (
                                    <div className="image-preview small">
                                        <img src={product.imagePreviewUrl} alt="Preview" />
                                    </div>
                                )}
                                <div className="product-fields">
                                    {product.imageFile ? (
                                        <p>File: <strong>{product.imageFile.name}</strong></p>
                                    ) : (
                                        <div className="form-group">
                                            <label>Product Image URL</label>
                                            <input type="url" placeholder="https://example.com/image.jpg" value={product.imageUrl} onChange={(e) => handleUrlChange(index, e)} required />
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label>Product Name</label>
                                        <input type="text" name="name" value={product.name} onChange={(e) => handleProductChange(index, e)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input type="number" name="price" value={product.price} onChange={(e) => handleProductChange(index, e)} required min="0" />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select name="category" value={product.category} onChange={(e) => handleProductChange(index, e)} required>
                                            <option value="bangle">Bangle</option>
                                            <option value="gold bangle">Gold Bangle</option>
                                            <option value="earring">Earring</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="remove-btn" onClick={() => handleRemoveProduct(index)}>Remove</button>
                            <hr />
                        </div>
                    ))}
                    {productsToAdd.length > 0 && (
                        <div className="form-actions">
                            <button type="submit" disabled={uploading}>
                                {uploading ? 'Uploading...' : `Add All ${productsToAdd.length} Product(s)`}
                            </button>
                            <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                        </div>
                    )}
                </form>
            </div>
            
            <div className="product-list-section">
                <h2>Existing Products ({products.length})</h2>
                {loading && <p>Loading products...</p>}
                
                {!loading && !error && (
                    <div className="product-grid">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <img src={product.image} alt={product.name} className="product-image"/>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">Rs. {product.price}</p>
                                    <p className="product-category">Category: {product.category}</p>
                                </div>
                                <div className="product-actions">
                                    <button className="edit-btn">Edit</button>
                                    <button className="delete-btn">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {!loading && products.length === 0 && <p>No products found. Add one to get started!</p>}
            </div>
        </div>
    );
};

export default Dashboard;