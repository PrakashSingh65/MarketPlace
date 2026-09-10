import React from "react";
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Building2,
  Award,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative bg-[#090d16] text-white border-b border-slate-800/80 py-12 lg:py-16 px-4 sm:px-6 overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-25 pointer-events-none">
        <div className="absolute -top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-[130px]" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-500 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* LEFT COLUMN: Clean Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-[11px] font-bold text-blue-300 tracking-wide">
            <Zap size={13} className="text-amber-400" />
            <span>DIRECT FACTORY SOURCING</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>

          {/* New Clean Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.18] text-white">
            India's Digital B2B <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
              Textile Trade Ecosystem
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Trade directly with verified fabric mills. Transparent GSM specs, verified weave metrics, and zero middleman markups.
          </p>

          {/* Compact Search Bar */}
          <div className="w-full max-w-lg bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2">
            <div className="flex items-center gap-2.5 pl-3 flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search Cotton, 180 GSM, Denim, Silk..."
                className="w-full py-1.5 text-xs text-white placeholder-slate-500 bg-transparent outline-none"
              />
            </div>
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition flex items-center gap-1.5 shrink-0"
            >
              Search <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="text-slate-500 font-semibold">Quick Filters:</span>
            {["100% Cotton", "Denim 12oz", "180 GSM", "Rayon"].map((item, i) => (
              <span key={i} className="bg-slate-800/80 border border-slate-700/60 px-2.5 py-0.5 rounded-md text-slate-300 hover:border-slate-500 cursor-pointer transition">
                {item}
              </span>
            ))}
          </div>

          {/* Platform Trust Stats */}
          <div className="pt-2 grid grid-cols-3 gap-4 border-t border-slate-800/80 w-full max-w-md text-xs">
            <div>
              <p className="font-extrabold text-white text-base">2,500+</p>
              <p className="text-[11px] text-slate-400">Verified Mills</p>
            </div>
            <div>
              <p className="font-extrabold text-amber-400 text-base">10k+</p>
              <p className="text-[11px] text-slate-400">Fabric Listings</p>
            </div>
            <div>
              <p className="font-extrabold text-emerald-400 text-base">0%</p>
              <p className="text-[11px] text-slate-400">Commission Fee</p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Live Demand Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">Top Mill Listing</span>
              </div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                ● Mill Direct
              </span>
            </div>

            <div className="mt-3 bg-[#080b13] rounded-xl p-3.5 border border-slate-800/80 flex gap-3.5 items-center">
              <img
                src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=300&q=80"
                alt="Combed Cotton"
                className="w-16 h-16 rounded-lg object-cover border border-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] text-amber-400 font-extrabold tracking-wider uppercase block">Top Selling</span>
                <h4 className="text-xs font-bold text-white truncate">100% Organic Combed Cotton</h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="bg-blue-950 px-1.5 py-0.5 rounded text-blue-300 text-[10px]">180 GSM</span>
                  <span>MOQ: 500m</span>
                </div>
                <p className="mt-1 text-xs font-black text-white">₹185 <span className="text-[10px] text-slate-400 font-normal">/ meter</span></p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <ShieldCheck size={14} className="text-amber-400" />
                <span className="text-slate-300 text-[11px]">GST Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <Layers size={14} className="text-sky-400" />
                <span className="text-slate-300 text-[11px]">Lab Tested Specs</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Textile Manufacturer?</span>
              <Link to="/supplier-register" className="font-bold text-amber-400 hover:underline text-[11px]">
                Become a Seller →
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}