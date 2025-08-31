// src/components/DashboardOverview.jsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";
import "../styles/dashboard-overview.scss";

// Utility function to generate a color from a string for consistent chart colors
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};

const DashboardOverview = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
      kpiData: {
        totalOrders: 0,
        revenue: 0,
        newCustomers: 0,
        orderTrend: 0,
        revenueTrend: 0,
        newCustomersTrend: 0,
      },
      chartData: {
        monthlySales: [],
        topProducts: [],
        dailyRevenue: [],
      }
    });
    
    // Fetch dashboard data from the backend
    useEffect(() => {
      const fetchAllData = async () => {
        setLoading(true);
        try {
          const dashboardRes = await fetch("https://aj-creativity-pk.vercel.app/api/dashboard-metrics");
          const dashboardData = await dashboardRes.json();

          setDashboardData({
            kpiData: {
              totalOrders: dashboardData.totalOrders || 0,
              revenue: dashboardData.revenue || 0,
              newCustomers: dashboardData.newCustomers || 0,
              orderTrend: dashboardData.orderTrend || 0,
              revenueTrend: dashboardData.revenueTrend || 0,
              newCustomersTrend: dashboardData.newCustomersTrend || 0,
            },
            chartData: {
              monthlySales: dashboardData.monthlySales || [],
              topProducts: dashboardData.topProducts || [],
              dailyRevenue: dashboardData.dailyRevenue || [],
            }
          });
        } catch (err) {
          console.error("❌ Failed to fetch dashboard data:", err);
          // Fallback to empty data on error to prevent app crash
          setDashboardData({ kpiData: {totalOrders: 0, revenue: 0, newCustomers: 0, orderTrend: 0, revenueTrend: 0, newCustomersTrend: 0}, chartData: {monthlySales: [], topProducts: [], dailyRevenue: []} });
        } finally {
          setLoading(false);
        }
      };

      fetchAllData();
    }, []);

    const { kpiData, chartData } = dashboardData;
    
    const formatTrend = (trend) => {
      const sign = trend >= 0 ? '↑' : '↓';
      const trendClass = trend >= 0 ? 'positive' : 'negative';
      return (
        <span className={`kpi-trend ${trendClass}`}>
          {sign} {Math.abs(trend)}% from last month
        </span>
      );
    };

    if (loading) {
        return (
            <div className="loading-state">
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="header-main">
                <div>
                    <h1 className="header-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, Admin</p>
                </div>
            </div>

            <div className="main-content">
                <div className="kpi-grid">
                    <div className="card-kpi">
                        <h3 className="kpi-title">Total Orders</h3>
                        <p className="kpi-value">0{kpiData.totalOrders.toLocaleString()}</p>
                        {formatTrend(kpiData.orderTrend)}
                    </div>
                    <div className="card-kpi">
                        <h3 className="kpi-title">Total Revenue</h3>
                        <p className="kpi-value">Rs {kpiData.revenue.toLocaleString()}</p>
                        {formatTrend(kpiData.revenueTrend)}
                    </div>
                    <div className="card-kpi">
                        <h3 className="kpi-title">New Customers</h3>
                        <p className="kpi-value">0{kpiData.newCustomers}</p>
                        {formatTrend(kpiData.newCustomersTrend)}
                    </div>
                </div>

                <div className="charts-grid">
                    <div className="chart-card">
                        <h3 className="chart-title">Monthly Sales</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData.monthlySales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill={stringToColor("sales")} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-card">
                        <h3 className="chart-title">Top Products</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={chartData.topProducts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {chartData.topProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={stringToColor(entry.name)} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-card">
                        <h3 className="chart-title">Daily Revenue</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData.dailyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke={stringToColor("revenue")} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;