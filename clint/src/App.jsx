import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import ScrollToTop from "./ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Details from "./pages/Details";
import Paymants from "./pages/Paymants";
import Dashboard from "./components/Dashboard"; // Dashboard component
import NotFound from "./components/NotFound"; 

import RightClickBlocker from "./components/RightClickBlocker";
import Loader from "./components/loader";
import BackToTopButton from "./components/BackToTopButton";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader on route change
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <RightClickBlocker message="✨ For your best browsing experience, right-click is disabled on this website. Thank you for understanding 🙏" /> */}

          <ScrollToTop />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Product" element={<Product />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Blogs" element={<Blogs />} />
            <Route path="/Paymants" element={<Paymants />} />
            <Route path="/Details" element={<Details />} />
            <Route path="/Dashboard" element={<Dashboard />} /> {/* New route */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <BackToTopButton />
        </>
      )}
    </>
  );
}

export default App;
