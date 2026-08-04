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
import profile from './pages/profile';
import Onbording from './pages/Onboarding';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 from-slate-50 to-slate-100 text-slate-800 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/supplier-dashboard" element={<ProtectedRoute allowedRole="SUPPLIER"><SupplierDashboard /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><profile /></ProtectedRoute>} />
          <Route path="/onboarding" element={<Onbording />} />
        </Routes>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}