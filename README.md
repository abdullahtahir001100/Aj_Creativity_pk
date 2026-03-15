# AJ Creativity — Jave Handmade Jewelry Store

A full-stack e-commerce platform for **Jave Handmade**, a Pakistani handmade jewelry brand. The project includes a React frontend, multiple Node.js/Express backend services, an AI-powered chatbot, a blog system, and an admin dashboard.

🌐 **Live Site:** [www.javehandmade.store](https://www.javehandmade.store)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Modules](#modules)
  - [clint — Frontend](#clint--frontend)
  - [backend — Products & Auth API](#backend--products--auth-api)
  - [server — Orders & Dashboard API](#server--orders--dashboard-api)
  - [main — Products/Videos Dashboard API](#main--productsvideos-dashboard-api)
  - [chat — AI Chatbot Server](#chat--ai-chatbot-server)
  - [blog — Blog API](#blog--blog-api)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contact](#contact)

---

## Project Overview

AJ Creativity is an online store for handmade jewelry. Customers can browse products, read blogs, add items to their cart, place orders, track order status, and interact with an AI-powered customer support chatbot. An admin dashboard enables product, blog, video, and order management.

---

## Project Structure

```
Aj_Creativity_pk/
├── clint/          # React frontend (Vite) — directory name is "clint"
├── backend/        # Products & auth REST API (Express + MongoDB)
├── server/         # Orders & admin dashboard API (Express + MongoDB)
├── main/           # Products/videos dashboard API (Express + MongoDB)
├── chat/           # AI chatbot server (Express + Google Gemini)
└── blog/           # Blog CRUD API (Express + MongoDB)
```

---

## Features

- 🛍️ **Product Catalog** — Browse, filter, and view detailed jewelry listings
- 🛒 **Shopping Cart** — Add/remove products, manage quantities
- 💳 **Checkout & Payments** — Stripe-powered secure payment processing
- 📦 **Order Management** — Place orders, track status, request cancellations
- 🤖 **AI Chatbot** — Gemini-powered assistant with live product knowledge
- 📝 **Blog** — Read and manage jewelry-related blog posts
- 📊 **Admin Dashboard** — Protected panel for managing products, orders, blogs, and videos
- 🗺️ **Store Locator** — Interactive map via Leaflet
- 📧 **Contact Form** — Email inquiries via EmailJS / Formspree
- 🔐 **Admin Auth** — JWT-based login protecting the dashboard
- ☁️ **Cloud Image Storage** — All images stored on Cloudinary
- 📱 **Responsive Design** — Mobile-first with Tailwind CSS, MUI, and Bootstrap

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Tailwind CSS, MUI v7, Bootstrap 5, Framer Motion, AOS |
| Payments | Stripe (`@stripe/react-stripe-js`) |
| Maps | Leaflet + React Leaflet |
| Email | EmailJS, Formspree |
| Backend APIs | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Image Storage | Cloudinary + Multer |
| Authentication | JSON Web Tokens (JWT) |
| AI Chatbot | Google Generative AI (Gemini 1.5 Flash) |
| Charts | Recharts |
| Deployment | Vercel (all services) |

---

## Modules

### `clint` — Frontend

> **Note:** The directory is named `clint` (the actual folder name in the repository).

The main customer-facing React application.

**Pages:**

| Route | Page |
|---|---|
| `/` | Home — hero, featured products, videos |
| `/product` | Product catalog with filters |
| `/product/:slug/:id` | Product detail page |
| `/cart` | Shopping cart |
| `/paymants` | Checkout & payment (route name as defined in the codebase) |
| `/blogs` | Blog listing |
| `/about` | About the brand |
| `/contact` | Contact form & map |
| `/dashboard` | Admin dashboard (protected) |

**Key Components:**
- `ChatWidget` — Floating AI chatbot
- `Dashboard` / `DashboardProtectedWrapper` — Admin panel with login guard
- `Header` / `Footer` — Site navigation
- `SEOMetadata` — Dynamic SEO via React Helmet

**Start (development):**
```bash
cd clint
npm install
npm run dev
```

**Build:**
```bash
npm run build
```

---

### `backend` — Products & Auth API

REST API for product CRUD operations and admin authentication.

**Tech:** Node.js, Express, MongoDB, Mongoose, Cloudinary, Multer, JWT

**Start:**
```bash
cd backend
npm install
npm run dev   # nodemon
# or
npm start
```

**Required `.env`:**
```
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JWT_SECRET=
PORT=5000
```

---

### `server` — Orders & Dashboard API

Manages customer orders and provides metrics for the admin dashboard.

**Tech:** Node.js, Express, MongoDB, Mongoose

**Start:**
```bash
cd server
npm install
npm start
```

**Required `.env`:**
```
MONGODB_URI=
PORT=5000
```

---

### `main` — Products/Videos Dashboard API

Manages product listings (with placement options) and promotional videos.

**Tech:** Node.js, Express, MongoDB, Mongoose, Cloudinary

**Start:**
```bash
cd main
npm install
npm start
```

**Required `.env`:**
```
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=5000
```

---

### `chat` — AI Chatbot Server

AI-powered customer support bot using Google Gemini 1.5 Flash. Fetches live product, review, and store data at startup to answer customer questions in context.

**Tech:** Node.js, Express, Google Generative AI (`@google/generative-ai`)

**Start:**
```bash
cd chat
npm install
npm start
```

**Required `.env`:**
```
GEMINI_API_KEY=
PORT=5000
```

---

### `blog` — Blog API

Backend service for creating, reading, updating, and deleting blog posts with Cloudinary image support.

**Tech:** Node.js, Express, MongoDB, Mongoose, Cloudinary, Multer

**Start:**
```bash
cd blog
npm install
npm run dev   # nodemon
# or
npm start
```

**Required `.env`:**
```
MONGO_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=5000
```

---

## Environment Variables

Each module requires its own `.env` file in its directory. **Never commit `.env` files.** Refer to the per-module sections above for the required keys.

| Variable | Used In |
|---|---|
| `MONGODB_URI` / `MONGO_URI` | backend, server, main, blog |
| `CLOUDINARY_CLOUD_NAME` | backend, main, blog |
| `CLOUDINARY_API_KEY` | backend, main, blog |
| `CLOUDINARY_API_SECRET` | backend, main, blog |
| `JWT_SECRET` | backend |
| `GEMINI_API_KEY` | chat |
| `PORT` | all backend services |

---

## Installation & Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google AI Studio API key (for chatbot)
- Stripe account (for payments)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdullahtahir001100/Aj_Creativity_pk.git
   cd Aj_Creativity_pk
   ```

2. **Set up each service** — create a `.env` file in each directory using the variables listed above, then install dependencies and start:

   ```bash
   # Frontend
   cd clint && npm install && npm run dev

   # Backend API (products & auth)
   cd ../backend && npm install && npm run dev

   # Orders API
   cd ../server && npm install && npm start

   # Products/Videos API
   cd ../main && npm install && npm start

   # Blog API
   cd ../blog && npm install && npm run dev

   # Chatbot
   cd ../chat && npm install && npm start
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

### Products & Auth (`backend`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `POST` | `/api/products/add` | Add a new product |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |
| `POST` | `/api/auth/login` | Admin login (returns JWT) |

### Orders & Dashboard (`server`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders` | Get all orders (admin) |
| `GET` | `/api/orders/:id` | Get a single order |
| `PATCH` | `/api/orders/:id/cancel-request` | Customer requests cancellation |
| `PATCH` | `/api/orders/:id/complete` | Admin marks order complete |
| `PATCH` | `/api/orders/:id/cancel` | Admin cancels order |
| `PATCH` | `/api/orders/:id/revert-to-pending` | Admin rejects cancellation |
| `DELETE` | `/api/orders/:id` | Admin deletes order |
| `GET` | `/api/dashboard-metrics` | Aggregated analytics data |

### Blog (`blog`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/blogs` | Get all blog posts |
| `POST` | `/api/blogs` | Create a blog post |
| `PUT` | `/api/blogs/:id` | Update a blog post |
| `DELETE` | `/api/blogs/:id` | Delete a blog post |

### Chatbot (`chat`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Send a message; receive AI reply |

---

## Deployment

All services are deployed on **Vercel** using `vercel.json` configuration files in each module directory. The frontend (`clint`) is deployed as a static Vite build; backend services are deployed as serverless Node.js functions.

**Allowed origins for CORS:** `https://www.javehandmade.store` and `http://localhost:5173`.

---

## Contact

For custom jewelry orders or any inquiries, reach out to the owner of **Jave Handmade** directly:

- 📱 **WhatsApp / Phone:** [+92 347 8708641](https://wa.me/923478708641)
- 📧 **Email:** [at4105168@gmail.com](mailto:at4105168@gmail.com)
- 🌐 **Website:** [www.javehandmade.store](https://www.javehandmade.store)
