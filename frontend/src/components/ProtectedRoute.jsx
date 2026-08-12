import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); // Ya auth token jo aap use kar rahe ho

  // Agar token nahi hai, toh seedha Login Page par bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar logged in hai, toh protected routes (e.g. Cart) render hone do
  return <Outlet />;
};

export default ProtectedRoute;