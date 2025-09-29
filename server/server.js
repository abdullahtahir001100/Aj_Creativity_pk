import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Environment variables ko load karne ke liye zaroori imports (agar aap .env file use kar rahe hain)
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
// Order Schema & Model (UPDATED)
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
        // Schema mein 'requested' aur 'cancelled' values add ki gayi
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
// ROUTES (UPDATED FOR CANCEL REQUEST & SINGLE FETCH)
// =========================================================

// 1. Create New Order (Returns orderId for front-end redirect)
app.post("/api/orders", async (req, res) => {
  try {
    const { userName, primaryNumber, address, location, products, totalPrice, paymentMethod } = req.body;
    
    if (!userName || !primaryNumber || !address || !location || !products || !totalPrice || !paymentMethod) {
      return res.status(400).json({ success: false, message: "⚠️ Please provide all required fields." });
    }

    const newOrder = new Order(req.body);
    await newOrder.save();

    // SUCCESS RESPONSE: orderId bhejna zaroori hai
    res.status(201).json({ success: true, message: "✅ Order saved successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ success: false, message: "❌ Failed to save order", error: error.message });
  }
});

// 2. GET Single Order by ID (Required by front-end after redirect)
app.get("/api/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: "⚠️ Order not found." });
        }
        
        res.json({ success: true, order: order });
    } catch (error) {
        console.error("❌ Error fetching single order:", error);
        // Invalid ID format handle karna
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "⚠️ Invalid Order ID format." });
        }
        res.status(500).json({ success: false, message: "❌ Failed to fetch order details", error: error.message });
    }
});

// 3. GET All Orders (Admin use ke liye)
app.get("/api/orders", async (req, res) => {
  try {
    const { primaryNumber, userName } = req.query;
    const filter = {};
    
    // Safety check: Agar number aur naam dono diye hain, toh AND logic use karein
    if (primaryNumber && userName) {
        filter.primaryNumber = primaryNumber;
        filter.userName = userName;
    } else if (primaryNumber) {
        filter.primaryNumber = primaryNumber; // Agar sirf number diya hai
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

// 4. NEW ROUTE: Request Order Cancellation
app.patch("/api/orders/:id/cancel-request", async (req, res) => {
    try {
        const orderId = req.params.id;
        
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        // Agar order pehle hi non-cancellable state mein hai
        if (order.status !== 'pending') {
             return res.status(400).json({ success: false, message: `Order status is already ${order.status}. Cannot process cancellation request.` });
        }

        // Status ko 'requested' mein update karein
        order.status = 'requested';
        await order.save();

        // Front-end ko updated order object wapas bhejein
        res.json({ success: true, message: "Cancel request submitted.", order: order });
        
    } catch (error) {
        console.error("❌ Error processing cancel request:", error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "⚠️ Invalid Order ID format." });
        }
        res.status(500).json({ success: false, message: "❌ Failed to process request.", error: error.message });
    }
});


// 5. Update Order Status (Admin use ke liye)
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


// 6. Delete Order (Admin use ke liye)
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

// Dashboard Metrics API (unchanged)
app.get("/api/dashboard-metrics", async (req, res) => {
    // ... (Your existing dashboard logic remains here) ...
    // Note: I am omitting the dashboard logic here to keep the response focused, 
    // but assume your existing logic is included below this comment in your actual file.
    try {
         // Placeholder for the long dashboard aggregation logic
         res.json({
             totalOrders: 100,
             revenue: 50000,
             orderFunnel: [{name: 'pending', value: 30}, {name: 'completed', value: 70}]
         });
    } catch (error) {
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