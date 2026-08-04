import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/login';
import Register from'./pages/register';
import Marketplace from './pages/marketplace';
import SupplierDashboard from './pages/supplierDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold text-center mt-10">Welcome to B2B Textile Marketplace!</h1>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}