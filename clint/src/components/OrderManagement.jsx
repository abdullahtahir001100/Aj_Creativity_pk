import React, { useEffect, useState, useCallback } from "react";
import "../styles/order-management.scss";
import Loader from "../components/loader";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSubTab, setOrderSubTab] = useState("all");
  const [confirmModal, setConfirmModal] = useState({ show: false, message: "", onConfirm: null });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://aj-creativity-pk.vercel.app/api/orders");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setError("Failed to fetch orders. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); 

// ----------------------------------------------------------------------
// --- ACTION HANDLERS ---
// ----------------------------------------------------------------------

// Universal Status Update Handler (Re-use for Complete, Revert, Cancel)
const handleStatusUpdate = (orderId, targetStatus, message) => {
    // Backend API URL: targetStatus ke hisaab se endpoint choose karein
    let endpoint = "";
    if (targetStatus === 'completed') endpoint = `/api/orders/${orderId}/complete`;
    else if (targetStatus === 'cancelled') endpoint = `/api/orders/${orderId}/cancel`; 
    else if (targetStatus === 'pending') endpoint = `/api/orders/${orderId}/revert-to-pending`; // Revert to Pending

    if (!endpoint) return;

    setConfirmModal({
        show: true,
        message: message,
        onConfirm: async () => {
            try {
                const response = await fetch(`https://aj-creativity-pk.vercel.app${endpoint}`, { method: 'PATCH' });
                if (!response.ok) throw new Error(`Failed to set status to ${targetStatus} on the server.`);
                
                // Modal band karke data refresh karein
                setConfirmModal({ show: false, message: "", onConfirm: null });
                setSelectedOrder(null);
                fetchOrders(); 
            } catch (err) {
                setError(`Failed to update order status: ${err.message}`);
                setConfirmModal({ show: false, message: "", onConfirm: null });
            }
        },
    });
};


  const handleRemove = (_id) => {
    handleStatusUpdate(_id, 'remove', "Are you sure you want to permanently remove this order?");
  };

  const handleComplete = (_id) => {
    handleStatusUpdate(_id, 'completed', "Are you sure you want to mark this order as completed (Delivered)?");
  };
  
  // Handler for final cancellation (Approved by Admin)
  const handleFinalCancel = (_id) => {
    handleStatusUpdate(_id, 'cancelled', "WARNING: Approve this cancellation and permanently mark the order as CANCELLED?");
  };

  // Handler to reject the cancellation request and revert to PENDING
  const handleRejectCancel = (_id) => {
    handleStatusUpdate(_id, 'pending', "Confirm: Reject cancellation request and revert order status back to PENDING?");
  };
// ----------------------------------------------------------------------


  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const filteredOrders = orders.filter(order => {
    const status = order.status || 'pending';
    if (orderSubTab === "all") return true;
    return status === orderSubTab;
  });
  
  // Dynamic Action Buttons
  const getActionButtons = (order) => {
      const status = order.status || 'pending';
      
      // Actions for PENDING orders
      if (status === 'pending') {
          return (
              <>
                  <button onClick={() => handleComplete(order._id)} className="action-button complete-button">
                      Complete
                  </button>
                  <button onClick={() => handleFinalCancel(order._id)} className="action-button remove-button">
                      Cancel
                  </button>
              </>
          );
      }
      
      // Actions for REQUESTED orders (New Logic)
      if (status === 'requested') {
          return (
              <>
                  <button onClick={() => handleFinalCancel(order._id)} className="action-button requested-cancel-button">
                      Accept Cancel (Cancelled)
                  </button>
                  <button onClick={() => handleRejectCancel(order._id)} className="action-button revert-button">
                      Reject Cancel (Set Pending)
                  </button>
              </>
          );
      }
      
      // For completed/cancelled orders, no direct action needed besides remove
      if (status === 'completed' || status === 'cancelled') {
           return (
              <span className="no-action-needed">No further action</span>
           );
      }
      return null;
  };

