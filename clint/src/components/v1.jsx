import React, { useState, useEffect } from 'react';
// import './Dashboard.css'; 

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [productsToAdd, setProductsToAdd] = useState([]);
    
    // NAYA STATE: Edit karne ke liye
    const [editingProduct, setEditingProduct] = useState(null);
    // NAYA STATE: Messages dikhane ke liye
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const API_URL = 'https://aj-creativity-pk-2dpo.vercel.app/api';

    const initialProductState = {
        name: '',
        price: '',
        category: 'bangle',
        imageFile: null,
        imageUrl: '',
        imagePreviewUrl: null
    };

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/products`, { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProducts(data.data || []);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        return () => {
            productsToAdd.forEach(p => {
                if (p.imagePreviewUrl && p.imageFile) {
                    URL.revokeObjectURL(p.imagePreviewUrl);
                }
            });
        };
    }, [productsToAdd]);

    // --- Form Handling Functions (Existing) ---

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
            // alert('All products added successfully!');
            setMessage('All products added successfully!');
            setIsError(false);
            resetForm();
            fetchProducts(); 
        }
    };
    
    // --- NAYA CODE: Edit aur Delete ke Functions ---

    // EDIT FUNCTION: Jab user 'Edit' button par click karega
    const handleEditClick = (product) => {
        setEditingProduct({ ...product, imagePreviewUrl: product.image, imageFile: null });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // UPDATE FUNCTION: Form submit hone par
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        setUploading(true);
        // setError(null);
        setMessage('Product update ho raha hai...');
        setIsError(false);

        const data = new FormData();
        data.append('name', editingProduct.name);
        data.append('price', editingProduct.price);
        data.append('category', editingProduct.category);
        
        // Agar nayi image upload ki gayi hai
        if (editingProduct.imageFile) {
            data.append('image', editingProduct.imageFile);
        } else if (editingProduct.imageUrl) {
            data.append('image', editingProduct.imageUrl);
        }

        try {
            const response = await fetch(`${API_URL}/products/edit/${editingProduct._id}`, {
                method: 'PUT',
                body: data,
            });
            const result = await response.json();
            if (result.success) {
                // alert('Product successfully update ho gaya!');
                setMessage('Product successfully update ho gaya!');
                setIsError(false);
                setEditingProduct(null); // Form ko close karein
                fetchProducts(); // List ko refresh karein
            } else {
                // setError(result.message || 'Product update nahi ho saka.');
                setMessage(result.message || 'Product update nahi ho saka.');
                setIsError(true);
            }
        } catch (err) {
            // setError('Server se connect karne mein masla aaraha hai.');
            setMessage('Server se connect karne mein masla aaraha hai.');
            setIsError(true);
            console.error('Update karne mein error aagaya:', err);
        } finally {
            setUploading(false);
        }
    };
    
    // CANCEL EDIT
    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    // DELETE FUNCTION (Already existed, moved here for clarity)
    const handleDelete = async (productId) => {
        // if (window.confirm('Kya aap waqai is product ko delete karna chahte hain?')) {
        const confirmed = window.confirm('Kya aap waqai is product ko delete karna chahte hain?');
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/products/${productId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.success) {
                // alert('Product successfully delete ho gaya!');
                setMessage('Product successfully delete ho gaya!');
                setIsError(false);
                fetchProducts(); // List ko refresh karein
            } else {
                // alert(`Error: ${result.message || 'Product delete nahi ho saka.'}`);
                setMessage(`Error: ${result.message || 'Product delete nahi ho saka.'}`);
                setIsError(true);
            }
        } catch (err) {
            console.error('Delete karne mein error aagaya:', err);
            // alert('Server se connect karne mein masla aaraha hai.');
            setMessage('Server se connect karne mein masla aaraha hai.');
            setIsError(true);
        }
    };

    // --- JSX to Render ---
    return (
        <div className="dashboard-container">
            <h1>Product Management Dashboard</h1>
            
            {/* Messages dikhane ke liye naya div */}
            {(message || error) && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    backgroundColor: isError || error ? '#f8d7da' : '#d4edda',
                    color: isError || error ? '#721c24' : '#155724'
                }}>
                    {message || error}
                </div>
            )}
            
            {/* EDIT FORM: Sirf tab dikhega jab koi product edit ho raha ho */}
            {editingProduct && (
                <div className="edit-product-form">
                    <h2>Edit Product: {editingProduct.name}</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleUpdate}>
                        <div className="product-form-entry">
                            <div className="product-details-with-preview">
                                {editingProduct.imagePreviewUrl && (
                                    <div className="image-preview small">
                                        <img src={editingProduct.imagePreviewUrl} alt="Preview" />
                                    </div>
                                )}
                                <div className="product-fields">
                                    <div className="form-group">
                                        <label>Product Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={editingProduct.name} 
                                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            value={editingProduct.price} 
                                            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} 
                                            required 
                                            min="0" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select 
                                            name="category" 
                                            value={editingProduct.category} 
                                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} 
                                            required
                                        >
                                            <option value="bangle">Bangle</option>
                                            <option value="gold bangle">Gold Bangle</option>
                                            <option value="earring">Earring</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Change Image (Optional)</label>
                                        <input 
                                            type="file" 
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setEditingProduct({ ...editingProduct, imageFile: file, imagePreviewUrl: URL.createObjectURL(file) });
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" disabled={uploading}>
                                    {uploading ? 'Updating...' : 'Update Product'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        </div>
                    </form>
                    <hr />
                </div>
            )}
            
            {/* ADD FORM (as before) */}
            <div className="add-product-form" style={{ display: editingProduct ? 'none' : 'block' }}>
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
                                    {/* `onClick` ko `handleEditClick` se replace kiya gaya hai */}
                                    <button className="edit-btn" onClick={() => handleEditClick(product)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
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
