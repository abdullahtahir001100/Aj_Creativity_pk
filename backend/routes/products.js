const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

module.exports = (upload) => {
    // Add a new product with image upload
    router.post('/add', upload.single('image'), async (req, res) => {
        try {
            const { name, description, price } = req.body;
            const imageUrl = req.file ? req.file.path : null;

            if (!name || !description || !price || !imageUrl) {
                if (req.file) {
                    await cloudinary.uploader.destroy(req.file.filename);
                }
                return res.status(400).json({ message: 'All fields and an image are required.' });
            }

            const newProduct = new Product({
                name,
                description,
                price,
                image: imageUrl
            });

            await newProduct.save();

            res.status(201).json({
                success: true,
                message: 'Product added successfully',
                data: newProduct,
            });
        } catch (error) {
            console.error(error);
            if (req.file) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
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

            if (product.image) {
                // Extract public ID from the image URL to delete from Cloudinary
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

    return router;
};