import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import Home from '../pages/Home';
import Login from '../pages/login';
import Register from '../pages/register';
import Marketplace from '../pages/marketplace';
import ProductDetail from '../pages/ProductDetail';
import Onboarding from '../pages/Onboarding';
import Cart from '../pages/cart';
import Checkout from '../pages/Checkout';
import BuyerDashboard from '../pages/BuyerDashboard';
import SupplierDashboard from '../pages/supplierDashboard';
import Profile from '../pages/Profile';
import CustomerCare from '../pages/CustomerCare'; // <-- 1. HERE (Import)
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes({ searchQuery, selectedCategory }) {
  return (
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

      {/* Dedicated Support Route */}
      <Route path="/customer-care" element={<CustomerCare />} /> {/* <-- 2. HERE (Route) */}

      {/* Menu & Extra Navigation Routes */}
      <Route path="/orders" element={<BuyerDashboard />} />
      <Route path="/wishlist" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/lelobhai-zone" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/rewards" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/gift-cards" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/notifications" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/advertise" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/download-app" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />

      {/* Protected Routes */}
      <Route path="/supplier-dashboard" element={<ProtectedRoute allowedRole="SUPPLIER"><SupplierDashboard /></ProtectedRoute>} />
      <Route path="/buyer-dashboard" element={<ProtectedRoute allowedRole="BUYER"><BuyerDashboard /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}