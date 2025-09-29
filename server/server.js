import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Load environment variables (assuming you have a .env file for MONGODB_URI)
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "YOUR_MONGODB_CONNECTION_STRING"; // Replace with your actual URI

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

// =========================================================
// ROUTES (UPDATED FOR ORDER PAGE FUNCTIONALITY & SECURITY)
// =========================================================

// 1. Create New Order (Returns orderId for redirect)
app.post("/api/orders", async (req, res) => {
  try {
    const { userName, primaryNumber, address, location, products, totalPrice, paymentMethod } = req.body;
    // Basic validation on required fields
    if (!userName || !primaryNumber || !address || !location || !products || !totalPrice || !paymentMethod) {
      return res.status(400).json({ success: false, message: "⚠️ Please provide all required fields." });
    }

    const newOrder = new Order(req.body);
    await newOrder.save();

    // SUCCESS RESPONSE: orderId bhejna zaroori hai front-end redirect ke liye
    res.status(201).json({ success: true, message: "✅ Order saved successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ success: false, message: "❌ Failed to save order", error: error.message });
  }
});

// --- NEW ROUTE: GET Single Order by ID (For redirect after checkout) ---
app.get("/api/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: "⚠️ Order not found." });
        }
        
        // Order details bhejna
        res.json({ success: true, order });
    } catch (error) {
        console.error("❌ Error fetching single order:", error);
        // Invalid ID format (e.g., non-existent mongoose ID) handle karna
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "⚠️ Invalid Order ID format." });
        }
        res.status(500).json({ success: false, message: "❌ Failed to fetch order details", error: error.message });
    }
});


// 2. Get All Orders OR Filter Orders (UPDATED for security/search)
app.get("/api/orders", async (req, res) => {
  try {
    const { primaryNumber, userName } = req.query;
    const filter = {};
    
    // --- SECURITY/SEARCH LOGIC (AND Operator) ---
    if (primaryNumber && userName) {
        // Agar dono query parameters diye gaye hain, toh AND condition lagao
        // (Jo aapki security ke liye zaroori hai)
        filter.primaryNumber = primaryNumber;
        filter.userName = userName;

        console.log(`🔒 Searching orders with AND logic: ${primaryNumber} AND ${userName}`);
    } else if (primaryNumber) {
        // Agar sirf number diya hai
        filter.primaryNumber = primaryNumber;
    } else if (userName) {
        // Agar sirf naam diya hai
        filter.userName = userName;
    }
    // --- End of Filter Logic ---
    
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    
    if (orders.length === 0 && (primaryNumber || userName)) {
         return res.status(404).json({ success: false, message: "⚠️ No orders found matching the criteria." });
    }
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to fetch orders", error: error.message });
  }
});

// 3. Update Order Status (unchanged)
app.patch("/api/orders/:id/complete", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: "completed" }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "⚠️ Order not found." });
    }

    res.json({ success: true, message: "✅ Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to update order", error: error.message });
  }
});


// 4. Delete Order (unchanged)
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

// 5. Dashboard Metrics API (unchanged)
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

    const monthlySales = await Order.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, sales: { $sum: "$totalPrice" } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: "$_id", sales: "$sales" } }
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products.name", value: { $sum: "$products.quantity" } } },
      { $sort: { value: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", value: "$value" } }
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$totalPrice" } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: "$_id", revenue: "$revenue" } }
    ]);
  
    const orderFunnel = await Order.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: "$_id", value: "$value" } }
    ]);
  
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