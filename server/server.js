// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// ======================
// MongoDB Connection
// ======================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ======================
// Order Schema & Model
// ======================
const orderSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String },
  primaryNumber: { type: String, required: true },
  altNumber: { type: String },
  address: { type: String, required: true },
  location: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },

  products: [
    {
      name: { type: String, required: true },
      size: { type: String },
      color: { type: String },      // Added for frontend
      category: { type: String },   // Added for frontend
      quantity: { type: Number, required: true },
      image: { type: String },
      price: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

// ======================
// Routes
// ======================

// 📌 Create New Order
app.post("/api/orders", async (req, res) => {
  try {
    const { userName, email, primaryNumber, altNumber, address, location, products, totalPrice, paymentMethod } = req.body;

    if (!userName || !primaryNumber || !address || !location || !products || !totalPrice || !paymentMethod) {
      return res.status(400).json({ success: false, message: "⚠️ Please provide all required fields." });
    }

    const newOrder = new Order({
      userName,
      email,
      primaryNumber,
      altNumber,
      address,
      location,
      products,
      totalPrice,
      paymentMethod,
      status: "pending",
    });

    await newOrder.save();

    res.status(201).json({ success: true, message: "✅ Order saved successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ success: false, message: "❌ Failed to save order", error: error.message });
  }
});

// 📌 Get All Orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to fetch orders", error: error.message });
  }
});

// 📌 Update Order Status
app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "⚠️ Invalid status value." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "⚠️ Order not found." });
    }

    res.json({ success: true, message: "✅ Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to update order", error: error.message });
  }
});

// 📌 Delete Order
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "⚠️ Order not found." });
    }

    res.json({ success: true, message: "✅ Order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ success: false, message: "❌ Failed to delete order", error: error.message });
  }
});

// ======================
// Server Start
// ======================
module.exports = app;
