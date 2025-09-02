require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_images',
    allowed_formats: ['jpeg', 'png', 'jpg'],
  },
});

const upload = multer({ storage: storage });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Blog Schema and Model
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String, required: true },
  description: { type: String, required: true },
  extraContent: { type: String, required: true }
});

const Blog = mongoose.model('Blog', blogSchema);

// --- API ROUTES ---

// GET all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs.", error: err.message });
  }
});

// POST a new blog
app.post('/api/blogs', upload.single('image'), async (req, res) => {
  let imagePath = '';

  if (req.file) {
    imagePath = req.file.path;
  } else if (req.body.imageUrl) {
    imagePath = req.body.imageUrl;
  }

  if (!imagePath) {
    return res.status(400).json({ message: 'No image file or image URL provided.' });
  }

  const newBlog = new Blog({
    title: req.body.title,
    description: req.body.description,
    extraContent: req.body.extraContent,
    image: imagePath
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(400).json({ message: "Failed to save blog post.", error: err.message });
  }
});

// ✅ PUT (Update) a blog by ID
app.put('/api/blogs/:id', upload.single('image'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    // Update text fields from request body
    blog.title = req.body.title || blog.title;
    blog.description = req.body.description || blog.description;
    blog.extraContent = req.body.extraContent || blog.extraContent;

    // Check if a new image is uploaded
    if (req.file) {
      // If there was an old image on Cloudinary, delete it
      if (blog.image && blog.image.includes('cloudinary')) {
        const publicIdWithFolder = blog.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicIdWithFolder);
      }
      // Set the new image path
      blog.image = req.file.path;
    } else if (req.body.imageUrl) {
      // If a new URL is provided, update the image path
      blog.image = req.body.imageUrl;
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
    
  } catch (err) {
    res.status(500).json({ message: 'Server error while updating blog.', error: err.message });
  }
});

// DELETE a blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    // Delete image from Cloudinary
    if (blog.image.includes('cloudinary')) {
      const publicIdWithFolder = blog.image.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicIdWithFolder);
    }
    
    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting.', error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});