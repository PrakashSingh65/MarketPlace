import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Apne AuthContext ka sahi path dein

export default function ProtectedRoute({ children, allowedRole }) {
  const auth = useContext(AuthContext);

  // 1. Agar AuthContext state abhi load ho raha hai
  if (auth?.loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading authentication...
      </div>
    );
  }

  // LocalStorage se fallback check (agar context reset ho raha ho)
  const token = auth?.token || localStorage.getItem('token');
  const user = auth?.user || JSON.parse(localStorage.getItem('user') || '{}');

  // 2. Agar user logged in nahi hai -> Login page par bhej dein
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Role check (SUPPLIER / BUYER)
  if (allowedRole && user?.role?.toUpperCase() !== allowedRole.toUpperCase()) {
    // Agar role match nahi karta
    return <Navigate to="/" replace />;
  }

  return children;
}