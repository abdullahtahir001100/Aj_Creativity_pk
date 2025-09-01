const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- Database Connection ---
// A flag to check if the database is already connected to prevent
// reconnecting on hot-reloads in development and on serverless functions.
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection.');
        return;
    }

    try {
        // Use the MONGODB_URI from Vercel's environment variables.
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('Successfully connected to MongoDB!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        isConnected = false;
        // Optionally, rethrow the error to halt the application startup if connection fails.
        throw new Error('Failed to connect to MongoDB');
    }
};

// --- Mongoose Schemas and Models ---
// For a larger application, these schemas would ideally be in their own separate files.

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }
});
const Video = mongoose.model('Video', videoSchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: [String], required: true },
    placement: {
        type: String,
        enum: ['featured', 'latest', 'related', 'none'],
        default: 'latest'
    },
    createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// --- API Endpoints ---
// Each endpoint will attempt to connect to the database before processing the request.

// Video Endpoints
app.get('/api/videos', async (req, res) => {
    try {
        await connectDB();
        const videos = await Video.find();
        res.status(200).json({ success: true, data: videos });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching videos', error: err.message });
    }
});

app.post('/api/videos', async (req, res) => {
    try {
        await connectDB();
        const newVideo = new Video(req.body);
        const savedVideo = await newVideo.save();
        res.status(201).json({ success: true, data: savedVideo });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error adding video', error: err.message });
    }
});

app.delete('/api/videos/:id', async (req, res) => {
    try {
        await connectDB();
        const deletedVideo = await Video.findByIdAndDelete(req.params.id);
        if (!deletedVideo) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }
        res.status(200).json({ success: true, message: 'Video deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting video', error: err.message });
    }
});

// Product Endpoints
app.get('/api/data', async (req, res) => {
    try {
        await connectDB();
        // Sorting by createdAt in descending order to get the latest products first
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching products', error: err.message });
    }
});

app.post('/api/data', async (req, res) => {
    try {
        await connectDB();
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, data: savedProduct });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error adding product', error: err.message });
    }
});

app.put('/api/data/:id', async (req, res) => {
    try {
        await connectDB();
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error updating product', error: err.message });
    }
});

app.delete('/api/data/:id', async (req, res) => {
    try {
        await connectDB();
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting product', error: err.message });
    }
});

// Vercel requires the app to be exported for the serverless function to work.
module.exports = app;
