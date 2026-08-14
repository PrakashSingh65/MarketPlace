import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Footer from './components/Footer';
import Login from './pages/login';
import Register from './pages/register';
import Marketplace from './pages/marketplace';
import SupplierDashboard from './pages/supplierDashboard';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import AIAssistant from './components/AIAssistant';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import { CartProvider } from './context/CartContext';
import Cart from './pages/cart';
import Checkout from './pages/Checkout';
import BuyerDashboard from './pages/BuyerDashboard';

// Marketplace Home Grid Component
import MarketplaceHome from './components/MarketplaceHome';

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main className="flex-1">
          <Routes>
            {/* 🌐 Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/marketplace-home" element={<MarketplaceHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* 🛒 Cart Page */}
            <Route path="/cart" element={<Cart />} />

            {/* 🔓 Unprotected Dashboard Routes (For Testing) */}
            <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />

            {/* 404 Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>

        {/* Global Footer & AI Bot */}
        <Footer />
        <AIAssistant />
      </div>
    </CartProvider>
  );
}