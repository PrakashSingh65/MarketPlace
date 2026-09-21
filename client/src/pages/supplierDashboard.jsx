import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Plus, Package, PackagePlus, RefreshCw, Trash2, 
  ExternalLink, Layers, Search, X, Tag, 
  AlertCircle, Upload, Check
} from 'lucide-react';
import { useGetProducts, useAddProduct, useDeleteProduct } from '../api/productApi';
import { toggleAddProductModal } from '../redux/slice/productSlice';

const CATEGORY_MAP = {
  cotton: ["Combed Cotton", "Poplin", "Cambric", "Slub Cotton", "Organic Cotton"],
  denim: ["Indigo Twill", "Ring Spun Denim", "Chambray", "Stretch Denim"],
  silk: ["Mulberry Silk", "Crepe Silk", "Banarasi Brocade", "Raw Silk"],
  linen: ["European Flax", "Organic Slub", "Cotton Linen Blend"],
  knits: ["French Terry", "Single Jersey", "Rib Knit", "Interlock"],
  polyester: ["Microfiber", "Recycled Poly", "Poly-Spandex"],
  fashion: ["Men's Wear", "Women's Wear", "Kids Wear", "Footwear"],
  mobiles: ["iPhone", "Vivo", "OPPO", "POCO", "Redmi", "Samsung", "realme", "Nothing", "Google", "Motorola"],
  electronics: ["Laptops", "Headphones", "Smartwatches", "Monitors"],
  beauty: ["Skincare", "Makeup", "Haircare"],
  home: ["Furniture", "Decor", "Kitchen"],
  appliances: ["TVs", "Refrigerators", "Washing Machines"],
  toys: ["Action Figures", "Board Games"],
  food: ["Snacks", "Beverages"],
  auto: ["Car Accessories", "Bike Accessories"],
  sports: ["Fitness Gear", "Outdoor Sports"],
  furniture: ["Living Room", "Bedroom"],
  books: ["Fiction", "Non-Fiction"],
  "2wheelers": ["Electric Scooters", "Bikes"]
};

