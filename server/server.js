// server.js
console.log("MONGODB_URI:", process.env.MONGODB_URI);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// ======================
// MongoDB Connection
// ======================
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; // Already connected
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30s timeout
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};

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
      color: { type: String },
      category: { type: String },
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

// Create New Order
app.post("/api/orders", async (req, res) => {
  try {
    await connectDB();

    const { userName, email, primaryNumber, altNumber, address, location, products, totalPrice, paymentMethod } = req.body;

    if (!userName || !primaryNumber || !address || !location || !products || !totalPrice || !paymentMethod) {
      return res.status(400).json({ success: false, message: "⚠️ Please provide all required fields." });
    }

    const newOrder = new Order({ userName, email, primaryNumber, altNumber, address, location, products, totalPrice, paymentMethod, status: "pending" });
    await newOrder.save();

    res.status(201).json({ success: true, message: "✅ Order saved successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ success: false, message: "❌ Failed to save order", error: error.message });
  }
});

// Get All Orders
app.get("/api/orders", async (req, res) => {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to fetch orders", error: error.message });
  }
});

// Update Order Status
app.put("/api/orders/:id/status", async (req, res) => {
  try {
    await connectDB();

    const { status } = req.body;
    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "⚠️ Invalid status value." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "⚠️ Order not found." });
    }

    res.json({ success: true, message: "✅ Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to update order", error: error.message });
  }
});

// Delete Order
app.delete("/api/orders/:id", async (req, res) => {
  try {
    await connectDB();

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
// Dashboard Metrics API (Newly Added)
// ======================
app.get("/api/dashboard-metrics", async (req, res) => {
  try {
    await connectDB();

    // Get Total Orders
    const totalOrders = await Order.countDocuments();

    // Get Total Revenue
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get New Customers (example: unique primaryNumber in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomersResult = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$primaryNumber" } },
      { $count: "count" }
    ]);
    const newCustomers = newCustomersResult.length > 0 ? newCustomersResult[0].count : 0;

    // Monthly Sales Data
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          sales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          name: "$_id",
          sales: "$sales"
        }
      }
    ]);

    // Top Products Data
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.name",
          value: { $sum: "$products.quantity" }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", value: "$value" } }
    ]);

    // Daily Revenue Data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          name: "$_id",
          revenue: "$revenue"
        }
      }
    ]);

    const dashboardMetrics = {
      totalOrders,
      revenue,
      newCustomers,
      monthlySales,
      topProducts,
      dailyRevenue
    };

    res.json(dashboardMetrics);
  } catch (error) {
    console.error("❌ Error fetching dashboard metrics:", error);
    res.status(500).json({ message: "❌ Failed to fetch dashboard metrics", error: error.message });
  }
});


// ======================
// Start Server
// ======================
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));