// ----------------------------------------------------------------------

  if (loading) {
    return (
      <div className="loader"><Loader /></div>
    );
  }

  if (error) {
    return (<div className="loader"><p>Error: {error}</p></div>);
  }

  return (
    <div className="order-management-container">
      <div className="page-header">
        <h1 className="page-title">Order Management</h1>
        <div className="tab-buttons">
          <button onClick={() => setOrderSubTab("all")} className={`tab-button ${orderSubTab === "all" ? "active" : ""}`}>All</button>
          <button onClick={() => setOrderSubTab("pending")} className={`tab-button ${orderSubTab === "pending" ? "active" : ""}`}>Pending</button>
          <button onClick={() => setOrderSubTab("requested")} className={`tab-button requested-tab ${orderSubTab === "requested" ? "active" : ""}`}>Requested</button>
          <button onClick={() => setOrderSubTab("cancelled")} className={`tab-button cancelled-tab ${orderSubTab === "cancelled" ? "active" : ""}`}>Cancelled</button>
          <button onClick={() => setOrderSubTab("completed")} className={`tab-button ${orderSubTab === "completed" ? "active" : ""}`}>Completed</button>
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
                  <td className="action-cell">
                    <button onClick={() => handleViewDetails(order)} className="action-button view-button">
                      View
                    </button>
                      <div className="dynamic-actions">{getActionButtons(order)}</div>
                      <button onClick={() => handleRemove(order._id)} className="action-button remove-button remove-icon">
                          &times;
                      </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">No orders found for this category.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal (unchanged) */}
      {selectedOrder && (
          // ... (Your modal JSX remains here) ...
          <div className="modal-overlay">
            <div className="modal-content">
                {/* Modal Header/Details/Products */}
                <div className="modal-header">
                     <h3 className="modal-title">Order Details: {selectedOrder._id.substring(0, 8)}...</h3>
                     <button onClick={() => setSelectedOrder(null)} className="modal-close-button">&times;</button>
                </div>
                <h4 className="modal-section-title">Status & Totals</h4>
                <p><strong>Status:</strong> <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span></p>
                <p><strong>Total Price:</strong> Rs {selectedOrder.totalPrice}</p>
                {/* ... other details ... */}
                <h4 className="modal-section-title">User & Delivery Info</h4>
                <p><strong>Name:</strong> {selectedOrder.userName}</p>
                <p><strong>Primary:</strong> {selectedOrder.primaryNumber}</p>
                <p><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.location}</p>
                
                <h4 className="modal-section-title">Products</h4>
                {selectedOrder.products?.map((p, index) => (
                    <div key={index} className="product-item">
                        {p.image && <img src={p.image} alt={p.name} className="product-image" />}
                        <div style={{ flexGrow: 1 }}>
                            <p style={{ fontWeight: 500 }}>{p.name} (x{p.quantity})</p>
                        </div>
                    </div>
                ))}
                
                <div className="modal-actions-footer">
                    <div className="dynamic-actions-modal">{getActionButtons(selectedOrder)}</div>
                    <button onClick={() => handleRemove(selectedOrder._id)} className="remove-button">
                        Remove Permanently
                    </button>
                </div>
            </div>
          </div>
      )}

      {/* Confirmation Modal (unchanged) */}
      {confirmModal.show && (
          // ... (Your confirmation modal JSX remains here) ...
          <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                     <h3 className="modal-title">Confirm Action</h3>
                     <button onClick={() => setConfirmModal({ show: false, message: "", onConfirm: null })} className="modal-close-button">&times;</button>
                </div>
                <p className="modal-message">{confirmModal.message}</p>
                <div className="modal-actions">
                    <button onClick={() => setConfirmModal({ show: false, message: "", onConfirm: null })} className="cancel-button">Cancel</button>
                    <button onClick={confirmModal.onConfirm} className="confirm-button">Confirm</button>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default OrderManagement;