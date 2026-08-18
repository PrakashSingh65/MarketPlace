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
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes({ searchQuery, selectedCategory }) {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Register />} />

      {/* Products & Shopping */}
      <Route path="/marketplace" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/products" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/cart" element={<Cart />} />

      {/* Protected Routes */}
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* Dashboards */}
      <Route path="/buyer-dashboard" element={<ProtectedRoute allowedRole="BUYER"><BuyerDashboard /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute allowedRole="BUYER"><BuyerDashboard /></ProtectedRoute>} />
      <Route path="/supplier-dashboard" element={<ProtectedRoute allowedRole="SUPPLIER"><SupplierDashboard /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}