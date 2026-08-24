import React from 'react';
import { Sparkles, Zap, Rocket, Diamond, ArrowRight, Laptop, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative bg-[#070714] text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl border border-purple-900/40 my-4 max-w-7xl mx-auto shadow-[0_0_50px_rgba(112,0,255,0.2)]">
      
      {/* Dynamic Glowing Background Orbs & Dust */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-orange-500/20 via-purple-600/30 to-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-600/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* LEFT COLUMN: Small Neon Cards */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-5 justify-between">
          
          {/* Card 1: Orange/Red Glowing Card */}
          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition" />
            <span className="text-[10px] font-extrabold tracking-widest text-orange-400 uppercase bg-orange-950/80 border border-orange-500/30 px-2 py-0.5 rounded-full">
              Innovate. Design.
            </span>
            <h3 className="text-xl font-black mt-3 bg-gradient-to-r from-orange-200 to-amber-400 bg-clip-text text-transparent">
              Inspire.
            </h3>
            <p className="text-xs text-slate-400 mt-2">Next-gen UI elements and cosmic design aesthetics.</p>
            <button className="mt-4 px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:scale-105 transition flex items-center gap-1">
              Explore <ArrowRight size={12} />
            </button>
          </div>

          {/* Card 2: Blue/Purple Glowing Card */}
          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition" />
            <h3 className="text-lg font-extrabold text-blue-300">We Create <br /><span className="text-cyan-400">Digital Magic</span></h3>
            <p className="text-xs text-slate-400 mt-1">High-performance React components with cyber glow.</p>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 w-3/4 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Card 3: Mobile View Mini Card */}
          <div className="hidden sm:flex lg:flex bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-4 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.2)] items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-400">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-pink-200">Mobile Ready</p>
              <p className="text-[10px] text-slate-400">Ultra responsive layouts</p>
            </div>
          </div>

        </div>

        {/* CENTER MAIN HERO BOARD */}
        <div className="lg:col-span-6 bg-[#0a0817]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-orange-500/60 shadow-[0_0_40px_rgba(249,115,22,0.3)] flex flex-col justify-between relative overflow-hidden">
          
          {/* Top Bar Indicators */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_#eab308]" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_#22c55e]" />
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
              <Sparkles size={13} className="text-orange-400 animate-spin" /> Cyber Edition 2026
            </div>
          </div>

          {/* Main Title & CTA */}
          <div className="space-y-5 my-auto">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Build Stunning <br />
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                Web Experiences
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed">
              Elevate your e-commerce ecosystem with cosmic aesthetics, ultra-fast rendering, and interactive neon component libraries.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link 
                to="/products"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:shadow-[0_0_35px_rgba(249,115,22,0.8)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Get Started Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Bottom Interactive Icon Badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-orange-500/30 rounded-xl p-2.5 flex items-center gap-2 shadow-[0_0_10px_rgba(249,115,22,0.15)]">
              <Zap size={18} className="text-orange-400" />
              <div>
                <p className="text-[10px] text-slate-400">Speed</p>
                <p className="text-xs font-bold text-white">Ultra Fast</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-purple-500/30 rounded-xl p-2.5 flex items-center gap-2 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
              <Diamond size={18} className="text-purple-400" />
              <div>
                <p className="text-[10px] text-slate-400">Design</p>
                <p className="text-xs font-bold text-white">Premium UI</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-2.5 flex items-center gap-2 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              <Rocket size={18} className="text-cyan-400" />
              <div>
                <p className="text-[10px] text-slate-400">Deploy</p>
                <p className="text-xs font-bold text-white">Instant</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Stats & Performance Cards */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-5 justify-between">
          
          {/* Card 1: Stats Grid */}
          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
                <p className="text-lg font-black text-orange-400">120+</p>
                <p className="text-[9px] text-slate-400 uppercase">Ui Kits</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
                <p className="text-lg font-black text-purple-400">2.5K</p>
                <p className="text-[9px] text-slate-400 uppercase">Users</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
                <p className="text-lg font-black text-pink-400">98%</p>
                <p className="text-[9px] text-slate-400 uppercase">Score</p>
              </div>
            </div>
          </div>

          {/* Card 2: Crafted for Performance */}
          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 relative overflow-hidden">
            <div className="h-20 bg-slate-900/80 rounded-xl mb-3 border border-cyan-500/20 overflow-hidden relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse" />
              <p className="text-xs font-bold text-cyan-300 relative z-10">⚡ 60 FPS Smooth Render</p>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Crafted for Performance</h4>
            <button className="mt-2 w-full py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              View Benchmarks
            </button>
          </div>

          {/* Card 3: Laptop Display Card */}
          <div className="hidden sm:flex lg:flex bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-4 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-400">
              <Laptop size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-200">Desktop Optimized</p>
              <p className="text-[10px] text-slate-400">Seamless Dashboard UI</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}