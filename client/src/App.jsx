import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

// Layout Components
import Navbar from './components/navbar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

// Context
import { CartProvider } from './context/CartContext';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
        
        {/* Header / Navbar */}
        <header className="bg-[#0c0a1d]/90 backdrop-blur-md sticky top-0 z-50 border-b border-purple-900/40 shadow-lg">
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </header>

        {/* Category Navigation Bar */}
        <CategoryBar 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />

        {/* Dynamic Route Pages Render Here */}
        <main className="flex-1">
          <Outlet context={{ searchQuery, selectedCategory }} />
        </main>

        {/* Global Footer & Floating AI Assistant */}
        <Footer />
        <AIAssistant />
        
      </div>
    </CartProvider>
  );
}