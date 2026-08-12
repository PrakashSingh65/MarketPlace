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
import { CartProvider } from './context/cartContext';
import Cart from './pages/cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrder';
import BuyerDashboard from './pages/BuyerDashboard';

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50 from-slate-50 to-slate-100 text-slate-800 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* 🌐 Public Routes (Koi bhi open kar sakta hai) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* 🔒 Protected Supplier Routes */}
            <Route
              path="/supplier-dashboard"
              element={
                <ProtectedRoute allowedRole="SUPPLIER">
                  <SupplierDashboard />
                </ProtectedRoute>
              }
            />

            {/* 🔒 Protected Buyer & User Routes (Logout hone par login page redirect karenge) */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer-dashboard"
              element={
                <ProtectedRoute>
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
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
              path="/orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
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

            {/* 404 Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
        <AIAssistant />
      </div>
    </CartProvider>
  );
}