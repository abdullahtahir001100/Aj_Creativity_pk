const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Import routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

// Initialize express app
const app = express();

// CORS configuration to allow requests from your frontend domain
const corsOptions = {
  origin: 'https://aj-creativity.vercel.app',
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage setup for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // Cloudinary par folder ka naam
    format: async (req, file) => 'jpg',
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Yahan Zaroori Badlav Kiya Gaya Hai ---
// 'upload' middleware ko '/api/products' route par lagaya gaya hai.
// Ab sabhi /api/products routes par files upload ho payengi.
app.use('/api/products', upload.single('image'), productRoutes);
// 'authRoutes' router ke liye ek alag route define kiya gaya hai
app.use('/api/auth', authRoutes);
// --- Badlav Yahan Khatam Hota Hai ---

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});