import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

// Auth Pages
import Login from './pages/login';
import Register from './pages/register';
import Onboarding from './pages/Onboarding';

// Core Pages
import Home from './pages/Home';
import Marketplace from './pages/marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/cart';
import Checkout from './pages/Checkout';

// Dashboards & Profile
import SupplierDashboard from './pages/supplierDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';

// Context & Protection
import { CartProvider, useCart } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Checkout Route Wrapper Component
function CheckoutPageWrapper() {
  const { cart, clearCart } = useCart();
  return <Checkout cart={cart} clearCart={clearCart} />;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('For You');

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
        
        {/* Sticky Header Bar */}
        <header className="bg-[#0c0a1d]/90 backdrop-blur-md sticky top-0 z-50 border-b border-purple-900/40 shadow-lg px-4 lg:px-8 py-2.5">
          <Navbar />
        </header>

        {/* Dynamic Category Navigation */}
        <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* Main Application Routes */}
        <main className="flex-1">
          <Routes>
            {/* Public Home & Browsing Routes */}
            <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/home" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/marketplace" element={<Marketplace selectedCategory={selectedCategory} />} />
            <Route path="/search" element={<Marketplace selectedCategory={selectedCategory} />} />
            <Route path="/products" element={<Marketplace selectedCategory={selectedCategory} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Quick Links Nav Redirections */}
            <Route path="/wishlist" element={<Marketplace selectedCategory={selectedCategory} />} />
            <Route path="/lelobhai-zone" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/rewards" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/gift-cards" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/notifications" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/customer-care" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/advertise" element={<Home selectedCategory={selectedCategory} />} />
            <Route path="/download-app" element={<Home selectedCategory={selectedCategory} />} />

            {/* Protected Buyer & User Routes */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRole="BUYER">
                  <BuyerDashboard />
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
              path="/order-details"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-details/:orderId"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPageWrapper />
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

            {/* Protected Supplier Routes */}
            <Route
              path="/supplier-dashboard"
              element={
                <ProtectedRoute allowedRole="SUPPLIER">
                  <SupplierDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback Route */}
            <Route path="*" element={<Home selectedCategory={selectedCategory} />} />
          </Routes>
        </main>

        {/* Global Footer & Floating AI Companion */}
        <Footer />
        <AIAssistant />
      </div>
    </CartProvider>
  );
}