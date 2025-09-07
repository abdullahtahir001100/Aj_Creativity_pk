import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';

// Import Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Details from "./pages/Details";
import Paymants from "./pages/Paymants";
import NotFound from "./components/NotFound";

// Import Dashboard & Admin Pages
import DashboardProtectedWrapper from "./components/DashboardProtectedWrapper";
import HomeDashboard from "./components/Dashboard";
import ProductDashboard from "./components/v1";
import VideoDashboard from "./components/VideoDashboard";
import OrderManagement from "./components/OrderManagement";

function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/details" element={<Details />} />
        <Route path="/paymants" element={<Paymants />} />
        
        {/* --- Protected Dashboard Routes --- */}
        <Route path="/dashboard" element={<DashboardProtectedWrapper />}>
          <Route index element={<HomeDashboard />} />
          <Route path="products" element={<ProductDashboard />} />
          <Route path="videos" element={<VideoDashboard />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>

        {/* --- Not Found Route --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;