export default function SupplierDashboard() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  // Dual-support modal state: local state + Redux for instant reactivity
  const reduxModalOpen = useSelector((state) => state.productUI?.isAddProductModalOpen ?? false);
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const isModalOpen = localModalOpen || reduxModalOpen;

  const { data: fetchedData, isLoading, isError, error, refetch } = useGetProducts();
  const products = useMemo(() => {
    return Array.isArray(fetchedData) ? fetchedData : fetchedData?.products || [];
  }, [fetchedData]);

  const addProductMutation = useAddProduct();
  const deleteProductMutation = useDeleteProduct();

  // Search and filter state for product catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('all');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('cotton');
  const [subCategory, setSubCategory] = useState(CATEGORY_MAP['cotton'][0] || '');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('50');
  const [stock, setStock] = useState('100');
  const [gsm, setGsm] = useState('');
  const [composition, setComposition] = useState('');
  const [colors, setColors] = useState('');
  
  // Multi-image upload state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean up object URLs on unmount or preview changes
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    const subList = CATEGORY_MAP[selectedCat] || [];
    setSubCategory(subList.length > 0 ? subList[0] : '');
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validFiles = selectedFiles.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      toast.error('Please select valid image files (JPG, PNG, WEBP)');
      return;
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagePreviews((prev) => {
      const urlToRemove = prev[indexToRemove];
      if (urlToRemove && urlToRemove.startsWith('blob:')) {
        URL.revokeObjectURL(urlToRemove);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('cotton');
    setSubCategory(CATEGORY_MAP['cotton'][0] || '');
    setPrice('');
    setMoq('50');
    setStock('100');
    setGsm('');
    setComposition('');
    setColors('');
    imagePreviews.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleOpenModal = () => {
    setLocalModalOpen(true);
    if (!reduxModalOpen) {
      dispatch(toggleAddProductModal());
    }
  };

  const handleCloseModal = () => {
    setLocalModalOpen(false);
    if (reduxModalOpen) {
      dispatch(toggleAddProductModal());
    }
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanTitle = (title || '').trim();
    if (!cleanTitle) {
      toast.error('Please enter a product title');
      return;
    }

    const cleanPrice = Number(price);
    if (isNaN(cleanPrice) || cleanPrice <= 0) {
      toast.error('Please enter a valid price per meter');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', cleanTitle);
      formData.append('description', (description || '').trim());
      formData.append('category', category || 'cotton');
      formData.append('subCategory', subCategory || '');
      formData.append('price', cleanPrice);
      formData.append('pricePerMeter', cleanPrice);
      formData.append('moq', Number(moq) || 50);
      formData.append('stock', Number(stock) || 50);
      formData.append('stockMeters', Number(stock) || 50);

      if (gsm) formData.append('gsm', gsm);
      if (composition) formData.append('composition', composition);
      
      if (colors) {
        colors
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
          .forEach((c) => formData.append('colors', c));
      }

      // Multi-image upload: append all selected photos
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
      // Also append primary file under 'image' for backwards compatibility
      if (imageFiles[0]) {
        formData.append('image', imageFiles[0]);
      }

      await addProductMutation.mutateAsync(formData);

      // Invalidate queries and refetch to immediately display the new product
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await refetch();

      toast.success('Product uploaded and added to catalog successfully!');
      handleCloseModal();
    } catch (err) {
      console.error("Submit error:", err);
      const msg = err.response?.data?.message || err?.message || 'Failed to upload product';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProductMutation.mutateAsync(id);
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await refetch();
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      const msg = err.response?.data?.message || err?.message || "Failed to delete product";
      toast.error(msg);
    }
  };

  // Filtered products list based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedFilterCategory === 'all' || 
        (p.category || '').toLowerCase() === selectedFilterCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (p.title || '').toLowerCase().includes(q) || 
        (p.description || '').toLowerCase().includes(q) ||
        (p.subCategory || '').toLowerCase().includes(q) ||
        (p.composition || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedFilterCategory]);

  // Catalog statistics
  const totalStockMeters = useMemo(() => {
    return products.reduce((acc, p) => acc + (Number(p.stock || p.stockMeters || 0)), 0);
  }, [products]);

  const uniqueCategoriesCount = useMemo(() => {
    return new Set(products.map((p) => (p.category || '').toLowerCase()).filter(Boolean)).size;
  }, [products]);

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── TOP HEADER WITH "+ ADD PRODUCT" BUTTON AT TOP RIGHT ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0f0c1b]/90 border border-purple-900/40 p-6 rounded-3xl gap-4 shadow-2xl backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Package size={20} />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Supplier Dashboard
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Manage your textile listings, inventory, and upload new fabrics to the marketplace
            </p>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              title="Refresh inventory"
              className="flex items-center gap-1.5 text-xs bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} /> Refresh
            </button>

            {/* Prominent + Add Product Button */}
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 text-xs sm:text-sm bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl transition shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus size={16} strokeWidth={3} />
              <span>+ Add Product</span>
            </button>
          </div>
        </div>

        {/* ── CATALOG METRICS STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0f0c1b]/80 border border-purple-900/30 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Catalog Items</p>
              <p className="text-2xl font-extrabold text-white mt-0.5">{products.length}</p>
            </div>
            <div className="p-3 bg-purple-950/50 border border-purple-800/40 rounded-xl text-purple-300">
              <Layers size={18} />
            </div>
          </div>

          <div className="bg-[#0f0c1b]/80 border border-purple-900/30 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Stock Available</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">{totalStockMeters.toLocaleString()} <span className="text-xs text-slate-400 font-normal">meters</span></p>
            </div>
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-300">
              <Package size={18} />
            </div>
          </div>

          <div className="bg-[#0f0c1b]/80 border border-purple-900/30 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Fabric Categories</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-0.5">{uniqueCategoriesCount}</p>
            </div>
            <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-amber-300">
              <Tag size={18} />
            </div>
          </div>
        </div>

        {/* ── SEARCH & FILTER BAR ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#0a0718] border border-purple-900/30 p-3.5 rounded-2xl">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, weave, spec..."
              className="w-full bg-[#070714] border border-purple-900/40 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Filter:</span>
            {['all', 'cotton', 'denim', 'silk', 'linen', 'knits', 'polyester'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilterCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition cursor-pointer capitalize whitespace-nowrap ${
                  selectedFilterCategory === cat
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                    : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-900/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── PRODUCTS CATALOG LISTING GRID ── */}
        <div className="bg-[#0f0c1b]/80 border border-purple-900/40 p-6 rounded-3xl space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-orange-400" />
              Active Inventory ({filteredProducts.length})
            </h2>
            <button
              onClick={handleOpenModal}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer transition"
            >
              <Plus size={14} /> Add Another Fabric
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs">Loading verified catalog products...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="bg-rose-950/30 border border-rose-800/40 p-4 rounded-2xl text-rose-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-400 shrink-0" />
                <span>Error loading inventory: {error?.message || 'Backend connection failed'}</span>
              </div>
              <button onClick={() => refetch()} className="bg-rose-900/60 hover:bg-rose-800/60 px-3 py-1 rounded-lg text-white text-xs font-semibold">
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredProducts.length === 0 && (
            <div className="py-16 text-center border border-dashed border-purple-900/40 rounded-2xl bg-[#0a0718] p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto">
                <PackagePlus size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">No products found</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {searchQuery 
                    ? `No products match "${searchQuery}". Try clearing search filters.` 
                    : "You haven't added any products yet. Click below to add your first product to the catalog."}
                </p>
              </div>
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer"
              >
                <Plus size={14} /> + Add Your First Product
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((p) => {
                const productId = p._id || p.id;
                const imagesCount = p.images?.length || (p.image ? 1 : 0);
                const displayImage = (p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600';

                return (
                  <div 
                    key={productId} 
                    className="bg-[#0a0718] border border-purple-900/30 hover:border-purple-700/60 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-video sm:aspect-square overflow-hidden bg-[#070714]">
                      <img
                        src={displayImage}
                        alt={p.title || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600';
                        }}
                      />

                      {/* Multiple Photos Badge */}
                      {imagesCount > 1 && (
                        <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md border border-purple-500/30 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          📷 {imagesCount} photos
                        </span>
                      )}

                      {/* Category Badge */}
                      <span className="absolute bottom-2.5 left-2.5 bg-[#070714]/80 backdrop-blur-md border border-purple-500/30 text-orange-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {p.category || 'Fabric'}
                      </span>

                      {/* Quick Delete Button */}
                      <button
                        onClick={() => handleDeleteProduct(productId)}
                        title="Delete product"
                        className="absolute top-2.5 right-2.5 bg-rose-950/80 hover:bg-rose-600 border border-rose-700/50 text-white w-7 h-7 rounded-lg flex items-center justify-center text-xs transition opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        {p.subCategory && (
                          <span className="text-[10px] text-purple-300 font-medium tracking-wide block">
                            {p.subCategory}
                          </span>
                        )}
                        <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-orange-400 transition">
                          {p.title || 'Untitled Fabric'}
                        </h3>
                        {p.gsm && (
                          <span className="inline-block text-[10px] bg-purple-950/60 text-purple-300 px-1.5 py-0.5 rounded mt-1 font-mono">
                            {p.gsm} GSM
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-purple-900/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Wholesale Rate</span>
                            <span className="text-base font-black text-orange-400">
                              ₹{p.pricePerMeter ?? p.price ?? 0}
                              <span className="text-[10px] text-slate-400 font-normal"> /m</span>
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Stock</span>
                            <span className="text-xs font-semibold text-emerald-400">
                              {p.stock ?? p.stockMeters ?? 0}m
                            </span>
                          </div>
                        </div>

                        {/* Card Link */}
                        <div className="mt-3 pt-2.5 border-t border-purple-900/20 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-500">MOQ: {p.moq || 50}m</span>
                          <Link
                            to={`/product/${productId}`}
                            className="inline-flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 font-medium transition"
                          >
                            View Details <ExternalLink size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ── FULL PRODUCT UPLOAD MODAL ── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-[#0f0c1b] border border-purple-900/60 rounded-3xl p-6 sm:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                  <PackagePlus size={20} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">Upload New Product</h3>
                  <p className="text-xs text-slate-400">List fabric with wholesale pricing & multi-image gallery</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-purple-950/50 hover:bg-purple-900/50 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* 1. Multi-Image File Upload Zone */}
              <div className="border-2 border-dashed border-purple-800/40 hover:border-purple-600/60 rounded-2xl p-4 bg-[#0a0718] transition text-center">
                <label className="block cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/50 text-orange-400 flex items-center justify-center mx-auto mb-2">
                    <Upload size={18} />
                  </div>
                  <p className="text-xs font-bold text-white">Click or Drag Product Images</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 mb-2">
                    Upload multiple photos (PNG, JPG, WEBP up to 10MB each)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    required={imageFiles.length === 0}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="inline-block text-xs bg-purple-950/80 hover:bg-purple-900/80 border border-purple-700/50 text-purple-200 px-3 py-1.5 rounded-lg transition font-medium">
                    + Browse Files
                  </span>
                </label>

                {/* Thumbnails list/grid */}
                {imagePreviews.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-900/30">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-1">
                      <span className="font-semibold text-purple-300">Selected Photos ({imagePreviews.length})</span>
                      <span className="text-[10px]">★ First image is Cover</span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1">
                      {imagePreviews.map((previewUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative aspect-square rounded-xl overflow-hidden bg-slate-900 border ${
                            idx === 0 ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-purple-900/40'
                          }`}
                        >
                          <img
                            src={previewUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-orange-500 text-slate-950 font-black text-[8px] px-1 rounded uppercase">
                              COVER
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-700 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Product Title */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Product Title / Fabric Name <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 100% Combed Cotton Poplin Shirting"
                  className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* 3. Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Category <span className="text-orange-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 capitalize"
                  >
                    {Object.keys(CATEGORY_MAP).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subcategory</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    {(CATEGORY_MAP[category] || []).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Price & Inventory */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Rate (₹/m) <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 240"
                    className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Stock (m)</label>
                  <input
                    type="number"
                    min="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">MOQ (m)</label>
                  <input
                    type="number"
                    min="1"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* 5. Textile Specs (GSM & Composition) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Fabric GSM</label>
                  <input
                    type="number"
                    value={gsm}
                    onChange={(e) => setGsm(e.target.value)}
                    placeholder="e.g. 180"
                    className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Composition</label>
                  <input
                    type="text"
                    value={composition}
                    onChange={(e) => setComposition(e.target.value)}
                    placeholder="e.g. 100% Cotton / 80-20 Poly"
                    className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* 6. Color Variants */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Colors Available</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="e.g. Indigo Blue, Jet Black, Optical White (comma separated)"
                  className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* 7. Description */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed weave description, certifications (GOTS, OEKO-TEX), application..."
                  className="w-full bg-[#070714] border border-purple-900/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-900/30">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/30 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} strokeWidth={3} />
                      <span>Save & Add to Catalog</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}