import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, token } = useContext(AuthContext);

  // Agar user logged in nahi hai -> Login page par bhej do
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Agar role required hai aur match nahi karta
  if (allowedRole && user.role?.toUpperCase() !== allowedRole.toUpperCase()) {
    // Supplier ko Supplier dashboard aur Buyer ko Buyer dashboard redirect kar do
    if (user.role?.toUpperCase() === 'SUPPLIER') {
      return <Navigate to="/supplier-dashboard" replace />;
    } else {
      return <Navigate to="/buyer-dashboard" replace />;
    }
  }

  return children;
}