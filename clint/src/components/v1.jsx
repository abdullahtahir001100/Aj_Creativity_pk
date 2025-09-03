import React, { useState, useEffect } from 'react';

// You will need a CSS file for styling. Let's call it Dashboard.css
// import './Dashboard.css'; 

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productsToAdd, setProductsToAdd] = useState([]);

    const API_URL = 'https://aj-creativity-pk-2dpo.vercel.app/api';

    // Naya state object jo file aur URL dono ko handle karega
    const initialProductState = {
        name: '',
        price: '',
        category: 'bangle',
        imageFile: null,      // For file uploads
        imageUrl: '',         // For URL inputs
        imagePreviewUrl: null // For displaying the preview
    };

    const fetchProducts = async () => { /* ...Same as before... */ };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        return () => {
            productsToAdd.forEach(p => {
                if (p.imagePreviewUrl && p.imageFile) URL.revokeObjectURL(p.imagePreviewUrl);
            });
        };
    }, [productsToAdd]);

    // Yeh function file select karne par form generate karega
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newProducts = Array.from(files).map(file => ({
                ...initialProductState,
                imageFile: file,
                imagePreviewUrl: URL.createObjectURL(file)
            }));
            // File select karne se purane manual entries clear ho jayengi
            setProductsToAdd(newProducts);
        }
    };
    
    // Naya function: Ek khaali form add karega URL ke liye
    const handleAddManually = () => {
        setProductsToAdd([...productsToAdd, { ...initialProductState }]);
    };

    // Text inputs (name, price, category) ko handle karega
    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...productsToAdd];
        updatedProducts[index][name] = value;
        setProductsToAdd(updatedProducts);
    };

    // URL input ko handle karega
    const handleUrlChange = (index, e) => {
        const { value } = e.target;
        const updatedProducts = [...productsToAdd];
        updatedProducts[index].imageUrl = value;
        updatedProducts[index].imagePreviewUrl = value; // URL ko hi preview ke liye istemal karein
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

    // Submit function ab file aur URL dono ko handle karega
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

            // Check karein ke image file hai ya URL
            if (product.imageFile) {
                data.append('image', product.imageFile);
            } else if (product.imageUrl) {
                data.append('image', product.imageUrl); // Aapka backend URL ko support karta hai
            } else {
                setError(`Please provide an image or URL for product: "${product.name || 'Untitled'}"`);
                allSuccess = false;
                break;
            }

            // ... (baaqi submit logic waisi hi rahegi)
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
            fetchProducts();
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Product Management Dashboard</h1>
            <div className="add-product-form">
                <h2>Add New Product(s)</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Dono Options Yahan Hain */}
                    <div className="add-options">
                        <div className="form-group">
                            <label htmlFor="image-upload">Option 1: Select Multiple Images From Computer</label>
                            <input
                                type="file"
                                id="image-upload"
                                onChange={handleFileChange}
                                accept="image/*"
                                multiple
                            />
                        </div>
                        <div className="form-group">
                             <label>Option 2: Add Products One-by-One with URL</label>
                             <button type="button" onClick={handleAddManually} className="add-manual-btn">
                                Add a Product Manually
                             </button>
                        </div>
                    </div>
                    <hr/>

                    {/* Dynamic Form Fields */}
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
                                    {/* Image input: File ka naam ya URL input field */}
                                    {product.imageFile ? (
                                        <p className="form-hint">File: <strong>{product.imageFile.name}</strong></p>
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
                                        <input type="number" name="price" value={product.price} onChange={(e) => handleProductChange(index, e)} required min="0" step="0.01" />
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
                            <button type="button" className="remove-btn" onClick={() => handleRemoveProduct(index)}>Remove This Product</button>
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
            {/* ... Product List Display ... */}
        </div>
    );
};

export default Dashboard;