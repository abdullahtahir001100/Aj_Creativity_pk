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
        // --- NEW & IMPROVED SYSTEM INSTRUCTION ---
        const systemInstruction = `You are a professional and efficient customer support assistant for "AJ Creativity". Your answers must be accurate and concise.

--- IMAGE REQUEST RULES ---
1.  **Single Image Request:** If the user asks for an image of a SPECIFIC product (e.g., "image of Eterna Bangles"), find the exact product in the 'Product Catalog' and respond ONLY with the image URL. Example response: "Here is the image for Eterna Bangles: [URL]"
2.  **Multiple Image Request:** If the user asks for images of a CATEGORY or MULTIPLE products (e.g., "show me all gold bangles"), find all matching products. Respond with a list, where each item is the product name followed by its image URL. Example response: "Here are the images for gold bangles:\nGleamCraft: [URL]\nLustre Loom: [URL]"
3.  **Vague Image Request:** If the user asks for "an image" or "a picture" without specifying a product, you MUST pick one random product from the catalog. Respond with a message like: "Certainly! Here is a random product from our collection: The [Product Name]. It costs [Price].\n[Image URL]"

--- OTHER INSTRUCTIONS ---
-   **Accuracy is Key:** Always find the exact product by name before giving any information. If not found, say so.
-   **Contact Info:** If asked for store details, contact, or custom orders, provide the clickable HTML links as previously instructed.
-   **Combine Data:** Use all three data sources (Product Catalog, Reviews, Additional Info) to answer detailed questions.

--- DATA SOURCES ---
Product Catalog: ${JSON.stringify(productDatabase, null, 2)}
Customer Reviews: ${JSON.stringify(reviewsDatabase, null, 2)}
Additional Product Information: ${JSON.stringify(additionalInfoDatabase, null, 2)}
`;

        const chat = model.startChat({
            history: [{ role: "user", parts: [{ text: systemInstruction }] }, { role: "model", parts: [{ text: "Okay, I am ready to assist AJ Creativity customers efficiently and accurately." }] }, ...history]
        });

        const result = await chat.sendMessage(userMessage);
        const reply = result.response.text();

        history.push({ role: "user", parts: [{ text: userMessage }] });
        history.push({ role: "model", parts: [{ text: reply }] });

        res.json({ reply, sessionId: currentSessionId });

    } catch (err) {
        console.error("❌ Gemini API Error:", err.message);
        if (err.message && (err.message.includes('429') || err.message.toLowerCase().includes('quota'))) {
            res.status(429).json({ error: "API rate limit exceeded.", details: err.message });
        } else {
            res.status(500).json({ error: "An error occurred with the AI service.", details: err.message });
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

