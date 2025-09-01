import React, { useEffect, useState, useCallback } from "react";
import "../styles/order-management.scss";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSubTab, setOrderSubTab] = useState("all");
  const [confirmModal, setConfirmModal] = useState({ show: false, message: "", onConfirm: null });

  // Use useCallback to memoize the fetch function, preventing unnecessary re-creations
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://aj-creativity-pk.vercel.app/api/orders");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      
      if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setError("Received data is not a valid orders array. Please check the backend response.");
        console.error("Backend response was not a valid orders array:", data);
      }
    } catch (err) {
      setError("Failed to fetch orders. Please check your backend connection and server status.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Dependency array to prevent infinite loop

  const handleRemove = (_id) => {
    setConfirmModal({
      show: true,
      message: "Are you sure you want to remove this order?",
      onConfirm: async () => {
        try {
          await fetch(`https://aj-creativity-pk.vercel.app/api/orders/${_id}`, { method: 'DELETE' });
          fetchOrders(); // Re-fetch all orders to update the list
          setSelectedOrder(null); 
          setConfirmModal({ show: false, message: "", onConfirm: null });
        } catch (err) {
          setError("Failed to remove order.");
          console.error(err);
        }
      },
    });
  };

  const handleComplete = (_id) => {
    setConfirmModal({
      show: true,
      message: "Are you sure you want to mark this order as completed?",
      onConfirm: async () => {
        try {
          // Send a PATCH request to the updated backend endpoint
          const response = await fetch(`https://aj-creativity-pk.vercel.app/api/orders/${_id}/complete`, { 
            method: 'PATCH'
          });
          if (!response.ok) {
            throw new Error('Failed to update order status on the server.');
          }
          fetchOrders(); // Re-fetch all orders to reflect the change from the database
          setSelectedOrder(null); 
          setConfirmModal({ show: false, message: "", onConfirm: null });
        } catch (err) {
          setError("Failed to complete order. Please check your backend.");
          console.error(err);
        }
      },
    });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const filteredOrders = orders.filter(order => {
    if (orderSubTab === "all") return true;
    return order.status === orderSubTab;
  });

  if (loading) {
    return (
      <div className="loader">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loader">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="order-management-container">
      <div className="page-header">
        <h1 className="page-title">Order Management</h1>
        <div className="tab-buttons">
          <button
            onClick={() => setOrderSubTab("all")}
            className={`tab-button ${orderSubTab === "all" ? "active" : ""}`}
          >
            All
          </button>
          <button
            onClick={() => setOrderSubTab("pending")}
            className={`tab-button ${orderSubTab === "pending" ? "active" : ""}`}
          >
            Pending
          </button>
          <button
            onClick={() => setOrderSubTab("completed")}
            className={`tab-button ${orderSubTab === "completed" ? "active" : ""}`}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 8)}...</td>
                  <td>{order.userName}</td>
                  <td>Rs {order.totalPrice}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleViewDetails(order)} className="action-button">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No orders found for this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="modal-close-button">
                &times;
              </button>
            </div>
            
            <h4 className="modal-section-title">User Details</h4>
            <p><strong>Name:</strong> {selectedOrder.userName}</p>
            <p><strong>Email:</strong> {selectedOrder.email || "N/A"}</p>
            <p><strong>Primary:</strong> {selectedOrder.primaryNumber}</p>
            <p><strong>Alternate:</strong> {selectedOrder.altNumber || "N/A"}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            <p><strong>Location:</strong> {selectedOrder.location}</p>
            <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
            
            <h4 className="modal-section-title">Products</h4>
            {selectedOrder.products?.map((p, index) => (
              <div key={index} className="product-item">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="product-image" />
                ) : (
                  <div className="no-image-placeholder">No Image</div>
                )}
                <div style={{ flexGrow: 1 }}>
                  <p style={{ fontWeight: 500 }}>{p.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    Qty: {p.quantity} | Price: Rs {p.price} | Size: {p.size || "N/A"} | Category: {p.category || "N/A"} | Color: {p.color || "N/A"}
                  </p>
                </div>
              </div>
            ))}
            
            <h4 className="modal-section-title">Order Status</h4>
            <p><strong>Status:</strong> <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span></p>
            <p><strong>Total Price:</strong> Rs {selectedOrder.totalPrice}</p>

            <div className="modal-actions-footer">
              {selectedOrder.status === 'pending' && (
                <button
                  onClick={() => handleComplete(selectedOrder._id)}
                  className="complete-button"
                >
                  Completed
                </button>
              )}
              <button
                onClick={() => handleRemove(selectedOrder._id)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Action</h3>
              <button onClick={() => setConfirmModal({ show: false, message: "", onConfirm: null })} className="modal-close-button">
                &times;
              </button>
            </div>
            <p className="modal-message">{confirmModal.message}</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmModal({ show: false, message: "", onConfirm: null })} className="cancel-button">
                Cancel
              </button>
              <button onClick={confirmModal.onConfirm} className="confirm-button">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
