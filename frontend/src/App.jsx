import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
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
  const [selectedCategory, setSelectedCategory] = useState('For You');

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        
        {/* Top Header */}
        <header className="bg-[#0c0a1d]/90 backdrop-blur-md sticky top-0 z-50 border-b border-purple-900/40 shadow-lg px-4 lg:px-8 py-2.5">
          <Navbar />
        </header>

        {/* Category Navigation Bar */}
        <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        <main className="flex-1">
          <Routes>
            {/* Primary Marketplace & Search Routes */}
            <Route path="/" element={<Marketplace selectedCategory={selectedCategory} />} />
            <Route path="/marketplace" element={<Marketplace selectedCategory={selectedCategory} />} />
            <Route path="/search" element={<Marketplace selectedCategory={selectedCategory} />} />
            <Route path="/products" element={<Marketplace selectedCategory={selectedCategory} />} />

            {/* Other Pages */}
            <Route path="/home" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Register />} />

            {/* Product Details & Cart */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Account & Orders Dropdown Routes */}
            <Route path="/orders" element={<BuyerDashboard />} />
            <Route path="/wishlist" element={<Marketplace selectedCategory={selectedCategory} />} />
            <Route path="/lelobhai-zone" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/rewards" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/gift-cards" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/notifications" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/customer-care" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/advertise" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/download-app" element={<Home selectedCategory={selectedCategory} />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/supplier-dashboard"
              element={
                <ProtectedRoute allowedRole="SUPPLIER">
                  <SupplierDashboard />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Marketplace selectedCategory={selectedCategory} />} />
          </Routes>
        </main>

        <Footer />
        <AIAssistant />
      </div>
    </CartProvider>
  );
}