import React, { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [orderSubTab, setOrderSubTab] = useState("pending");

  useEffect(() => {
    fetch("/api/orders")
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (error) {
          console.error("❌ Failed to parse JSON:", text);
          throw error;
        }
      })
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.warn("⚠ Unexpected API response:", data);
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success || data.message?.toLowerCase().includes("deleted")) {
        setOrders((prev) => prev.filter((order) => order._id !== id));
      } else {
        alert(data.message || "❌ Failed to delete order");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error connecting to server");
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status: "completed" } : o))
        );
      } else {
        alert(data.message || "❌ Failed to mark as completed");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error connecting to server");
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "20px", color: "#fff" }}>
        ⏳ Loading...
      </p>
    );

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const chartData = months.map((m, i) => ({
    month: m,
    orders: orders.filter(
      (o) => new Date(o.createdAt).getMonth() === i
    ).length,
    revenue: orders
      .filter((o) => new Date(o.createdAt).getMonth() === i)
      .reduce((acc, o) => acc + (o.totalPrice || 0), 0),
  }));

  const statusChartData = months.map((m, i) => ({
    month: m,
    pending: orders.filter(
      (o) => new Date(o.createdAt).getMonth() === i && o.status === "pending"
    ).length,
    completed: orders.filter(
      (o) => new Date(o.createdAt).getMonth() === i && o.status === "completed"
    ).length,
  }));

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  if (!isAuthenticated) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📦 Orders Dashboard</h1>

      <div style={styles.tabWrapper}>
        <button
          style={activeTab === "orders" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          style={activeTab === "chart" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("chart")}
        >
          Chart
        </button>
      </div>

      {/* Orders Section */}
      {activeTab === "orders" && (
        <>
          <div style={styles.subTabWrapper}>
            <button
              style={orderSubTab === "pending" ? styles.activeSubTab : styles.subTab}
              onClick={() => setOrderSubTab("pending")}
            >
              Pending Orders
            </button>
            <button
              style={orderSubTab === "completed" ? styles.activeSubTab : styles.subTab}
              onClick={() => setOrderSubTab("completed")}
            >
              Completed Orders
            </button>
          </div>

          {orderSubTab === "pending" &&
            (pendingOrders.length === 0 ? (
              <p style={styles.noOrders}>No pending orders</p>
            ) : (
              pendingOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  handleRemove={handleRemove}
                  handleComplete={handleComplete}
                />
              ))
            ))}

          {orderSubTab === "completed" &&
            (completedOrders.length === 0 ? (
              <p style={styles.noOrders}>No completed orders</p>
            ) : (
              completedOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  handleRemove={handleRemove}
                  handleComplete={handleComplete}
                />
              ))
            ))}
        </>
      )}

      {/* Chart Section */}
      {activeTab === "chart" && (
        <div style={styles.chartContainer}>
          <h2 style={{ color: "#58a6ff" }}>📊 Analytics</h2>

          {/* Summary Cards */}
          <div style={styles.summaryWrapper}>
            <div style={styles.summaryCard}>
              📦 Total Orders: <strong>{totalOrders || 0}</strong>
            </div>
            <div style={styles.summaryCard}>
              ⏳ Pending: <strong>{pendingOrders.length || 0}</strong>
            </div>
            <div style={styles.summaryCard}>
              ✅ Completed: <strong>{completedOrders.length || 0}</strong>
            </div>
            <div style={styles.summaryCard}>
              💰 Revenue: <strong>Rs {totalRevenue || 0}</strong>
            </div>
          </div>

          {/* Line Chart */}
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#58a6ff" strokeWidth={2} name="Orders" />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>

          {/* Bar Chart */}
          <h2 style={{ color: "#58a6ff", marginTop: "30px" }}>📊 Pending vs Completed</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" fill="#facc15" name="Pending Orders" />
              <Bar dataKey="completed" fill="#22c55e" name="Completed Orders" />
            </BarChart>
          </ResponsiveContainer>

          {/* Pie Charts */}
          <h2 style={{ color: "#58a6ff", marginTop: "30px" }}>🥧 Orders Breakdown</h2>
          <div style={{ display: "flex", gap: "30px", justifyContent: "center", flexWrap: "wrap" }}>
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Pending", value: pendingOrders.length || 0 },
                    { name: "Completed", value: completedOrders.length || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  <Cell fill="#facc15" />
                  <Cell fill="#22c55e" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Completed %", value: totalOrders ? (completedOrders.length / totalOrders) * 100 : 0 },
                    { name: "Pending %", value: totalOrders ? (pendingOrders.length / totalOrders) * 100 : 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#facc15" />
                </Pie>
                <Tooltip formatter={(value) => value.toFixed(2) + "%"} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable Order Card */
function OrderCard({ order, handleRemove, handleComplete }) {
  return (
    <div style={styles.card} className='trans'>
      <div style={styles.row}>
        <div style={styles.userDetails}>
          <h2 style={styles.subHeading}>👤 User Details</h2>
          <p><strong>Name:</strong> {order.userName}</p>
          <p><strong>Email:</strong> {order.email || "N/A"}</p>
          <p><strong>Primary:</strong> {order.primaryNumber}</p>
          <p><strong>Alternate:</strong> {order.altNumber || "N/A"}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Location:</strong> {order.location}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
          <p><strong>Total:</strong> Rs {order.totalPrice}</p>
        </div>
        <div style={styles.productsWrapper}>
          <h2 style={styles.subHeading}>🛍️ Products</h2>
          {order.products?.map((p, index) => (
            <div key={index} style={styles.productCard}>
              <div style={styles.productImageWrapper}>
                {p.image ? (
                  <img src={p.image} alt={p.name} style={styles.productImage} />
                ) : (
                  <div style={styles.noImage}>No Image</div>
                )}
              </div>
              <div style={styles.productInfo}>
                <p><strong>Name:</strong> {p.name}</p>
                <p><strong>Size:</strong> {p.size || "N/A"}</p>
                <p><strong>Color:</strong> {p.color || "N/A"}</p>
                <p><strong>Category:</strong> {p.category || "N/A"}</p>
                <p><strong>Quantity:</strong> {p.quantity}</p>
                <p><strong>Price:</strong> Rs {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "right", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button style={styles.removeBtn} onClick={() => handleRemove(order._id)}>❌ Remove</button>
        {order.status === "pending" && (
          <button style={styles.completeBtn} onClick={() => handleComplete(order._id)}>✅ Complete</button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" },
  heading: { textAlign: "center", marginBottom: "25px", fontSize: "28px", color: "#58a6ff" },
  tabWrapper: {display: "flex", justifyContent: "center", marginBottom: "20px", gap: "15px" },
  tab: { background: "#22272e", color: "#aaa", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  activeTab: { background: "#58a6ff", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  subTabWrapper: { display: "flex", justifyContent: "center", marginBottom: "20px", gap: "10px" },
  subTab: { background: "#333", color: "#aaa", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" },
  activeSubTab: { background: "#22c55e", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" },
  noOrders: { textAlign: "center", fontSize: "18px", color: "#bbb" },
  card: { padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", marginBottom: "20px", color: "#ddd" },
  row: { display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" },
  userDetails: { flex: "1", minWidth: "250px",boxShadow: "0 2px 8px rgba(0,0,0,0.5)", padding: "15px", borderRadius: "10px",color:'#000',lineHeight:'2' },
  productsWrapper: { flex: "2", minWidth: "350px",boxShadow: "0 2px 8px rgba(0,0,0,0.5)", padding: "15px", borderRadius: "10px" },
  subHeading: { marginBottom: "12px", color: "#58a6ff", fontSize: "18px" },
  productCard: { display: "flex", alignItems: "center", gap: "85px",boxShadow: "0 2px 8px rgba(0,0,0,0.5)", padding: "12px", borderRadius: "10px", marginBottom: "15px", },
  productImageWrapper: { width: "60%", height: "60%", borderRadius: "10px", overflow: "hidden", background: "#333", display: "flex", alignItems: "center", justifyContent: "center" },
  productImage: { width: "100%", height: "100%", objectFit: "cover" },
  noImage: { color: "#888", fontSize: "14px" },
  productInfo: { flex: "1", color: "#000", fontSize: "15px", lineHeight: "1.6" },
  removeBtn: {  color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", marginTop: "15px", background:"#f87171" },
  completeBtn: {  color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", marginTop: "15px", background:"#34d399" },
  chartContainer: {  boxShadow: "0 2px 8px rgba(0,0,0,0.5)", padding: "20px", borderRadius: "12px", color: "#ddd" },
  summaryWrapper: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" },
  summaryCard: { padding: "15px", borderRadius: "10px", textAlign: "center", fontSize: "16px", color: "#000", boxShadow: "0 2px 5px rgba(0,0,0,0.5)" },
};
