import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Footer from './components/Footer';
import Login from './pages/login';
import Register from './pages/register';
import Marketplace from './pages/marketplace';
import SupplierDashboard from './pages/supplierDashboard';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AIAssistant from './components/AIAssistant';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import { CartProvider } from './context/CartContext';
import Cart from './pages/cart';
import Checkout from './pages/Checkout';
import BuyerDashboard from './pages/BuyerDashboard';

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Register />} /> {/* Alias for /signup */}
            
            {/* Product & Marketplace Routes */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/products" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/cart" element={<Cart />} />

            {/* Placeholder/Fallback Routes for Dropdown Links */}
            <Route path="/orders" element={<BuyerDashboard />} />
            <Route path="/wishlist" element={<Marketplace />} />
            <Route path="/plus-zone" element={<Home />} />
            <Route path="/rewards" element={<Home />} />
            <Route path="/gift-cards" element={<Home />} />
            <Route path="/notifications" element={<Home />} />
            <Route path="/customer-care" element={<Home />} />
            <Route path="/advertise" element={<Home />} />
            <Route path="/download-app" element={<Home />} />

            {/* 🔒 Supplier Route */}
            <Route
              path="/supplier-dashboard"
              element={
                <ProtectedRoute allowedRole="SUPPLIER">
                  <SupplierDashboard />
                </ProtectedRoute>
              }
            />

            {/* 🔒 Buyer Route */}
            <Route
              path="/buyer-dashboard"
              element={
                <ProtectedRoute allowedRole="BUYER">
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch All Unknown Routes */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>

        <Footer />
        <AIAssistant />
      </div>
    </CartProvider>
  );
}