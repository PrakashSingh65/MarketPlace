import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Auth Pages (Ensure casing matches your actual filenames)
import Login from './pages/login';
import Register from './pages/register';
import Onboarding from './pages/Onboarding';

// Core Pages
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Marketplace from './pages/marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/cart';
import Checkout from './pages/Checkout';

// Dashboards & Support
import SupplierDashboard from './pages/supplierDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import CustomerCare from './pages/CustomerCare';

// Context & Protection
import { useCart } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Wrapper for Checkout context props
function CheckoutPageWrapper() {
  const { cart, clearCart } = useCart();
  return <Checkout cart={cart} clearCart={clearCart} />;
}

export default function AppRoutes({ searchQuery, selectedCategory }) {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/marketplace" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/search" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/products" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/customer-care" element={<CustomerCare />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Navigation Redirections */}
      <Route path="/wishlist" element={<Marketplace searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/lelobhai-zone" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/rewards" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/gift-cards" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/notifications" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/advertise" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />
      <Route path="/download-app" element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} />

      {/* Protected Routes */}
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
        path="/supplier-dashboard"
        element={
          <ProtectedRoute allowedRole="SUPPLIER">
            <SupplierDashboard />
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

      {/* 404 Fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}