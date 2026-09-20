import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Calculator, 
  ChevronRight, 
  ShoppingBag, 
  Scale, 
  BadgeCheck, 
  Percent, 
  Sliders,
  Bot
} from "lucide-react";
import { useGetProducts } from "../api/productApi";
import useCart from "../hooks/useCart";

// Preset fabric options for the Unique Live GSM & Cost Estimator
const FABRIC_PRESETS = [
  { id: "cotton", name: "100% Combed Cotton", basePrice: 180, defaultGsm: 180, category: "cotton" },
  { id: "denim", name: "Ring-Spun Twill Denim", basePrice: 320, defaultGsm: 340, category: "denim" },
  { id: "silk", name: "Mulberry Crepe Silk", basePrice: 650, defaultGsm: 110, category: "silk" },
  { id: "linen", name: "Organic Slub Linen", basePrice: 420, defaultGsm: 220, category: "linen" },
  { id: "poly", name: "Recycled Poly-Spandex", basePrice: 195, defaultGsm: 240, category: "synthetic" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: apiProducts } = useGetProducts();

  // Search input state
  const [searchKeyword, setSearchKeyword] = useState("");

  // Interactive Persona Switcher: "buyer" vs "supplier"
  const [persona, setPersona] = useState("buyer");

  // Unique Interactive GSM & Cost Estimator State
  const [selectedPreset, setSelectedPreset] = useState(FABRIC_PRESETS[0]);
  const [customGsm, setCustomGsm] = useState(180);
  const [orderMeters, setOrderMeters] = useState(500);

  // Dynamic cost calculation based on GSM and volume discount
  const estimation = useMemo(() => {
    const gsmFactor = customGsm / (selectedPreset.defaultGsm || 180);
    const estimatedRatePerMeter = Math.round(selectedPreset.basePrice * Math.max(0.85, Math.min(1.4, gsmFactor)));
    
    // Volume discount brackets
    let discountPercent = 0;
    if (orderMeters >= 5000) discountPercent = 15;
    else if (orderMeters >= 2000) discountPercent = 10;
    else if (orderMeters >= 1000) discountPercent = 5;

    const subtotal = estimatedRatePerMeter * orderMeters;
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const finalTotal = subtotal - discountAmount;
    const effectiveRate = Math.round(finalTotal / orderMeters);

    return {
      ratePerMeter: estimatedRatePerMeter,
      effectiveRate,
      discountPercent,
      discountAmount,
      finalTotal,
      estDays: orderMeters > 3000 ? "5-7 Days" : "3-4 Days"
    };
  }, [selectedPreset, customGsm, orderMeters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate("/marketplace");
    }
  };

  // Sample or real featured products
  const featuredProducts = useMemo(() => {
    if (Array.isArray(apiProducts) && apiProducts.length > 0) {
      return apiProducts.slice(0, 4);
    }
    return [
      {
        _id: "preview-1",
        title: "100% Combed Cotton Single Jersey",
        category: "Cotton",
        price: 185,
        moq: 300,
        gsm: 180,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800",
        supplierName: "Surat Spinning Mills",
      },
      {
        _id: "preview-2",
        title: "Indigo Selvedge Denim 13.5 Oz",
        category: "Denim",
        price: 380,
        moq: 150,
        gsm: 360,
        image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&q=80&w=800",
        supplierName: "Ahmedabad Textiles Ltd",
      },
      {
        _id: "preview-3",
        title: "Pure Mulberry Silk Charmeuse",
        category: "Silk",
        price: 720,
        moq: 50,
        gsm: 95,
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
        supplierName: "Varanasi Silk Guild",
      },
      {
        _id: "preview-4",
        title: "Premium French Terry Melange",
        category: "Knits",
        price: 245,
        moq: 200,
        gsm: 260,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
        supplierName: "Tirupur Knit Hub",
      },
    ];
  }, [apiProducts]);

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION WITH DYNAMIC LIVE BACKGROUND & SEARCH
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-purple-900/40">
        
        {/* Soft Ambient Glow Orbs */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-purple-600/25 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[450px] h-[450px] bg-orange-600/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines, Search & Fast Links */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-purple-500/15 to-transparent border border-orange-500/30 text-xs font-semibold text-orange-300">
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                <span>India's Next-Gen B2B Fabric Exchange</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
                Direct Mill Sourcing <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Zero Broker Markups.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Connect directly with 2,500+ verified textile mills in Surat, Tirupur, Ahmedabad & Bhiwandi. Guaranteed GSM weight, lab-tested metrics, and transparent factory-gate pricing.
              </p>

              {/* Main Search Bar Form */}
              <form 
                onSubmit={handleSearchSubmit}
                className="p-1.5 bg-[#0e0a20]/90 border border-purple-800/60 rounded-2xl shadow-2xl flex items-center gap-2 backdrop-blur-md max-w-xl"
              >
                <div className="flex items-center gap-2.5 pl-3.5 flex-1">
                  <Search className="w-5 h-5 text-orange-400 shrink-0" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search by Fabric, GSM, Weave, or Mill Name..."
                    className="w-full bg-transparent py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-orange-500/25 flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Hot Fabric Trend Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <TrendingUp size={13} className="text-amber-400" /> Hot Sourcing:
                </span>
                {["180 GSM Cotton", "Indigo Denim 14oz", "Mulberry Silk", "French Terry", "Linen Slub"].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/marketplace?q=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 hover:border-purple-400/50 rounded-lg text-slate-300 text-[11px] transition cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant', { detail: { query: 'Recommend best selling fabrics for garment manufacturing' } }))}
                  className="px-2.5 py-1 bg-gradient-to-r from-orange-500/20 to-purple-600/20 hover:from-orange-500/30 hover:to-purple-600/30 border border-orange-500/40 hover:border-orange-400 rounded-lg text-orange-300 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <Bot size={12} className="text-orange-400" />
                  <span>Ask AI Advisor</span>
                </button>
              </div>

              {/* Verified Trust Badges Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-900/30 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">2,500+</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <BadgeCheck size={13} className="text-emerald-400" /> Verified Mills
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-orange-400">10k+</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Scale size={13} className="text-orange-400" /> Tested Weaves
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">0%</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Percent size={13} className="text-amber-400" /> Buyer Commission
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Live Swatch Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-[#0d091e] border border-purple-800/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(112,0,255,0.2)] backdrop-blur-xl space-y-5">
                
                {/* Mill Live Badge Header */}
                <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Production Batch</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                    Surat Mill Direct
                  </span>
                </div>

                {/* Fabric Preview Visual */}
                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800"
                    alt="Combed Cotton Fabric"
                    className="w-full h-52 object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">Export Quality</span>
                    <h3 className="text-base font-bold text-white">100% Bio-Washed Combed Cotton</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                      <span className="bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30 text-purple-300">180 GSM</span>
                      <span>Single Jersey Weave</span>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications Matrix */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#140f2b] p-2.5 rounded-xl border border-purple-900/40">
                    <span className="text-[10px] text-slate-400 block">Shrinkage</span>
                    <span className="font-bold text-emerald-400">&lt; 3% Max</span>
                  </div>
                  <div className="bg-[#140f2b] p-2.5 rounded-xl border border-purple-900/40">
                    <span className="text-[10px] text-slate-400 block">Color Fastness</span>
                    <span className="font-bold text-amber-400">Grade 4.5+</span>
                  </div>
                  <div className="bg-[#140f2b] p-2.5 rounded-xl border border-purple-900/40">
                    <span className="text-[10px] text-slate-400 block">Lead Time</span>
                    <span className="font-bold text-indigo-300">3 Days</span>
                  </div>
                </div>

                {/* Price & CTA Action */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Wholesale Mill Rate</span>
                    <div className="text-xl font-black text-white">
                      ₹185 <span className="text-xs font-normal text-slate-400">/ meter</span>
                    </div>
                  </div>
                  <Link
                    to="/marketplace"
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                  >
                    <span>Inspect Fabric</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. UNIQUE FEATURE: INTERACTIVE GSM & BULK COST ESTIMATOR
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#0a071a] border-b border-purple-900/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-bold text-orange-400">
              <Calculator size={14} />
              <span>Smart Sourcing Tool</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Instant Fabric GSM & Wholesale Price Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Simulate mill production pricing, bulk consignment discounts, and estimated lead times in real time.
            </p>
          </div>

          <div className="bg-[#0f0c24] border border-purple-800/50 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Config Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Fabric Type Selector Pills */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                  1. Select Fabric Specialty
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FABRIC_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(p);
                        setCustomGsm(p.defaultGsm);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                        selectedPreset.id === p.id
                          ? "bg-purple-950/80 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)] font-bold"
                          : "bg-[#140f2d] border-purple-900/40 text-slate-400 hover:border-purple-600"
                      }`}
                    >
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* GSM Slider Control */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300">2. Target Fabric Density (GSM)</span>
                  <span className="text-orange-400 font-mono text-sm bg-orange-950/60 px-2.5 py-0.5 rounded border border-orange-500/30">
                    {customGsm} GSM
                  </span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="450"
                  step="10"
                  value={customGsm}
                  onChange={(e) => setCustomGsm(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>90 GSM (Lightweight)</span>
                  <span>240 GSM (Medium)</span>
                  <span>450 GSM (Heavy Twill)</span>
                </div>
              </div>

              {/* Order Volume in Meters */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300">3. Production Consignment Length</span>
                  <span className="text-amber-400 font-mono text-sm bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/30">
                    {orderMeters.toLocaleString()} Meters
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={orderMeters}
                  onChange={(e) => setOrderMeters(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>100m (Sample Run)</span>
                  <span>2,000m (Bulk Tier: 10% Off)</span>
                  <span>10,000m (Mill Tier: 15% Off)</span>
                </div>
              </div>

            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-5 bg-[#090615] border border-purple-700/60 rounded-2xl p-6 space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Simulated Quote</span>
                {estimation.discountPercent > 0 && (
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {estimation.discountPercent}% Bulk Tier Applied
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Fabric Grade:</span>
                  <span className="text-white font-semibold">{selectedPreset.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Spec Weight:</span>
                  <span className="text-white font-mono font-semibold">{customGsm} GSM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Consignment Volume:</span>
                  <span className="text-white font-mono font-semibold">{orderMeters.toLocaleString()} Meters</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Mill Lead Time:</span>
                  <span className="text-indigo-300 font-semibold">{estimation.estDays}</span>
                </div>

                <div className="border-t border-purple-900/40 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Effective Rate</span>
                    <span className="text-xl font-black text-orange-400 font-mono">
                      ₹{estimation.effectiveRate} <span className="text-xs font-normal text-slate-400">/ meter</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Estimated Total</span>
                    <span className="text-xl font-black text-white font-mono">
                      ₹{estimation.finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/marketplace?category=${encodeURIComponent(selectedPreset.category)}`)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Find Mills Matching This Spec</span>
                <ArrowRight size={15} />
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CURATED TEXTILE CATEGORIES
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-purple-900/40 pb-5">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-1">Catalog Directory</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Fabric Specializations</h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <span>View All 16 Categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "100% Combed Cotton & Jersey",
              specs: "140 - 240 GSM • Bio-Washed • 24s/30s/40s Counts",
              desc: "Engineered for high-durability casual wear, oversized tees, and premium apparel.",
              image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600",
              link: "/marketplace?category=cotton"
            },
            {
              title: "Rigid & Stretch Selvedge Denim",
              specs: "10.5oz - 16oz • 3x1 RHT • Deep Rope Dyed",
              desc: "Heavyweight, shuttle-loom selvedge denim directly from Ahmedabad & Surat mills.",
              image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&q=80&w=600",
              link: "/marketplace?category=denim"
            },
            {
              title: "Pure Mulberry & Tussar Silk",
              specs: "60 - 120 GSM • Handloom & Powerloom Certified",
              desc: "Exquisite raw silk, crepe-de-chine, and jacquards for luxury couture and ethnic wear.",
              image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600",
              link: "/marketplace?category=silk"
            },
            {
              title: "French Terry & Interlock Knits",
              specs: "220 - 360 GSM • Brushed & Loopback Fleece",
              desc: "Heavyweight luxury streetwear knits ideal for premium hoodies, joggers, and pullovers.",
              image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
              link: "/marketplace?category=cotton"
            },
            {
              title: "European Pure Flax Linen",
              specs: "160 - 280 GSM • Pre-Shrunk & Yarn Dyed",
              desc: "Breathable textured linen weaves with natural slub aesthetic for resort & resort-wear.",
              image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
              link: "/marketplace?category=cotton"
            },
            {
              title: "Sustainable & Recycled Poly",
              specs: "180 - 320 GSM • GRS Certified Weaves",
              desc: "Eco-friendly fabrics made with post-consumer recycled yarn for ethical fashion brands.",
              image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
              link: "/marketplace?category=cotton"
            },
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group bg-[#0e0a1f] border border-purple-900/40 hover:border-orange-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_25px_rgba(249,115,22,0.2)] transition flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a1f] via-transparent to-transparent" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-amber-400/90 font-mono mt-1">{cat.specs}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-orange-400">
                  <span>Browse Mill Listings</span>
                  <ChevronRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. TRENDING FABRICS SHOWCASE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#0a071a] border-y border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Live Marketplace Feed</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Trending Factory Consignments</h2>
            </div>
            <Link
              to="/marketplace"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 transition"
            >
              <span>Explore All Listings</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const productId = p._id || p.id;
              return (
                <div
                  key={productId}
                  className="bg-[#0f0c24] border border-purple-900/40 hover:border-purple-600 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      <img
                        src={(p.images && p.images[0]) || p.image || "https://placehold.co/400x300?text=Fabric"}
                        alt={p.title}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-bold bg-slate-950/80 text-white border border-slate-700/60 px-2 py-0.5 rounded-md backdrop-blur-md">
                          MOQ: {p.moq || 50}m
                        </span>
                      </div>
                      {p.gsm && (
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-md backdrop-blur-md font-mono">
                            {p.gsm} GSM
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider block">
                        {p.category || "Fabric"}
                      </span>
                      <Link
                        to={`/product/${productId}`}
                        className="text-xs sm:text-sm font-bold text-white hover:text-orange-300 transition line-clamp-2 block"
                      >
                        {p.title}
                      </Link>
                      <p className="text-[11px] text-slate-500 truncate">
                        Mill: <span className="text-slate-400">{p.supplierName || "Verified Partner Mill"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-purple-900/30 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Rate / Meter</span>
                      <span className="text-base font-black text-white">₹{p.price || p.pricePerMeter}</span>
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className="bg-purple-950 hover:bg-orange-500 hover:text-slate-950 text-orange-400 border border-purple-600/40 hover:border-orange-500 p-2.5 rounded-xl transition cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. DUAL PERSONA SWITCHER: BUYER VS SUPPLIER BENEFITS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-bold text-purple-300">
            <Sliders size={14} />
            <span>Built For Both Sides of the Loom</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">How LeloBhai Works For You</h2>
          
          {/* Persona Toggle */}
          <div className="inline-flex bg-[#0f0c24] p-1.5 rounded-2xl border border-purple-800/60 mt-4">
            <button
              onClick={() => setPersona("buyer")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                persona === "buyer"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              For Garment Brands & Buyers
            </button>
            <button
              onClick={() => setPersona("supplier")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                persona === "supplier"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              For Textile Mills & Weavers
            </button>
          </div>
        </div>

        {/* Dynamic Persona Content */}
        {persona === "buyer" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0e0a1f] border border-purple-900/40 p-6 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black">
                01
              </div>
              <h3 className="text-base font-bold text-white">Direct Mill Gate Prices</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bypass traditional commission agents and regional brokers. Buy fabric at the exact rate the mill charges at their Surat or Tirupur gate.
              </p>
            </div>
            <div className="bg-[#0e0a1f] border border-purple-900/40 p-6 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                02
              </div>
              <h3 className="text-base font-bold text-white">Lab-Tested Quality Guarantee</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every consignment includes certified GSM metrics, warp/weft thread counts, and shrinkage tolerances before dispatch.
              </p>
            </div>
            <div className="bg-[#0e0a1f] border border-purple-900/40 p-6 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                03
              </div>
              <h3 className="text-base font-bold text-white">Inspected Doorstep Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracked freight logistics from mill to your factory cutting floor with Razorpay secure escrow payment protection.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0e0a1f] border border-purple-900/40 p-6 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                01
              </div>
              <h3 className="text-base font-bold text-white">Pan-India Brand Reach</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                List your running looms and greige inventory to thousands of verified garment manufacturers, designers, and exporters.
              </p>
            </div>
            <div className="bg-[#0e0a1f] border border-purple-900/40 p-6 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                02
              </div>
              <h3 className="text-base font-bold text-white">Zero Listing Commission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enjoy 0% platform listing fees. Receive payments straight to your verified enterprise bank account on dispatch.
              </p>
            </div>
            <div className="bg-[#0e0a1f] border border-purple-900/40 p-6 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                03
              </div>
              <h3 className="text-base font-bold text-white">Automated Invoicing & Freight</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our logistics partners handle pickup directly from your warehouse dock with auto-generated e-Way bills and GST invoices.
              </p>
            </div>
          </div>
        )}

      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. HIGH CONVERTING BOTTOM CTA SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-950 via-[#180f35] to-orange-950 p-8 sm:p-12 border border-purple-700/50 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Exclusive VIP Benefits</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Upgrade to LeloBhai Plus Zone
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Earn 5% flat cashback credit on every bulk fabric consignment, access priority mill dispatch queues, and get free laboratory swatch swatches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/plus-zone"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-orange-500/30 flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>Explore Plus Zone</span>
            </Link>
            <Link
              to="/marketplace"
              className="bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition"
            >
              Browse Catalog
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}