import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, token, loading } = useAuth();

  // Page refresh hone par jab tak Auth state verify ho rahi hai, blank/loader dikhayein
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">
        Loading session...
      </div>
    );
  }

  // 1. Unauthenticated Users: Redirect to Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role Verification & Unauthorized Redirection
  if (allowedRole && user.role?.toUpperCase() !== allowedRole.toUpperCase()) {
    const userRole = user.role?.toUpperCase();

    if (userRole === 'SUPPLIER') {
      return <Navigate to="/supplier-dashboard" replace />;
    } else {
      // Buyer Target Route
      return <Navigate to="/marketplace" replace />; // Ya '/buyer-dashboard'
    }
  }

  // 3. Authorized Access Granted
  return children;
}