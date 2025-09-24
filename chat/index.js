// import express from "express";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { randomUUID } from "crypto";
// import fetch from "node-fetch";
// import cors from "cors"; 

// dotenv.config();

// const app = express();

// // --- CORS Configuration ---
// const whitelist = ['http://localhost:5173', 'https://www.javehandmade.store'];
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
// };
// app.use(cors(corsOptions)); 
// app.use(express.json());

// const conversations = {};

// // --- API Endpoints ---
// const PRODUCTS_API_URL = "https://aj-creativity-pk-2dpo.vercel.app/api/products";
// const REVIEWS_API_URL = "https://your-second-api-endpoint.com/api/reviews";
// const ADDITIONAL_DATA_API_URL = "https://server-nine-kappa-75.vercel.app/api/data";

// let productDatabase = [];
// let reviewsDatabase = [];
// let additionalInfoDatabase = [];

// // --- Data Fetching Functions ---
// async function fetchProductData() {
//     try {
//         const response = await fetch(PRODUCTS_API_URL);
//         if (!response.ok) throw new Error(`Products API request failed: ${response.status} - ${response.statusText}`);
//         const jsonResponse = await response.json();
//         productDatabase = jsonResponse.data.map(p => ({ name: p.name, price: p.price, category: p.category, image: p.image }));
//         console.log(`✅ Successfully fetched ${productDatabase.length} products.`);
//     } catch (error) {
//         console.error("❌ Failed to fetch product data:", error.message);
//         productDatabase = [];
//     }
// }

// async function fetchReviewsData() {
//     try {
//         const response = await fetch(REVIEWS_API_URL);
//         if (!response.ok) throw new Error(`Reviews API request failed: ${response.status} - ${response.statusText}`);
//         reviewsDatabase = (await response.json()).data;
//         console.log(`✅ Successfully fetched ${reviewsDatabase.length} reviews.`);
//     } catch (error) {
//         console.error("❌ Failed to fetch reviews data:", error.message);
//         reviewsDatabase = [];
//     }
// }

// async function fetchAdditionalData() {
//     try {
//         const response = await fetch(ADDITIONAL_DATA_API_URL);
//         if (!response.ok) throw new Error(`Additional data API request failed: ${response.status} - ${response.statusText}`);
//         const jsonResponse = await response.json();
//         additionalInfoDatabase = jsonResponse.data;
//         console.log(`✅ Successfully fetched ${additionalInfoDatabase.length} additional data points.`);
//     } catch (error) {
//         console.error("❌ Failed to fetch additional data:", error.message);
//         additionalInfoDatabase = [];
//     }
// }

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // --- Chat Endpoint ---
// app.post("/chat", async (req, res) => {
//     const { message: userMessage, sessionId } = req.body;
//     if (!userMessage) return res.status(400).json({ error: "Message is required" });

//     const currentSessionId = sessionId || randomUUID();
//     if (!conversations[currentSessionId]) {
//         conversations[currentSessionId] = [];
//     }
//     const history = conversations[currentSessionId];

//     try {
//         // Updated system instruction with data
//         const systemInstruction = `You are an expert customer support assistant for "AJ Creativity," an online jewelry store. Answer questions based ONLY on the three data sources provided below: the Product Catalog, Customer Reviews, and Additional Product Information.
        
// --- IMPORTANT INSTRUCTIONS ---
// 1. Use the **Product Catalog** for general information like price, category, and images.
// 2. Use the **Additional Product Information** for specifics like stock, color, material, and detailed descriptions.
// 3. Use the **Customer Reviews** data to answer what other customers think of a product.
// 4. When asked a question, combine information from all sources if needed. For example, to describe a product fully, use its name and price from the catalog and its material and stock from the additional info.
// 5. If you provide an image, provide only the URL.
// 6. If asked for multiple images, state that you can only show one at a time.
// 7. If the user asks for store details, owner information, contact number, or how to customize an item, you MUST provide the following information formatted exactly like this: "For any inquiries or custom orders, you can reach the owner of Jave Handmade directly:<br/>- <strong>WhatsApp:</strong> <a href='https://wa.me/923478708641' target='_blank'>+92 3478708641</a><br/>- <strong>Phone:</strong> <a href='tel:+923478708641'>+92 3478708641</a><br/>- <strong>Email:</strong> <a href='mailto:at4105168@gmail.com'>at4105168@gmail.com</a><br/>We'd be happy to help you create a custom piece!" Do not use the product data for this specific type of question.

// --- START OF PRODUCT CATALOG ---
// ${JSON.stringify(productDatabase, null, 2)}
// --- END OF PRODUCT CATALOG ---

// --- START OF CUSTOMER REVIEWS ---
// ${JSON.stringify(reviewsDatabase, null, 2)}
// --- END OF CUSTOMER REVIEWS ---

// --- START OF ADDITIONAL PRODUCT INFORMATION ---
// ${JSON.stringify(additionalInfoDatabase, null, 2)}
// --- END OF ADDITIONAL PRODUCT INFORMATION ---
// `;

//         const chat = model.startChat({
//             history: [{ role: "user", parts: [{ text: systemInstruction }] }, { role: "model", parts: [{ text: "Okay, I am ready to help using the product catalog, customer reviews, and additional product information." }] }, ...history]
//         });

//         const result = await chat.sendMessage(userMessage);
//         const reply = result.response.text();

//         history.push({ role: "user", parts: [{ text: userMessage }] });
//         history.push({ role: "model", parts: [{ text: reply }] });

//         res.json({ reply, sessionId: currentSessionId });

//     } catch (err) {
//         console.error("❌ Gemini error:", err);
//         res.status(500).json({ error: "Gemini response error", details: err.message });
//     }
// });

// // --- Server Initialization with Data Fetching ---
// const PORT = process.env.PORT || 5000;

// async function startServer() {
//     console.log("⏳ Fetching initial data. Please wait...");
    
//     // Await all fetch operations to ensure data is loaded
//     await Promise.all([
//         fetchProductData(),
//         fetchReviewsData(),
//         fetchAdditionalData()
//     ]);
    
//     // Start the server only after all data is ready
//     app.listen(PORT, () => {
//         console.log(`✅ Chatbot (Gemini) running on http://localhost:${PORT}`);
//     });
// }

// // Call the async function to start the process
// startServer();
// ///pppppppppppppppppp