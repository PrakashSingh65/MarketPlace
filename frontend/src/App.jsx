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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Main Navbar */}
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Categories Sub-Navbar */}
        <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Register />} />

            {/* Product & Marketplace Routes */}
            <Route path="/marketplace" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/products" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/cart" element={<Cart />} />

            {/* Menu Dropdown Routes */}
            <Route path="/orders" element={<BuyerDashboard />} />
            <Route path="/wishlist" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/lelobhai-zone" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/rewards" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/gift-cards" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/notifications" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/customer-care" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/advertise" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
            <Route path="/download-app" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />

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

            {/* Checkout Route */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            
            {/* Profile & Account Routes */}
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
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>

        <Footer />
        <AIAssistant />
      </div>
    </CartProvider>
  );
}