import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, Briefcase, Layers, Package, IndianRupee, Sparkles, Mic, ArrowRight, CheckCircle2 
} from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [useAiMode, setUseAiMode] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Buyer Onboarding Form State
  const [formData, setFormData] = useState({
    businessType: 'Garment Manufacturer',
    industry: 'Apparel & Fashion',
    categoriesOfInterest: ['Cotton', 'Denim'],
    preferredFabricTypes: ['Organic', 'Knit'],
    typicalOrderQty: '500-1000 meters',
    budgetRange: '₹50,000 - ₹2,000,000'
  });

  const categoryOptions = ['Cotton', 'Silk', 'Denim', 'Linen', 'Polyester', 'Rayon'];
  const businessOptions = ['Garment Manufacturer', 'Boutique Owner', 'Wholesaler/Exporter', 'Independent Designer'];

  const toggleCategory = (cat) => {
    setFormData(prev => {
      const exists = prev.categoriesOfInterest.includes(cat);
      return {
        ...prev,
        categoriesOfInterest: exists 
          ? prev.categoriesOfInterest.filter(c => c !== cat)
          : [...prev.categoriesOfInterest, cat]
      };
    });
  };

  // AI Voice Recognition Simulation for Hands-free Onboarding
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      
      // Auto fill form based on spoken text
      if (transcript.toLowerCase().includes('boutique')) {
        setFormData(prev => ({ ...prev, businessType: 'Boutique Owner' }));
      }
      if (transcript.toLowerCase().includes('silk')) {
        toggleCategory('Silk');
      }
      alert(`AI Heard: "${transcript}". Preferences updated!`);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save onboarding data locally
    localStorage.setItem('buyer_onboarding_data', JSON.stringify(formData));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-2">
              <Sparkles size={14} /> Personalizing Your Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome! Let's Setup Your Profile</h1>
          </div>

          {/* AI vs Standard Mode Toggle */}
          <button
            type="button"
            onClick={() => setUseAiMode(!useAiMode)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              useAiMode 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles size={14} /> {useAiMode ? 'AI Assistant On' : 'Try AI Onboarding'}
          </button>
        </div>

        {/* AI Assisted Voice/Chat Banner */}
        {useAiMode && (
          <div className="mt-6 p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between gap-4">
            <div className="text-xs">
              <span className="font-bold text-indigo-300 block mb-0.5">🎙️ Voice & Smart Onboarding Active</span>
              <p className="text-slate-400">Click the mic and speak e.g., "I run a boutique and need silk fabrics".</p>
            </div>
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-full text-white transition ${
                isListening ? 'bg-red-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              <Mic size={18} />
            </button>
          </div>
        )}

        {/* Main Onboarding Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* 1. Business Type */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Building size={14} className="text-indigo-400" /> Business Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {businessOptions.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData({ ...formData, businessType: type })}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                    formData.businessType === type
                      ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {type}
                  {formData.businessType === type && <CheckCircle2 size={16} className="text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Product Categories of Interest */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Layers size={14} className="text-purple-400" /> Categories of Interest
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => {
                const selected = formData.categoriesOfInterest.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      selected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat} {selected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Order Quantity & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Package size={14} className="text-emerald-400" /> Typical Order Quantity
              </label>
              <select
                value={formData.typicalOrderQty}
                onChange={(e) => setFormData({ ...formData, typicalOrderQty: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="100-500 meters">100 - 500 meters</option>
                <option value="500-1000 meters">500 - 1,000 meters</option>
                <option value="1000-5000 meters">1,000 - 5,000 meters</option>
                <option value="5000+ meters">Bulk (5,000+ meters)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <IndianRupee size={14} className="text-amber-400" /> Monthly Budget Range
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Under ₹50,000">Under ₹50,000</option>
                <option value="₹50,000 - ₹2,000,000">₹50,000 - ₹2,00,000</option>
                <option value="₹2,00,000 - ₹10,00,000">₹2,00,000 - ₹10,00,000</option>
                <option value="₹10,00,000+">₹10,00,000+</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-4"
          >
            Complete Onboarding & Start Sourcing <ArrowRight size={16} />
          </button>

        </form>
      </div>
    </div>
  );
}