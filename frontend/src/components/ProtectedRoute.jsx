import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, token } = useContext(AuthContext);

  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

   
  if (allowedRole && user.role !== allowedRole) {
    alert(`Access Denied! Only ${allowedRole}s can access this page.`);
    return <Navigate to="/" replace />;
  }

  
  return children;
}