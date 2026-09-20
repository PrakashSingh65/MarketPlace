import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, ShieldCheck, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import useCart from '../hooks/useCart';
import { useGetProducts } from '../api/productApi';
import { setCategoryFilter, setSearchKeyword } from '../redux/slice/productSlice';

export default function Marketplace({ selectedCategory }) {
  const { addToCart } = useCart();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    dispatch(setSearchKeyword(searchQuery));
  }, [searchQuery, dispatch]);

  useEffect(() => {
    const categoryToSet =
      !selectedCategory || selectedCategory === 'For You' ? '' : selectedCategory;
    dispatch(setCategoryFilter(categoryToSet));
  }, [selectedCategory, dispatch]);

  const filters = useSelector((state) => state.productUI.filters);
  const { data, isLoading, isError, error } = useGetProducts(filters);

  const products = data?.products || (Array.isArray(data) ? data : []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.title || 'Product'} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-white space-y-3">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading verified mill catalog...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-red-400 bg-red-950/20 border border-red-800/30 rounded-2xl my-8">
        <p className="text-base font-bold">Error loading marketplace inventory</p>
        <p className="text-xs text-slate-400 mt-1">{error?.message || 'Please check backend connection'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-900/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Fabric Marketplace</h1>
            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              B2B Wholesale
            </span>
          </div>
          {filters.keyword && (
            <p className="text-xs text-amber-400 mt-1">
              Search results for: <span className="font-semibold text-white">"{filters.keyword}"</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/categories"
            className="text-xs font-semibold px-3 py-1.5 bg-purple-950/60 border border-purple-800/40 hover:border-purple-600 text-purple-300 rounded-xl transition flex items-center gap-1.5"
          >
            <Layers size={13} /> View Categories
          </Link>
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            Showing <strong className="text-white">{products.length}</strong> items
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => {
            const productId = product._id || product.id;
            const itemPrice = product.price ?? product.pricePerMeter ?? 0;
            const fallbackImg = 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800';

            return (
              <div
                key={productId}
                className="bg-[#0f0c1b]/90 border border-purple-900/40 rounded-2xl overflow-hidden shadow-xl hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] transition duration-300 flex flex-col justify-between group"
              >
                <Link to={`/product/${productId}`} className="block relative">
                  <div className="h-52 w-full overflow-hidden bg-slate-900 relative">
                    <img
                      src={product.image || product.images?.[0] || fallbackImg}
                      alt={product.title || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#070714]/80 backdrop-blur-md border border-purple-500/30 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {product.category || 'Fabric'}
                    </span>
                    {product.gsm && (
                      <span className="absolute bottom-2.5 right-2.5 bg-purple-950/90 text-purple-200 border border-purple-800/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                        {product.gsm} GSM
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-100 line-clamp-2 group-hover:text-orange-400 transition">
                      {product.title || product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
                      <span>MOQ: {product.moq || 50} m</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-4 pt-0 flex justify-between items-center mt-2 border-t border-purple-900/30">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Per Meter</span>
                    <span className="font-black text-orange-400 text-base">
                      ₹{itemPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    <ShoppingCart size={14} /> Add
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 bg-[#0f0c1b]/60 border border-purple-900/40 rounded-3xl space-y-3">
            <p className="text-slate-300 text-base font-semibold">
              No products found {filters.keyword && <span>matching <span className="text-orange-400">"{filters.keyword}"</span></span>}
            </p>
            <p className="text-xs text-slate-500">
              Try searching for general textile keywords like "Cotton", "Denim", or clear your filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}