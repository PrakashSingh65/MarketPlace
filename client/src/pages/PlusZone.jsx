import { Link } from 'react-router-dom';
import { Sparkles, Crown, Zap, CheckCircle2, ArrowRight, Truck, Gift, Percent } from 'lucide-react';

export default function PlusZone() {
  const perks = [
    {
      icon: <Percent className="text-orange-400" size={24} />,
      title: 'Flat 5% Extra Cashback',
      desc: 'Earn credit rewards on every bulk fabric consignment automatically applied to future orders.'
    },
    {
      icon: <Truck className="text-cyan-400" size={24} />,
      title: 'Zero Freight on 1000m+ Runs',
      desc: 'Free insured truckload logistics directly from Surat, Ahmedabad, and Tiruppur mills.'
    },
    {
      icon: <Gift className="text-pink-400" size={24} />,
      title: 'Free Sample Swatch Bundles',
      desc: 'Order up to 10 complimentary fabric hangers each month to touch, feel, and review yarn quality.'
    },
    {
      icon: <Zap className="text-amber-400" size={24} />,
      title: 'Priority Dispatch & Weaving',
      desc: 'Skip queue times with expedited lab-dip approvals and dedicated mill loom slots.'
    }
  ];

  const tiers = [
    {
      name: 'Silver Member',
      minSpend: '₹50,000 / Quarter',
      badge: 'Free Tier',
      benefits: ['Standard Wholesale Pricing', 'Sample Swatches at 50% off', 'Email & WhatsApp Support'],
      active: true,
    },
    {
      name: 'Gold Enterprise',
      minSpend: '₹2,00,000 / Quarter',
      badge: 'Popular',
      benefits: ['Additional 3% Bulk Rebate', 'Free Sample Swatch Kits', 'Dedicated Account Manager', 'Net 15 Days Credit Terms'],
      highlight: true,
    },
    {
      name: 'Platinum Mill Partner',
      minSpend: '₹10,00,000 / Quarter',
      badge: 'VIP Exclusive',
      benefits: ['Direct Mill-Floor Rates', 'Custom Weave & Dyeing Slots', 'Net 30 Days Credit', 'Zero Freight Guarantee'],
      highlight: false,
    }
  ];

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950/80 via-[#0f0c1b] to-orange-950/60 border border-purple-800/40 p-8 sm:p-12 shadow-[0_0_50px_rgba(147,51,234,0.15)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold">
              <Crown size={14} className="text-amber-400" />
              <span>LELOBHAI PLUS CLUB</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Unlock Elite B2B Perks with <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Plus Zone Rewards
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Designed for garment exporters, boutique designers, and fabric traders. Enjoy mill-direct volume pricing, credit lines, and complimentary sample books.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/marketplace"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-orange-500/30 flex items-center gap-2"
              >
                Explore Plus Eligible Fabrics <ArrowRight size={14} />
              </Link>
              <Link
                to="/customer-care"
                className="bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-bold px-6 py-3 rounded-xl transition"
              >
                Apply for Mill Credit
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <Sparkles className="text-orange-400" size={20} /> Exclusive Member Benefits
            </h2>
            <p className="text-xs text-slate-400">Maximize manufacturing margins with privileges tailored for bulk buyers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p, idx) => (
              <div
                key={idx}
                className="bg-[#0f0c1b]/90 border border-purple-900/40 rounded-2xl p-6 space-y-3 hover:border-orange-500/50 transition group shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center group-hover:scale-110 transition">
                  {p.icon}
                </div>
                <h3 className="font-bold text-sm text-white">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Tiers */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl font-black text-white">Membership Tiers</h2>
            <p className="text-xs text-slate-400">Higher tiers unlock longer credit terms and deeper manufacturer discounts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 border transition relative ${
                  tier.highlight
                    ? 'bg-[#0f0c1b] border-orange-500/80 shadow-[0_0_30px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/50'
                    : 'bg-[#0f0c1b]/80 border-purple-900/40 hover:border-purple-700/60'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Most Selected
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-white">{tier.name}</h3>
                      <p className="text-xs text-orange-400 font-semibold mt-0.5">{tier.minSpend}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-950 border border-purple-800/60 text-purple-300">
                      {tier.badge}
                    </span>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/marketplace"
                  className={`w-full text-center py-3 rounded-xl font-bold text-xs transition block ${
                    tier.highlight
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:opacity-90 shadow-md shadow-orange-500/30'
                      : 'bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/40 text-white'
                  }`}
                >
                  Join {tier.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
