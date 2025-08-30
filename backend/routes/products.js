const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

// Add a new product
router.post('/add', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    // Image URL Cloudinary se aa raha hai
    const imageUrl = req.file.path; 

    const newProduct = new Product({
      name,
      price,
      category,
      image: imageUrl,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: newProduct,
    });
  } catch (error) {
      res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Cloudinary se image delete karein
    if (product.image) {
      const publicId = product.image.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;