const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

// Your MongoDB Atlas Connection URI
const MONGODB_URI = 'mongodb+srv://at4105168:2FWz679VE0UmJpL4@cluster0.czsqioy.mongodb.net/aj_new_project?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the Video Schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }
});

const Video = mongoose.model('Video', videoSchema);

// Define a Mongoose Schema for a Product (from your previous code)
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

// Use middleware
app.use(cors());
app.use(bodyParser.json());

// API Endpoints for Videos
// READ all videos (GET)
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching videos', error: err.message });
  }
});

// CREATE a new video (POST)
app.post('/api/videos', async (req, res) => {
  try {
    const newVideo = new Video(req.body);
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    res.status(400).json({ message: 'Error adding video', error: err.message });
  }
});

// DELETE a video (DELETE)
app.delete('/api/videos/:id', async (req, res) => {
  try {
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);
    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting video', error: err.message });
  }
});

// API Endpoints for Products (from your previous code)
app.get('/api/data', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error adding product', error: err.message });
  }
});

app.put('/api/data/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err.message });
  }
});

app.delete('/api/data/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});