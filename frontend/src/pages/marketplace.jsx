import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';
import InquiryModal from '../components/InquiryModal';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', 'Cotton', 'Silk', 'Polyester', 'Denim', 'Linen'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Filter Logic: Search Text & Selected Category dono check honge
  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">B2B Textile Marketplace</h1>
          <p className="text-slate-500 text-sm mt-1">Browse wholesale fabrics directly from verified suppliers</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search fabrics, materials..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl bg-white shadow-sm focus:outline-indigo-600 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={16} className="text-slate-500 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <p className="text-slate-500 font-medium">Koi product nahi mila!</p>
          <p className="text-slate-400 text-sm mt-1">Try changing your search term or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <div key={item._id} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100">
                    {item.category}
                  </span>
                  <span className="text-emerald-600 font-bold text-lg">
                    ₹{item.pricePerMeter} <span className="text-xs text-slate-500 font-normal">/ meter</span>
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-indigo-950 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>Min Order Quantity:</span>
                  <strong className="text-slate-700">{item.minOrderQty} meters</strong>
                </div>

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition">
                  Send Inquiry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}