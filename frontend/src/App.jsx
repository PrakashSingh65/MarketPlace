import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Login from './pages/login';
import Register from './pages/register';
import Marketplace from './pages/marketplace';
import SupplierDashboard from './pages/supplierDashboard';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/supplier-dashboard" element={<ProtectedRoute allowedRole="SUPPLIER"><SupplierDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}