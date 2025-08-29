// api/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./product-dashboard.js";

const app = express();

app.use(express.json());
app.use(cors());

// ======================
// MongoDB Connection
// ======================
const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        console.log("✅ MongoDB already connected.");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
        });
        console.log("✅ MongoDB connected successfully.");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
};

// Middleware to connect to DB on each request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: "❌ Database connection failed." });
    }
});

// ======================
// Order Schema & Model (For Vercel)
// ======================
let Order;
try {
    Order = mongoose.model("Order");
} catch (error) {
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
    Order = mongoose.model("Order", orderSchema);
}

// ======================
// Routes
// ======================
app.use("/api/products", productRoutes);

// Create New Order
app.post("/api/orders", async (req, res) => {
    try {
        const { userName, email, primaryNumber, altNumber, address, location, products, totalPrice, paymentMethod } = req.body;
        if (!userName || !primaryNumber || !address || !location || !products || !totalPrice || !paymentMethod) {
            return res.status(400).json({ success: false, message: "⚠️ Please provide all required fields." });
        }
        const newOrder = new Order({ userName, email, primaryNumber, altNumber, address, location, products, totalPrice, paymentMethod });
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
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to fetch orders", error: error.message });
    }
});

// Update Order Status
app.put("/api/orders/:id/status", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!updatedOrder) return res.status(404).json({ success: false, message: "⚠️ Order not found." });
        res.json({ success: true, message: "✅ Order status updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to update order", error: error.message });
    }
});

// Delete Order
app.delete("/api/orders/:id", async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ success: false, message: "⚠️ Order not found." });
        res.json({ success: true, message: "✅ Order deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting order:", error);
        res.status(500).json({ success: false, message: "❌ Failed to delete order", error: error.message });
    }
});

app.get("/api/dashboard-metrics", async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const [currentPeriodData, previousPeriodData] = await Promise.all([
            Order.aggregate([{ $match: { createdAt: { $gte: thirtyDaysAgo } } }, { $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: "$totalPrice" }, uniqueCustomers: { $addToSet: "$primaryNumber" } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } }, { $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: "$totalPrice" }, uniqueCustomers: { $addToSet: "$primaryNumber" } } }])
        ]);
        const current = currentPeriodData[0] || { totalOrders: 0, totalRevenue: 0, uniqueCustomers: [] };
        const previous = previousPeriodData[0] || { totalOrders: 0, totalRevenue: 0, uniqueCustomers: [] };
        const calculateTrend = (currentValue, previousValue) => (previousValue === 0) ? (currentValue > 0 ? 100 : 0) : ((currentValue - previousValue) / previousValue) * 100;
        const orderTrend = calculateTrend(current.totalOrders, previous.totalOrders);
        const revenueTrend = calculateTrend(current.totalRevenue, previous.totalRevenue);
        const newCustomersTrend = calculateTrend(current.uniqueCustomers.length, previous.uniqueCustomers.length);
        const monthlySales = await Order.aggregate([{ $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, sales: { $sum: "$totalPrice" } } }, { $sort: { _id: 1 } }, { $project: { _id: 0, name: "$_id", sales: "$sales" } }]);
        const topProducts = await Order.aggregate([{ $unwind: "$products" }, { $group: { _id: "$products.name", value: { $sum: "$products.quantity" } } }, { $sort: { value: -1 } }, { $limit: 5 }, { $project: { _id: 0, name: "$_id", value: "$value" } }]);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dailyRevenue = await Order.aggregate([{ $match: { createdAt: { $gte: sevenDaysAgo } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$totalPrice" } } }, { $sort: { _id: 1 } }, { $project: { _id: 0, name: "$_id", revenue: "$revenue" } }]);
        const dashboardMetrics = {
            totalOrders: current.totalOrders, revenue: current.totalRevenue, newCustomers: current.uniqueCustomers.length,
            orderTrend: orderTrend.toFixed(2), revenueTrend: revenueTrend.toFixed(2), newCustomersTrend: newCustomersTrend.toFixed(2),
            monthlySales, topProducts, dailyRevenue
        };
        res.json(dashboardMetrics);
    } catch (error) {
        console.error("❌ Error fetching dashboard metrics:", error);
        res.status(500).json({ message: "❌ Failed to fetch dashboard metrics", error: error.message });
    }
});

// Export the app
export default app;