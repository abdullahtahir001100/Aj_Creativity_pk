const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// A simple in-memory database to store orders
const orders = {};

// Simulate a payment gateway for JazzCash/Easypaisa
// In a real application, you would make an API call to the actual gateway.
function createPaymentIntent(orderId, amount, paymentMethod) {
    return new Promise((resolve) => {
        // Simulate a delay for network communication
        setTimeout(() => {
            const transactionId = `txn_${uuidv4()}`;
            const paymentGatewayUrl = `https://mock-payment-gateway.com/pay?txn_id=${transactionId}&amount=${amount}&method=${paymentMethod}`;
            
            // In a real scenario, you'd handle the response from the gateway.
            // For now, we'll return a success status and a mock URL.
            resolve({
                success: true,
                message: "Payment intent created successfully.",
                transactionId: transactionId,
                redirectUrl: paymentGatewayUrl
            });
        }, 1500); // Simulate 1.5 second delay
    });
}

// API endpoint to place an order
app.post('/api/orders', async (req, res) => {
    const orderDetails = req.body;
    const orderId = uuidv4();

    // Add a status to the order
    orderDetails.orderId = orderId;
    orderDetails.createdAt = new Date();
    
    // Store the order in our "database"
    orders[orderId] = orderDetails;

    if (orderDetails.paymentMethod === 'cod') {
        orderDetails.status = 'Pending';
        return res.status(200).json({ 
            success: true, 
            message: "Order placed successfully via Cash on Delivery.", 
            orderId 
        });
    }

    try {
        // For online payments, create a payment intent
        const paymentIntent = await createPaymentIntent(
            orderId,
            orderDetails.totalPrice,
            orderDetails.paymentMethod
        );

        if (paymentIntent.success) {
            orderDetails.status = 'Payment Pending';
            orders[orderId] = orderDetails; // Update order status
            
            // Respond with the details needed to redirect or open a popup
            return res.status(200).json({
                success: true,
                message: "Payment intent created. Redirecting to gateway.",
                redirectUrl: paymentIntent.redirectUrl,
                transactionId: paymentIntent.transactionId
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: "Failed to create payment intent." 
            });
        }
    } catch (error) {
        console.error('Payment gateway error:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error." 
        });
    }
});

// A webhook endpoint to confirm payment status (optional but recommended)
app.post('/api/payment-webhook', (req, res) => {
    // In a real scenario, the payment gateway would send a POST request here
    // to confirm the payment.
    const { transactionId, status } = req.body;

    // Find the order associated with the transaction
    const orderId = Object.keys(orders).find(id => orders[id].transactionId === transactionId);

    if (orderId && status === 'completed') {
        orders[orderId].status = 'Paid';
        orders[orderId].paymentDate = new Date();
        console.log(`Payment confirmed for order: ${orderId}`);
        return res.status(200).send('Webhook received and processed.');
    } else {
        return res.status(400).send('Invalid webhook data.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});