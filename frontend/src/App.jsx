import React, { useState } from 'react';

// Layout Components
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

// Context & Routes
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes'; // Ya aapka path jo ho (e.g. './AppRoutes')

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
        
        {/* Header */}
        <header className="bg-[#0c0a1d]/90 backdrop-blur-md sticky top-0 z-50 border-b border-purple-900/40 shadow-lg px-4 lg:px-8 py-2.5">
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </header>

        {/* Category Bar */}
        <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* Dynamic Routes */}
        <main className="flex-1">
          <AppRoutes searchQuery={searchQuery} selectedCategory={selectedCategory} />
        </main>

        {/* Footer & AI Assistant */}
        <Footer />
        <AIAssistant />
      </div>
    </CartProvider>
  );
}