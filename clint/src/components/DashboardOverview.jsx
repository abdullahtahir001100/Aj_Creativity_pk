// src/components/DashboardOverview.jsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";
import "../styles/dashboard-overview.scss";
import Loader from "./loader";

// Utility function to generate a color from a string for consistent chart colors (unchanged)
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

// Component to display when data is missing for a chart
const NoData = ({ message = "No Data Available" }) => (
    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', border: '1px dashed #ccc', borderRadius: '8px', margin: '10px 0' }}>
        <p>{message}</p>
    </div>
);


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
        orderFunnel: [], 
        topLocations: [], 
      }
    });
    
    // Fetch dashboard data from the backend
    useEffect(() => {
      const fetchAllData = async () => {
        setLoading(true);
        try {
          const dashboardRes = await fetch("https://aj-creativity-pk.vercel.app/api/dashboard-metrics");

          if (!dashboardRes.ok) {
            throw new Error(`Server returned status: ${dashboardRes.status}`);
          }

          const dashboardData = await dashboardRes.json();

          setDashboardData({
            kpiData: {
              totalOrders: dashboardData.totalOrders || 0,
              revenue: dashboardData.revenue || 0,
              newCustomers: dashboardData.newCustomers || 0,
              orderTrend: parseFloat(dashboardData.orderTrend) || 0,
              revenueTrend: parseFloat(dashboardData.revenueTrend) || 0,
              newCustomersTrend: parseFloat(dashboardData.newCustomersTrend) || 0,
            },
            chartData: {
              monthlySales: dashboardData.monthlySales || [],
              topProducts: dashboardData.topProducts || [],
              dailyRevenue: dashboardData.dailyRevenue || [],
              orderFunnel: dashboardData.orderFunnel || [], 
              topLocations: dashboardData.topLocations || [],
            }
          });
        } catch (err) {
          console.error("❌ Failed to fetch dashboard data:", err);
          setDashboardData({ 
                kpiData: {totalOrders: 0, revenue: 0, newCustomers: 0, orderTrend: 0, revenueTrend: 0, newCustomersTrend: 0}, 
                chartData: {monthlySales: [], topProducts: [], dailyRevenue: [], orderFunnel: [], topLocations: []} 
            });
        } finally {
          setLoading(false);
        }
      };

      fetchAllData();
    }, []);

    const { kpiData, chartData } = dashboardData;
    
    // Check if any data exists for the charts (to show "No Data" message)
    const hasMonthlySalesData = chartData.monthlySales && chartData.monthlySales.length > 0;
    const hasTopProductsData = chartData.topProducts && chartData.topProducts.length > 0;
    const hasDailyRevenueData = chartData.dailyRevenue && chartData.dailyRevenue.length > 0;
    const hasOrderFunnelData = chartData.orderFunnel && chartData.orderFunnel.length > 0;
    
    const formatTrend = (trend) => {
      const formattedTrend = Math.abs(trend).toFixed(2); 
      const sign = trend >= 0 ? '↑' : '↓';
      const trendClass = trend >= 0 ? 'positive' : 'negative';
      return (
        <span className={`kpi-trend ${trendClass}`}>
          {sign} {formattedTrend}% from last month
        </span>
      );
    };

    if (loading) {
        return (
            <div className="loading-state">
               <Loader />
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
                        <p className="kpi-value">{kpiData.totalOrders.toLocaleString()}</p>
                        {formatTrend(kpiData.orderTrend)}
                    </div>
                    <div className="card-kpi">
                        <h3 className="kpi-title">Total Revenue</h3>
                        <p className="kpi-value">Rs {kpiData.revenue.toLocaleString()}</p>
                        {formatTrend(kpiData.revenueTrend)}
                    </div>
                    <div className="card-kpi">
                        <h3 className="kpi-title">New Customers</h3>
                        <p className="kpi-value">{kpiData.newCustomers.toLocaleString()}</p>
                        {formatTrend(kpiData.newCustomersTrend)}
                    </div>
                </div>

                <div className="charts-grid">
                    {/* Monthly Sales Chart (BarChart) */}
                    <div className="chart-card">
                        <h3 className="chart-title">Monthly Sales</h3>
                        {hasMonthlySalesData ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData.monthlySales}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Sales']} />
                                    <Legend />
                                    <Bar dataKey="sales" fill={stringToColor("monthly-sales")} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <NoData message="No Monthly Sales Data Available." />
                        )}
                    </div>
                    
                    {/* Top Products Chart (PieChart) */}
                    <div className="chart-card">
                        <h3 className="chart-title">Top Products</h3>
                        {hasTopProductsData ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={chartData.topProducts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {chartData.topProducts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={stringToColor(entry.name)} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} Units`, 'Quantity']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <NoData message="No Top Products Data Available." />
                        )}
                    </div>

                    {/* Daily Revenue Chart (LineChart) */}
                    <div className="chart-card">
                        <h3 className="chart-title">Daily Revenue</h3>
                        {hasDailyRevenueData ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData.dailyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']} />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke={stringToColor("daily-revenue")} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <NoData message="No Daily Revenue Data Available." />
                        )}
                    </div>

                    {/* Order Funnel Chart (PieChart) */}
                    <div className="chart-card">
                        <h3 className="chart-title">Order Status Funnel</h3>
                        {hasOrderFunnelData ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={chartData.orderFunnel} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {chartData.orderFunnel.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={stringToColor(entry.name)} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} Orders`, 'Status']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <NoData message="No Order Status Funnel Data Available." />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;