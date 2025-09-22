import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { randomUUID } from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const conversations = {};

// --- API URLs ---
const PRODUCTS_API_URL = "https://aj-creativity-pk-2dpo.vercel.app/api/products";
const REVIEWS_API_URL = "https://your-second-api-endpoint.com/api/reviews"; // Placeholder
const ADDITIONAL_DATA_API_URL = "https://server-nine-kappa-75.vercel.app/api/data";

let productDatabase = [];
let reviewsDatabase = [];
let additionalInfoDatabase = [];

// --- Data Fetching Functions ---
async function fetchProductData() {
    try {
        console.log("Fetching product data...");
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) throw new Error(`Products API request failed: ${response.status}`);
        const jsonResponse = await response.json();
        productDatabase = jsonResponse.data.map(p => ({ name: p.name, price: p.price, category: p.category, image: p.image }));
        console.log(`✅ Successfully fetched ${productDatabase.length} products.`);
    } catch (error) {
        console.error("❌ Failed to fetch product data:", error.message);
    }
}

async function fetchReviewsData() {
    try {
        console.log("Fetching reviews data...");
        const response = await fetch(REVIEWS_API_URL);
        if (!response.ok) throw new Error(`Reviews API request failed: ${response.status}`);
        reviewsDatabase = (await response.json()).data;
        console.log(`✅ Successfully fetched ${reviewsDatabase.length} reviews.`);
    } catch (error) {
        console.error("❌ Failed to fetch reviews data:", error.message);
    }
}

async function fetchAdditionalData() {
    try {
        console.log("Fetching additional product info...");
        const response = await fetch(ADDITIONAL_DATA_API_URL);
        if (!response.ok) throw new Error(`Additional data API request failed: ${response.status}`);
        additionalInfoDatabase = (await response.json()).data;
        console.log(`✅ Successfully fetched ${additionalInfoDatabase.length} additional data points.`);
    } catch (error) {
        console.error("❌ Failed to fetch additional data:", error.message);
    }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
    const { message: userMessage, sessionId } = req.body;
    if (!userMessage) return res.status(400).json({ error: "Message is required" });

    const currentSessionId = sessionId || randomUUID();
    if (!conversations[currentSessionId]) {
        conversations[currentSessionId] = [];
    }
    const history = conversations[currentSessionId];

    try {
        // --- SYSTEM INSTRUCTION FOR ACCURACY ---
        const systemInstruction = `You are a highly precise customer support assistant for "AJ Creativity," an online jewelry store. Your primary role is to answer questions with extreme accuracy based ONLY on the data sources provided below.

--- CORE DIRECTIVE ---
When a user asks about a specific product by its name (e.g., "Eterna Bangles"), your process MUST be:
1.  Scan the 'Product Catalog' data to find the JSON object where the 'name' field is an EXACT, case-insensitive match.
2.  Once you have located that specific object, and only then, extract the requested information (like 'price', 'category', or 'image') directly from THAT object.
3.  NEVER use information from a different product. If you cannot find an exact match for the product name, you must state that you do not have information about that specific item.

--- OTHER INSTRUCTIONS ---
1.  Use the **Product Catalog** for price, category, and images.
2.  Use **Additional Product Information** for specifics like stock, color, and material.
3.  Use **Customer Reviews** for customer feedback.
4.  If a user asks for images of MULTIPLE products, explain you can only show one at a time and ask which one they'd like to see first.
5.  If the user asks for store details, contact, owner info, or custom orders, you MUST provide the following info formatted with clickable HTML links: "For any inquiries or custom orders, you can reach the owner of Jave Handmade directly:<br/>- <strong>WhatsApp:</strong> <a href='https://wa.me/923478708641' target='_blank'>+92 347 8708641</a><br/>- <strong>Phone:</strong> <a href='tel:+923478708641'>+92 347 8708641</a><br/>- <strong>Email:</strong> <a href='mailto:at4105168@gmail.com'>at4105168@gmail.com</a><br/>We'd be happy to help you create a custom piece!"

--- START OF PRODUCT CATALOG ---
${JSON.stringify(productDatabase, null, 2)}
--- END OF PRODUCT CATALOG ---

--- START OF CUSTOMER REVIEWS ---
${JSON.stringify(reviewsDatabase, null, 2)}
--- END OF CUSTOMER REVIEWS ---

--- START OF ADDITIONAL PRODUCT INFORMATION ---
${JSON.stringify(additionalInfoDatabase, null, 2)}
--- END OF ADDITIONAL PRODUCT INFORMATION ---
`;

        const chat = model.startChat({
            history: [{ role: "user", parts: [{ text: systemInstruction }] }, { role: "model", parts: [{ text: "Okay, I am ready to help with precision using the provided data." }] }, ...history]
        });

        const result = await chat.sendMessage(userMessage);
        const reply = result.response.text();

        history.push({ role: "user", parts: [{ text: userMessage }] });
        history.push({ role: "model", parts: [{ text: reply }] });

        res.json({ reply, sessionId: currentSessionId });

    } catch (err) {
        // --- UPDATED ERROR HANDLING ---
        // This block now specifically checks for rate limit errors (quota finished).
        console.error("❌ Gemini API Error:", err.message);
        if (err.message && (err.message.includes('429') || err.message.toLowerCase().includes('quota'))) {
            res.status(429).json({ 
                error: "API rate limit exceeded. The free quota may be finished for the day.", 
                details: err.message 
            });
        } else {
            res.status(500).json({ 
                error: "An error occurred with the AI service.", 
                details: err.message 
            });
        }
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🤖 Chatbot (Gemini) running on http://localhost:${PORT}`);
    Promise.all([
        fetchProductData(),
        fetchReviewsData(),
        fetchAdditionalData()
    ]);
});

