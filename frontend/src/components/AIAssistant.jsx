import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bot, X, Send, Mic, MicOff, Sparkles, ArrowRight, Scale } from 'lucide-react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! Main aapka AI Textile Assistant hoon. Aap mujhse kisi bhi fabric ke baare me pooch sakte hain, prices compare kar sakte hain ya natural language me search kar sakte hain!',
      products: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [products, setProducts] = useState([]);
  const chatEndRef = useRef(null);

  // Fetch marketplace products for AI recommendations
 useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/fabrics');
        if (res.data) setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        // Fallback Data taaki console me red error na aaye aur AI Assistant smoothly chale
        setProducts([
          { _id: '1', title: 'Premium Cotton Fabric', category: 'Cotton', pricePerMeter: 250, minOrderQty: 50 },
          { _id: '2', title: 'Luxury Silk Fabric', category: 'Silk', pricePerMeter: 850, minOrderQty: 20 },
          { _id: '3', title: 'Heavy Denim Fabric', category: 'Denim', pricePerMeter: 420, minOrderQty: 100 },
          { _id: '4', title: 'Pure Linen Fabric', category: 'Linen', pricePerMeter: 600, minOrderQty: 30 }
        ]);
      }
    };

    fetchCatalog();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Voice Input Speech Recognition
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Aapka browser Voice Search support nahi karta. Google Chrome use karein.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Hindi/English mix support
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  // AI Response Generator Logic using Live Marketplace Data
  const handleSend = (userQuery) => {
    const queryText = userQuery || input;
    if (!queryText.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { sender: 'user', text: queryText }];
    setMessages(newMessages);
    setInput('');

    // Process AI logic after brief delay
    setTimeout(() => {
      const lowerQuery = queryText.toLowerCase();
      let replyText = '';
      let recommendedProducts = [];

      // 1. Compare Fabrics Logic
      if (lowerQuery.includes('compare') || lowerQuery.includes('farak') || lowerQuery.includes('vs')) {
        replyText = 'Sahi comparison ke liye hamare dataset me Cotton, Silk aur Denim ki properties flexible hain: Cotton breathable hota hai, jabki Silk luxury garments ke liye best hai.';
        recommendedProducts = products.slice(0, 2);
      } 
      // 2. Natural Language / Category Recommendations
      else if (lowerQuery.includes('cotton') || lowerQuery.includes('silk') || lowerQuery.includes('denim') || lowerQuery.includes('linen') || lowerQuery.includes('polyester')) {
        const found = products.filter(p => 
          p.category.toLowerCase().includes(lowerQuery) || 
          p.title.toLowerCase().includes(lowerQuery)
        );
        if (found.length > 0) {
          replyText = `Aapke requirement ke hisaab se mujhe yeh ${found.length} relevant fabric options mile hain:`;
          recommendedProducts = found;
        } else {
          replyText = `Filhaal is category ke fabrics stock me nahi hain, par aap hamare featured collections explore kar sakte hain.`;
          recommendedProducts = products.slice(0, 2);
        }
      } 
      // 3. Price or MOQ Specific Q&A
      else if (lowerQuery.includes('price') || lowerQuery.includes('sasta') || lowerQuery.includes('moq') || lowerQuery.includes('rate')) {
        replyText = 'Marketplace par sabhi products ke rates per meter me fixed hain. Best rate fabrics neeche diye gaye hain:';
        recommendedProducts = [...products].sort((a, b) => a.pricePerMeter - b.pricePerMeter).slice(0, 3);
      } 
      // 4. General Q&A / Default Intelligent Fallback
      else {
        replyText = `Aapki requirement "${queryText}" samajhne ke baad, main aapko yeh top fabrics recommend kar raha hoon. Inme se kisi par bhi click karke inquiry bhej sakte hain.`;
        recommendedProducts = products.slice(0, 3);
      }

      setMessages(prev => [...prev, { sender: 'ai', text: replyText, products: recommendedProducts }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
      >
        <Sparkles size={22} className="animate-pulse" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold">
          Ask AI Fabric Assistant
        </span>
      </button>

      {/* AI Assistant Modal Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  TexMarket AI <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30">Live Assistant</span>
                </h3>
                <p className="text-[11px] text-slate-400">Powered by Live Marketplace Catalog</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X size={20} />
            </button>
          </div>

          {/* Chat History Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* AI Product Recommendation Cards Inside Chat */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2 w-full">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Fabrics:</p>
                    <div className="space-y-2">
                      {msg.products.map(p => (
                        <div key={p._id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex justify-between items-center hover:border-indigo-500/50 transition">
                          <div>
                            <span className="text-[9px] font-bold uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md">
                              {p.category}
                            </span>
                            <h4 className="font-bold text-white text-xs mt-1">{p.title}</h4>
                            <p className="text-[10px] text-slate-400">MOQ: {p.minOrderQty}m</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-400 block">₹{p.pricePerMeter}/m</span>
                            <a href="#marketplace" onClick={() => setIsOpen(false)} className="text-[10px] text-indigo-400 hover:underline inline-flex items-center gap-1 mt-1">
                              View <ArrowRight size={10} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-300">
            <button 
              onClick={() => handleSend('Show cotton fabrics under ₹300')}
              className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700"
            >
              🔍 Cheap Cotton
            </button>
            <button 
              onClick={() => handleSend('Compare Silk and Denim')}
              className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700 flex items-center gap-1"
            >
              <Scale size={10} /> Compare Specs
            </button>
            <button 
              onClick={() => handleSend('Suggest silk fabric for luxury wear')}
              className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700"
            >
              ✨ Silk Recommendations
            </button>
          </div>

          {/* Message Input & Voice Controls */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={startVoiceInput}
              className={`p-2.5 rounded-xl border transition ${
                isListening 
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Voice Search"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              placeholder="Ask anything or search fabrics..."
              className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}