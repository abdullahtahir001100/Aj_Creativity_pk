const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

module.exports = (upload) => {

  // POST: Add a new product (handles file upload OR URL)
  router.post('/add', upload.single('image'), async (req, res) => {
    try {
      const { name, category, price } = req.body;
      let imageUrl = null;
      let imageId = null;

      // Check if a file was uploaded via multer
      if (req.file) {
        imageUrl = req.file.path;
        imageId = req.file.filename;
      } 
      // Else, check if an image URL was passed in the body
      else if (req.body.image) {
        imageUrl = req.body.image;
      }

      if (!name || !category || !price || !imageUrl) {
        // If validation fails and an image was uploaded, delete it from Cloudinary
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(400).json({ success: false, message: 'All fields and an image are required.' });
      }

      const newProduct = new Product({
        name,
        category,
        price,
        image: imageUrl,
        imageId: imageId, // Save the Cloudinary public_id
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: newProduct,
      });

    } catch (error) {
      console.error('Error adding product:', error);
      // Clean up uploaded file if an error occurs
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
  
  // GET: all products
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
  
  // PUT: Update an existing product
  router.put('/edit/:id', upload.single('image'), async (req, res) => {
      try {
          const product = await Product.findById(req.params.id);
          if (!product) {
              return res.status(404).json({ success: false, message: 'Product not found' });
          }

          let imageUrl = product.image;
          let imageId = product.imageId;

          // If a new image is uploaded, delete the old one
          if (req.file) {
              if (product.imageId) {
                  await cloudinary.uploader.destroy(product.imageId);
              }
              imageUrl = req.file.path;
              imageId = req.file.filename;
          } else if (req.body.image && req.body.image !== product.image) {
              if (product.imageId) {
                  await cloudinary.uploader.destroy(product.imageId);
                  imageId = null; // It's a new URL, not a Cloudinary upload
              }
              imageUrl = req.body.image;
          }

          // Update product fields
          product.name = req.body.name || product.name;
          product.price = req.body.price || product.price;
          product.category = req.body.category || product.category;
          product.image = imageUrl;
          product.imageId = imageId;

          const updatedProduct = await product.save();
          res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });

      } catch (error) {
          console.error('Error updating product:', error);
          res.status(500).json({ success: false, message: 'Server Error', error: error.message });
      }
  });


  // DELETE: a product
  router.delete('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // If the product has an imageId (meaning it's on Cloudinary), delete it
      if (product.imageId) {
        await cloudinary.uploader.destroy(product.imageId);
      }
      
      await Product.findByIdAndDelete(req.params.id);

      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });

  return router;
};
