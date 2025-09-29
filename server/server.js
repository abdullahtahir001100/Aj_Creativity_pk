import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Environment variables load karne ke liye zaroori (agar aap .env file use kar rahe hain)
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Kripya 'YOUR_MONGODB_CONNECTION_STRING' ko apne asli URI se badal dein
const MONGODB_URI = process.env.MONGODB_URI || "YOUR_MONGODB_CONNECTION_STRING"; 

// ======================
// Middlewares
// ======================
app.use(express.json());
app.use(cors());

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
  status: { 
        type: String, 
        enum: ["pending", "completed", "requested", "cancelled"], 
        default: "pending" 
    },
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

// =========================================================
// ROUTES (Dashboard Logic Included)
// =========================================================

// 1. POST /api/orders: Create New Order
app.post("/api/orders", async (req, res) => {
  try {
    const { userName, primaryNumber, address, location, products, totalPrice, paymentMethod } = req.body;
    
    if (!userName || !primaryNumber || !address || !location || !products || !totalPrice || !paymentMethod) {
      return res.status(400).json({ success: false, message: "⚠️ Please provide all required fields." });
    }

    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ success: true, message: "✅ Order saved successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ success: false, message: "❌ Failed to save order", error: error.message });
  }
});

// 2. GET /api/orders/:id: Get Single Order by ID
app.get("/api/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: "⚠️ Order not found." });
        }
        
        res.json({ success: true, order: order });
    } catch (error) {
        console.error("❌ Error fetching single order:", error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "⚠️ Invalid Order ID format." });
        }
        res.status(500).json({ success: false, message: "❌ Failed to fetch order details", error: error.message });
    }
});

// 3. GET /api/orders: Get All Orders (Dashboard/Admin use)
app.get("/api/orders", async (req, res) => {
  try {
    const { primaryNumber, userName } = req.query;
    const filter = {};
    
    if (primaryNumber && userName) {
        filter.primaryNumber = primaryNumber;
        filter.userName = userName;
    } else if (primaryNumber) {
        filter.primaryNumber = primaryNumber;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    
    if (orders.length === 0 && (primaryNumber || userName)) {
         return res.status(404).json({ success: false, message: "⚠️ No orders found matching the criteria." });
    }
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to fetch orders", error: error.message });
  }
});

// 4. PATCH /api/orders/:id/cancel-request
app.patch("/api/orders/:id/cancel-request", async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        if (order.status !== 'pending') {
             return res.status(400).json({ success: false, message: `Order status is already ${order.status}. Cannot submit new cancellation request.` });
        }

        order.status = 'requested';
        await order.save();

        res.json({ success: true, message: "Cancel request submitted.", order: order });
        
    } catch (error) {
        console.error("❌ Error processing cancel request:", error);
        res.status(500).json({ success: false, message: "❌ Failed to process request.", error: error.message });
    }
});

// 5. PATCH /api/orders/:id/complete: Admin completes the order
app.patch("/api/orders/:id/complete", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id, 
        { status: "completed" }, 
        { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "⚠️ Order not found." });
    }

    res.json({ success: true, message: "✅ Order status updated to COMPLETED", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to update order", error: error.message });
  }
});

// 6. PATCH /api/orders/:id/cancel: Admin approves/forces CANCELLED status
app.patch("/api/orders/:id/cancel", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: "cancelled" }, 
            { new: true, runValidators: true }
        );
        if (!updatedOrder) return res.status(404).json({ success: false, message: "⚠️ Order not found." });
        res.json({ success: true, message: "✅ Order marked as CANCELLED", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to cancel order", error: error.message });
    }
});

// 7. PATCH /api/orders/:id/revert-to-pending: Admin rejects cancellation request
app.patch("/api/orders/:id/revert-to-pending", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: "pending" }, 
            { new: true, runValidators: true }
        );
        if (!updatedOrder) return res.status(404).json({ success: false, message: "⚠️ Order not found." });
        res.json({ success: true, message: "✅ Cancel request rejected and status set to pending", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to reject request", error: error.message });
    }
});

// 8. DELETE /api/orders/:id: Admin deletes order
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


// 9. GET /api/dashboard-metrics: Dashboard Metrics API (COMPLETE LOGIC)
// ----------------------------------------------------------------------
app.get("/api/dashboard-metrics", async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [currentPeriodData, previousPeriodData] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalPrice" },
            uniqueCustomers: { $addToSet: "$primaryNumber" }
          }
        }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalPrice" },
            uniqueCustomers: { $addToSet: "$primaryNumber" }
          }
        }
      ])
    ]);

    const current = currentPeriodData[0] || { totalOrders: 0, totalRevenue: 0, uniqueCustomers: [] };
    const previous = previousPeriodData[0] || { totalOrders: 0, totalRevenue: 0, uniqueCustomers: [] };

    const calculateTrend = (currentValue, previousValue) => {
      if (previousValue === 0) return currentValue > 0 ? 100 : 0;
      return ((currentValue - previousValue) / previousValue) * 100;
    };

    const orderTrend = calculateTrend(current.totalOrders, previous.totalOrders);
    const revenueTrend = calculateTrend(current.totalRevenue, previous.totalRevenue);
    const newCustomersTrend = calculateTrend(current.uniqueCustomers.length, previous.uniqueCustomers.length);

    // --- CHART DATA AGGREGATION ---

    // Monthly Sales: Grouped by year-month
    const monthlySales = await Order.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, sales: { $sum: "$totalPrice" } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: "$_id", sales: "$sales" } }
    ]);

    // Top Products: Needs $unwind for product list
    const topProducts = await Order.aggregate([
      { $unwind: "$products" }, 
      { $group: { _id: "$products.name", value: { $sum: "$products.quantity" } } },
      { $sort: { value: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", value: "$value" } }
    ]);

    // Daily Revenue: Last 7 days match karna
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$totalPrice" } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: "$_id", revenue: "$revenue" } }
    ]);
  
    // Order Funnel (Pie Chart data): Status ke hisaab se group karna
    const orderFunnel = await Order.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $sort: { value: -1 } }, 
      { $project: { _id: 0, name: "$_id", value: "$value" } }
    ]);
  
    // Top Locations
    const topLocations = await Order.aggregate([
      { $group: { _id: "$location", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", value: "$value" } }
    ]);

    const dashboardMetrics = {
      totalOrders: current.totalOrders,
      revenue: current.totalRevenue,
      newCustomers: current.uniqueCustomers.length,
      orderTrend: orderTrend.toFixed(2),
      revenueTrend: revenueTrend.toFixed(2),
      newCustomersTrend: newCustomersTrend.toFixed(2),
      monthlySales,
      topProducts, 
      dailyRevenue,
      orderFunnel, 
      topLocations,
    };

    res.json(dashboardMetrics);
  } catch (error) {
    console.error("❌ Error fetching dashboard metrics:", error);
    res.status(500).json({ message: "❌ Failed to fetch dashboard metrics", error: error.message });
  }
});

// ----------------------------------------------------------------------
// ======================
// Start Server & Connect to DB
// ======================
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

startServer();