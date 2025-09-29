import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';

// Import Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Blogs from "./pages/Blogs";
import Details from "./pages/Details";
import Paymants from "./pages/Paymants";
import NotFound from "./components/NotFound";
import ChatWidget from './components/ChatWidget';
// Import Dashboard & Admin Pages
import Dashboard from "./components/DashboardProtectedWrapper";

import BackToTopButton from "./components/BackToTopButton";

function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* === UPDATED LINE === */}
        <Route path="/product/:slug/:id" element={<Details />} />

        <Route path="/paymants" element={<Paymants />} />
        
        {/* --- Protected Dashboard Routes --- */}
        <Route path="/dashboard" element={<Dashboard />}>
        </Route>

        {/* --- Not Found Route --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BackToTopButton/>
      <ChatWidget />
    </HelmetProvider>
  );
}

export default App;