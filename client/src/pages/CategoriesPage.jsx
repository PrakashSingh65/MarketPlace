import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

const CATEGORIES_DATA = [
  {
    id: 'cotton',
    name: '100% Cotton & Blends',
    tag: 'Highest Demand',
    desc: 'Combed cotton, ring-spun jersey, poplin, cambric, and organic certified fabrics.',
    gsmRange: '120 - 240 GSM',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
    popularSub: ['Single Jersey', 'Interlock', 'French Terry', 'Pique Polo', 'Cambric']
  },
  {
    id: 'denim',
    name: 'Denim & Chambray',
    tag: 'Mill Direct',
    desc: 'Raw selvedge, stretch denim, ring slub, indigo rope dyed, and chambray shirting.',
    gsmRange: '6.5 - 14.5 Oz',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&q=80&w=800',
    popularSub: ['Rigid 100% Cotton', 'Comfort Stretch', 'Bull Denim', 'Printed Chambray']
  },
  {
    id: 'silk',
    name: 'Silk & Luxury Weaves',
    tag: 'Artisan Sourced',
    desc: 'Mulberry silk, Tussar, Chanderi, Banarasi brocades, and organza luxury fabrics.',
    gsmRange: '40 - 110 GSM',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    popularSub: ['Pure Mulberry Silk', 'Chanderi Zari', 'Tissue Organza', 'Raw Matka Silk']
  },
  {
    id: 'rayon',
    name: 'Rayon, Viscose & Modal',
    tag: 'Flow & Drape',
    desc: 'Liva certified viscose, micro-modal, rayon twill, and slub prints with soft handfeel.',
    gsmRange: '110 - 180 GSM',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800',
    popularSub: ['14kg Rayon', 'Heavy Slub Rayon', 'Modal Satin', 'Viscose Georgette']
  },
  {
    id: 'linen',
    name: 'Pure Linen & Flax',
    tag: 'Export Quality',
    desc: 'French and Belgian flax, cotton linen blends, slub textures for resort-wear collections.',
    gsmRange: '130 - 220 GSM',
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800',
    popularSub: ['60 Lea Pure Linen', 'Cotton Linen Blend', 'Linen Chambray', 'Yarn Dyed Checks']
  },
  {
    id: 'polyester',
    name: 'Performance & Synthetic',
    tag: 'Athleisure',
    desc: 'Dry-fit polyester, spandex poly blends, water-repellent nylon, and recycled PET weaves.',
    gsmRange: '90 - 280 GSM',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    popularSub: ['Dry-Fit Mesh', '4-Way Stretch Poly', 'Tafetta Nylon', 'Scuba Knit']
  }
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [selectedGsm, setSelectedGsm] = useState('ALL');

  const handleSelectCategory = (catName) => {
    navigate(`/search?q=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Hero Banner */}
        <div className="rounded-3xl bg-[#0f0c1b]/90 border border-purple-900/40 p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-orange-400 bg-orange-950/60 border border-orange-500/30 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Layers size={13} /> Sourcing Catalog 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Explore Textile Categories by Fiber & Weave
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Find verified mills producing specific GSM weights, composition blends, and specialty finishes directly for export and domestic fashion production.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:max-w-xs justify-end">
            {['ALL', 'Light (<130 GSM)', 'Medium (130-220 GSM)', 'Heavy (>220 GSM)'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedGsm(range)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                  selectedGsm === range
                    ? 'bg-orange-500 text-slate-950 font-bold border-orange-400 shadow-md shadow-orange-500/20'
                    : 'bg-purple-950/50 border-purple-800/40 text-slate-300 hover:border-purple-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.id}
              className="bg-[#0f0c1b]/80 border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl hover:border-orange-500/50 transition duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-52 w-full relative overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c1b] via-[#0f0c1b]/30 to-transparent" />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-purple-500/30 text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {cat.tag}
                  </span>
                  <span className="absolute bottom-3 right-4 text-xs font-mono font-bold text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-lg border border-purple-700/40">
                    {cat.gsmRange}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                      Common Weaves & Finishes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.popularSub.map((sub, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectCategory(sub)}
                          className="bg-purple-950/60 hover:bg-orange-500 hover:text-slate-950 text-slate-300 border border-purple-800/40 text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handleSelectCategory(cat.name.split('&')[0].trim())}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Browse {cat.name.split('&')[0].trim()} Inventory <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
