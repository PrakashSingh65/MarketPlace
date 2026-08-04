import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ArrowRight, ShieldCheck, Truck, Sparkles, Building2, Layers } from 'lucide-react';
import Navbar from '../components/Navbar';
import InquiryModal from '../components/InquiryModal';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Cotton', 'Silk', 'Polyester', 'Denim', 'Linen'];

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <Navbar />

      {/* 🌟 HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-28 px-4">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-300 shadow-inner">
            <Sparkles size={14} className="text-indigo-400" />
            <span>India's Leading B2B Textile Sourcing Network</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight">
            Direct Mill Sourcing for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              Garment Brands & Wholesalers
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Eliminate middle-tier markups. Connect directly with verified fabric manufacturers, inspect verified GSM specifications, and request bulk price quotes in seconds.
          </p>

          {/* Quick Stats Grid */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-4 text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-white">500+</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Verified Mills</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-white">100%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Quality Inspected</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-white">₹0</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Brokerage Fees</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-white">24hr</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Supplier Quote Turnaround</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🛍️ MARKETPLACE MAIN SECTION */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        
        {/* Section Header + Search Control */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">Live Catalog</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Wholesale Fabrics</h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by fabric name, weave, or usage..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div id="categories" className="flex items-center gap-2 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 text-slate-400 mr-2 text-xs font-semibold uppercase tracking-wider">
            <Filter size={14} /> Filter:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/10 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
            <Layers className="mx-auto text-slate-300" size={48} />
            <h3 className="text-lg font-bold text-slate-800">No Fabrics Found</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              We couldn't find any materials matching your search query. Try clearing filters or searching for different terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <div 
                key={item._id} 
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100/80">
                      {item.category}
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-slate-900">₹{item.pricePerMeter}</span>
                      <span className="text-xs text-slate-400 block font-medium">/ meter</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Footer Details & Action */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">MOQ (Minimum Order):</span>
                    <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {item.minOrderQty} meters
                    </span>
                  </div>

                  <button
                    onClick={() => { setSelectedProduct(item); setIsModalOpen(true); }}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3 rounded-2xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                  >
                    <span>Request Bulk Quote</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 💼 HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-white py-20 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Simple Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How TexMarket B2B Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto font-bold text-lg shadow-md shadow-indigo-200">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Browse Verified Catalogs</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter through hundreds of fabric specifications directly listed by verified textile mills.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto font-bold text-lg shadow-md shadow-indigo-200">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">Submit Requirement (RFQ)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Send quantity specifications and delivery deadlines directly to the manufacturer.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto font-bold text-lg shadow-md shadow-indigo-200">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">Direct Negotiation</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive wholesale pricing quotes and sample shipment details directly on your supplier portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}