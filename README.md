Yeh ek premium, high-performance e-commerce solution hai jo modern JavaScript ecosystem par build kiya gaya hai. Isme focus Security (HSTS), Interactive Maps (Leaflet), aur Smooth UX (AOS) par hai.

🛠 Technical Stack
Frontend: React.js (Vite) — For ultra-fast development and bundling.

Routing: React Router 6 — Dynamic and nested routing architecture.

Backend: Express.js (Node.js) — RESTful API for seamless data flow.

Database: MongoDB — NoSQL database for flexible product schemas.

Styling & Motion: SCSS, Tailwind CSS & AOS (Animate On Scroll).

Mapping: Leaflet 1.9.4 — Integrated maps for store locations/tracking.

Deployment: Vercel (Frontend) & Linux-based environment.

✨ Key Features & Security
Interactive Maps: Leaflet 1.9.4 ka use karke custom store markers aur location tracking.

Advanced Animations: AOS library se scroll-based elegant entry animations.

Security (HSTS): HTTP Strict Transport Security implementation taaki connection hamesha secure rahe.

Dynamic Routing: React Router 6 ke saath optimized navigation aur protected routes.

Database Scalability: MongoDB ka use karke complex jewelry categories aur attributes ka management.

Responsive UI: Fully optimized for mobile, tablet, and desktop screens.

📂 Project Architecture
Plaintext
├── client/             # Vite + React Frontend
│   ├── src/
│   │   ├── components/ # Leaflet Maps, Navbar, Cart
│   │   ├── pages/      # Home, Product, Checkout
│   │   └── hooks/      # Custom React hooks
├── server/             # Express.js Backend
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API Endpoints
│   └── middleware/     # Security (HSTS) & Auth
└── README.md           # Documentation
💡 Engineering Highlights
Vite Speed: Webpack ke muqable Vite ka use karke build time ko 60% tak optimize kiya.

Map Integration: Custom GeoJSON data ko Leaflet ke saath handle kiya for precise location rendering.

Security First: HSTS aur secure headers apply karke user data ko protect kiya.

PaaS Deployment: Vercel par frontend deploy karke CI/CD pipeline setup ki.

🚀 How to Run
Backend:

Bash
cd server
npm install
npm start
Frontend:

Bash
cd client
npm install
npm run dev
🔗 Live Portfolio
See it in action:
portfolio.abdullahtahir.me
