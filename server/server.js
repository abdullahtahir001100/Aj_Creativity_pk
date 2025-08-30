import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// MongoDB Connection
// ======================
async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error("❌ MongoDB URI not found in .env file");
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB: 🟢 Connected");
  } catch (err) {
    console.error("MongoDB Connection Error ❌:", err.message);
    process.exit(1);
  }
}
connectDB();

// ======================
// Order Schema
// ======================
const productSchema = new mongoose.Schema({
  name: String,
  size: String,
  color: String,
  category: String,
  quantity: Number,
  image: String,
  price: Number,
});

const orderSchema = new mongoose.Schema(
  {
    userName: String,
    email: String,
    primaryNumber: String,
    altNumber: String,
    address: String,
    location: String,
    paymentMethod: String,
    totalPrice: Number,
    status: {
      type: String,
      enum: ["pending", "completed", "active"],
      default: "pending",
    },
    products: [productSchema],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

// ======================
// Matrix Animation HTML
// ======================
function renderMatrixPage(content) {
  return `
    <html>
      <head>
        <title>Aj Creativity Server</title>
        <style>
          body { margin:0; overflow-y:auto; overflow-x:hidden; background:black; color:#00ff00; font-family: "Courier New", monospace; }
          canvas { position:fixed; top:0; left:0; z-index:0; }
          .content { position:relative; z-index:1; padding:20px; text-align:center; color:#0f0; text-shadow: 0 0 15px #0f0; animation: fadeIn 2s ease-in-out; }
          @keyframes fadeIn { from { opacity:0; transform: translateY(-20px); } to { opacity:1; transform: translateY(0); } }
          .order-box { border:1px solid #0f0; padding:10px; margin:10px; border-radius:8px; background: rgba(0,255,0,0.05); box-shadow:0 0 15px #0f0; animation: glow 1.5s infinite alternate; text-align:left; }
          @keyframes glow { from { box-shadow:0 0 5px #0f0; } to { box-shadow:0 0 20px #0f0; } }
          .btn { display:inline-block; padding:12px 20px; margin:8px; border:2px solid #0f0; border-radius:10px; color:#0f0; text-decoration:none; text-shadow:0 0 10px #0f0; box-shadow:0 0 15px #0f0; transition:0.3s; font-weight:bold; }
          .btn:hover { background:#0f0; color:black; box-shadow:0 0 25px #0f0; }
          .panel { border:1px solid #0f0; padding:15px; margin:15px auto; border-radius:8px; max-width:500px; background:rgba(0,255,0,0.05); box-shadow:0 0 15px #0f0; animation: fadeIn 2s ease-in-out; }
          @keyframes glowTitle { from { text-shadow:0 0 10px #0f0,0 0 20px #0f0;} to { text-shadow:0 0 25px #0ff,0 0 50px #0ff;} }
        </style>
      </head>
      <body>
        <canvas id="matrix"></canvas>
        <div class="content">
          ${content}
        </div>
        <script>
          const canvas = document.getElementById("matrix");
          const ctx = canvas.getContext("2d");
          canvas.height = window.innerHeight;
          canvas.width = window.innerWidth;
          const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%^&*";
          const matrix = letters.split("");
          const font_size = 14;
          const columns = canvas.width / font_size;
          const drops = [];
          for(let x=0; x<columns; x++) drops[x]=1;
          function draw(){
            ctx.fillStyle="rgba(0,0,0,0.05)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle="#0f0";
            ctx.font=font_size+"px monospace";
            for(let i=0;i<drops.length;i++){
              const text = matrix[Math.floor(Math.random()*matrix.length)];
              ctx.fillText(text,i*font_size,drops[i]*font_size);
              if(drops[i]*font_size>canvas.height && Math.random()>0.975) drops[i]=0;
              drops[i]++;
            }
          }
          setInterval(draw,33);
          function updateClock(){ const now=new Date(); document.getElementById("clock")?.innerText="🕒 "+now.toLocaleTimeString(); }
          setInterval(updateClock,1000); updateClock();
        </script>
      </body>
    </html>
  `;
}

// ======================
// Routes
// ======================

// Home Page
app.get("/", (req,res)=>{
  res.send(renderMatrixPage(`
    <h1 style="font-size:3rem; animation: glowTitle 2s infinite alternate;">🚀 Aj Creativity Server Running</h1>
    <h2 style="color:#0ff; text-shadow:0 0 15px #0ff; margin-bottom:20px;">Welcome to the Matrix Dashboard</h2>
    <div id="clock" style="font-size:1.5rem; margin-bottom:20px;"></div>
    <div style="margin:20px;">
      <a href="/api/orders" class="btn">📦 View Orders</a>
      <a href="/api/add-order" class="btn">➕ Add Order</a>
    </div>
  `));
});

// Get Orders with Pagination
app.get("/api/orders", async (req,res)=>{
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page-1)*limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments();

    const content = `
      <h1>📦 Orders Dashboard</h1>
      <p>Total Orders: ${totalOrders}</p>
      ${orders.map(o=>`
        <div class="order-box">
          <p><b>ID:</b> ${o._id}</p>
          <p><b>Customer:</b> ${o.userName || "Unknown"}</p>
          <p><b>Status:</b> ${o.status || "Pending"}</p>
          <p><b>Total:</b> ${o.totalPrice ?? 0}</p>
          <p><b>Date:</b> ${o.createdAt.toDateString()}</p>
          <a href="/api/delete-order/${o._id}" style="color:red;">🗑️ Delete Order</a>
        </div>
      `).join("")}
      <div style="margin-top:20px;">
        ${page>1 ? `<a href="/api/orders?page=${page-1}" class="btn">⬅️ Previous</a>` : ''}
        ${skip+orders.length < totalOrders ? `<a href="/api/orders?page=${page+1}" class="btn">➡️ Next</a>` : ''}
      </div>
    `;
    res.send(renderMatrixPage(content));
  } catch(err){
    res.status(500).send(renderMatrixPage(`<h1>❌ Error Fetching Orders</h1><p>${err.message}</p>`));
  }
});

// Delete Order
app.get("/api/delete-order/:id", async (req,res)=>{
  try {
    const id = req.params.id;
    await Order.findByIdAndDelete(id);
    res.redirect("/api/orders");
  } catch(err){
    res.status(500).send(renderMatrixPage(`<h1>❌ Error Deleting Order</h1><p>${err.message}</p>`));
  }
});

// ======================
// Start Server
// ======================
app.listen(PORT, ()=>{
  console.log(`🚀 Server running on port ${PORT}`);
});
