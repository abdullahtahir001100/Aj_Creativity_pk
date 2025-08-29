// backend/product-dashboard.js

import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ======================
// Product Schema & Model
// ======================
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  stock: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

// ======================
// Product Management API Endpoints
// ======================

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, message: "❌ Failed to fetch products" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    const { name, category, price, image, stock } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: "⚠️ Name, category, and price are required." });
    }
    const newProduct = new Product({ name, category, price, image, stock });
    await newProduct.save();
    res.status(201).json({ success: true, message: "✅ Product added successfully", product: newProduct });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: "❌ Failed to add product" });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "⚠️ Product not found." });
    }
    res.json({ success: true, message: "✅ Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ success: false, message: "❌ Failed to update product" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "⚠️ Product not found." });
    }
    res.json({ success: true, message: "✅ Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ success: false, message: "❌ Failed to delete product" });
  }
});

export default router;