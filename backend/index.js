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


// ==================== START: CORRECT CORS CONFIGURATION ====================

// List of domains that are allowed to make requests to your API
const allowedOrigins = [
  'https://www.javehandmade.store', // Your live frontend domain
  'http://localhost:5173'           // Your local development domain
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests if the origin is in our allowed list, or if there is no origin (e.g. server-to-server)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('This request was blocked by the CORS policy.'));
    }
  }
};

// Use the cors middleware with your new, specific options.
// This MUST come before your routes.
app.use(cors(corsOptions));

// ===================== END: CORRECT CORS CONFIGURATION =====================


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
    folder: 'products',
    format: async (req, file) => 'jpg',
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Correctly mount the routes by passing the 'upload' middleware
app.use('/api/products', productRoutes(upload));
app.use('/api/auth', authRoutes);

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