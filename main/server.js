const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Cloudinary SDK ko shamil karen
const cloudinary = require('cloudinary').v2;

const app = express();

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- Cloudinary Configuration ---
// Make sure to add these to your Vercel environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- Database Connection ---
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    isConnected = false;
    throw new Error('Failed to connect to MongoDB');
  }
};

connectDB();

// --- Mongoose Schemas and Models ---
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

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running. Please use the /api/ endpoint to access data.' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Video Endpoints (unchanged)
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching videos', error: err.message });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    const newVideo = new Video(req.body);
    const savedVideo = await newVideo.save();
    res.status(201).json({ success: true, data: savedVideo });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error adding video', error: err.message });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
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
    const products = await Product.find().sort({ createdAt: -1 });

    // Optimizing image URLs before sending to the frontend
    const optimizedProducts = products.map(product => {
      const optimizedImages = product.image.map(url => {
        // URL ko optimize karne ke liye 'upload/' ke baad 'f_auto,q_auto/' shamil karen
        return url.replace('/upload/', '/upload/f_auto,q_auto/');
      });
      return { ...product.toObject(), image: optimizedImages };
    });

    res.status(200).json({ success: true, data: optimizedProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: err.message });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error adding product', error: err.message });
  }
});

app.put('/api/data/:id', async (req, res) => {
  try {
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
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting product', error: err.message });
  }
});

module.exports = app;
