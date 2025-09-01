const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---

// Configure CORS to allow requests from both localhost and your Vercel frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://server-nine-kappa-75.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.json());

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

// Health check and root route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Video Endpoints
app.get('/videos', async (req, res) => {
  await connectDB();
  try {
    const videos = await Video.find();
    res.status(200).json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching videos', error: err.message });
  }
});

app.post('/videos', async (req, res) => {
  await connectDB();
  try {
    const newVideo = new Video(req.body);
    const savedVideo = await newVideo.save();
    res.status(201).json({ success: true, data: savedVideo });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error adding video', error: err.message });
  }
});

app.delete('/videos/:id', async (req, res) => {
  await connectDB();
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
app.get('/data', async (req, res) => {
  await connectDB();
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: err.message });
  }
});

app.post('/data', async (req, res) => {
  await connectDB();
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error adding product', error: err.message });
  }
});

app.put('/data/:id', async (req, res) => {
  await connectDB();
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

app.delete('/data/:id', async (req, res) => {
  await connectDB();
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

// Fallback for all other routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});