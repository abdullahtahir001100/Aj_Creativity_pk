const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Sahi model file ko import karein

// Yeh function upload middleware ko receive karega
const routes = (upload) => {
    // GET: Fetch all products
    router.get('/', async (req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching products', error: error.message });
        }
    });

    // POST: Add a new product
    // 'upload.single('image')' middleware file upload ko handle karega
    router.post('/add', upload.single('image'), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required.' });
        }

        const { name, price, category } = req.body;
        const image = req.file.path; // Cloudinary se milne wala URL

        const newProduct = new Product({
            name,
            price,
            category,
            image
        });

        try {
            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            res.status(400).json({ message: 'Error adding product', error: error.message });
        }
    });
    
    // Aap yahan PUT aur DELETE routes bhi add kar sakte hain
    
    return router;
};

module.exports = routes;