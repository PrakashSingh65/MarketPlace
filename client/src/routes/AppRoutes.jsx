import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Auth Pages
import Login from "@/pages/login";
import Register from "@/pages/register";
import Onboarding from "@/pages/Onboarding";

// Core Pages
import Home from "@/pages/Home";
import LandingPage from "@/pages/LandingPage";
import Marketplace from "@/pages/marketplace";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/Checkout";

// Dashboards & Support
import SupplierDashboard from "@/pages/supplierDashboard";
import BuyerDashboard from "@/pages/BuyerDashboard";
import OrderDetails from "@/pages/OrderDetails";
import Profile from "@/pages/Profile";
import CustomerCare from "@/pages/CustomerCare";

import App from "@/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "signup", element: <Register /> },
      { path: "onboarding", element: <Onboarding /> },
      { path: "home", element: <Home /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "search", element: <Marketplace /> },
      { path: "products", element: <Marketplace /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "customer-care", element: <CustomerCare /> },
      { path: "wishlist", element: <Marketplace /> },
      { path: "orders", element: <BuyerDashboard /> },
      { path: "buyer-dashboard", element: <BuyerDashboard /> },
      { path: "supplier-dashboard", element: <SupplierDashboard /> },
      { path: "order-details", element: <OrderDetails /> },
      { path: "order-details/:orderId", element: <OrderDetails /> },
      { path: "checkout", element: <Checkout /> },
      { path: "profile", element: <Profile /> },
      { path: "account", element: <Profile /> },
      { path: "*", element: <LandingPage /> },
    ],
  },
]);

export default router;