import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Auth Pages
import Login from '../pages/login';
import Register from '../pages/register';
import Onboarding from '../pages/Onboarding';

// Core Pages
import Home from '../pages/Home';
import LandingPage from '../pages/LandingPage';
import Marketplace from '../pages/marketplace';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/cart';
import Checkout from '../pages/Checkout';

// Dashboards & Support
import SupplierDashboard from '../pages/supplierDashboard';
import BuyerDashboard from '../pages/BuyerDashboard';
import OrderDetails from '../pages/OrderDetails';
import Profile from '../pages/Profile';
import CustomerCare from '../pages/CustomerCare';

// Context & Protection
import { useCart } from '../context/CartContext';
import ProtectedRoute from '../components/ProtectedRoute';
import App from '../App';


// Checkout context wrapper
function CheckoutPageWrapper() {
  const { cart, clearCart } = useCart();

  return <Checkout cart={cart} clearCart={clearCart} />;
}


const router = createBrowserRouter([
  // =========================
  // Public Pages
  // =========================
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <LandingPage/>,
      },
      {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/marketplace',
    element: <Marketplace />,
  },
  {
    path: '/search',
    element: <Marketplace />,
  },
  {
    path: '/products',
    element: <Marketplace />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/customer-care',
    element: <CustomerCare />,
  },


  // =========================
  // Auth Pages
  // =========================
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/signup',
    element: <Register />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },


  // =========================
  // Navigation Pages
  // =========================
  {
    path: '/wishlist',
    element: <Marketplace />,
  },
  {
    path: '/lelobhai-zone',
    element: <Home />,
  },
  {
    path: '/rewards',
    element: <Home />,
  },
  {
    path: '/gift-cards',
    element: <Home />,
  },
  {
    path: '/notifications',
    element: <Home />,
  },
  {
    path: '/advertise',
    element: <Home />,
  },
  {
    path: '/download-app',
    element: <Home />,
  },


  // =========================
  // Protected Routes
  // =========================
  {
    path: '/orders',
    element: (
      <ProtectedRoute allowedRole="BUYER">
        <BuyerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/buyer-dashboard',
    element: (
      <ProtectedRoute allowedRole="BUYER">
        <BuyerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/supplier-dashboard',
    element: (
      <ProtectedRoute allowedRole="SUPPLIER">
        <SupplierDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/order-details',
    element: (
      <ProtectedRoute>
        <OrderDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/order-details/:orderId',
    element: (
      <ProtectedRoute>
        <OrderDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <CheckoutPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/account',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },


  // =========================
  // 404
  // =========================
  {
    path: '*',
    element: <LandingPage />,
  },
    ]
  },
]);


export default router