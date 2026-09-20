import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  ShoppingCart,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Calculator,
  Store,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../api/axiosClient';
import useCart from '../hooks/useCart';

// Initial welcome suggestions
const QUICK_SUGGESTIONS = [
  { icon: HelpCircle, label: "What is LeloBhai?", query: "What is LeloBhai and how does this marketplace work?" },
  { icon: Calculator, label: "Estimate Bulk Cost", query: "How does the GSM and Bulk Consignment Cost Estimator work?" },
  { icon: Layers, label: "Cotton Under ₹250", query: "Show me cotton fabrics under 250" },
  { icon: Store, label: "Sell as a Mill", query: "How can I register as a textile mill and sell fabrics?" },
  { icon: ShieldCheck, label: "Escrow Protection", query: "How does Escrow payment protection work?" },
];

// Rich text formatter for assistant replies
function FormattedMessage({ text }) {
  if (!text) return null;

  // Split by newlines
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-xs leading-relaxed text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Bullet point
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
        const lineContent = isBullet ? trimmed.replace(/^[•-]\s*/, '') : trimmed;

        // Bold formatting **text**
        const parts = lineContent.split(/(\*\*.*?\*\*)/g);

        const renderedLine = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-semibold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={i} className="px-1 py-0.5 bg-slate-800 text-orange-400 rounded text-[11px] font-mono">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-orange-400 text-sm leading-none">•</span>
              <span className="flex-1">{renderedLine}</span>
            </div>
          );
        }

        return <p key={idx}>{renderedLine}</p>;
      })}
    </div>
  );
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Namaste! 🙏 Main aapka **LeloBhai Textile & Marketplace AI Advisor** hoon.\n\nAap mujhse kisi bhi fabric (GSM, Weave, Shrinkage), bulk rates, mill sourcing, ya platform features ke baare me pooch sakte hain.",
      products: [],
      suggestions: [
        "What is LeloBhai?",
        "Show Cotton fabrics under 300",
        "How to sell as a Mill?",
        "How does Escrow work?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cachedProducts, setCachedProducts] = useState([]);

  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Load products for client-side fallback
  useEffect(() => {
    const fetchLocalProducts = async () => {
      try {
        const res = await axiosClient.get('/product');
        const list = Array.isArray(res.data) ? res.data : (res.data?.products || []);
        setCachedProducts(list);
      } catch (err) {
        console.warn("Could not cache products for AI:", err.message);
      }
    };
    fetchLocalProducts();
  }, []);

  // Client-side fallback knowledge in case backend is offline
  const getFallbackResponse = useCallback((queryStr) => {
    const q = queryStr.toLowerCase();

    // 1. Escrow & Security
    if (q.includes("escrow") || q.includes("safe") || q.includes("payment") || q.includes("security")) {
      return {
        answer: "🛡️ **100% Escrow Trade Protection on LeloBhai:**\n• Payments are safely held in an Escrow account via Razorpay/banking partners.\n• Fabric consignments are shipped with GST e-way tracking.\n• Funds are released to the textile mill only once you receive and inspect the fabric lots.",
        suggestions: ["Estimate Bulk Cost", "View Cart", "Browse Fabrics"],
        action: { label: "Go to Cart", url: "/cart" }
      };
    }

    // 2. Selling as Mill
    if (q.includes("sell") || q.includes("supplier") || q.includes("mill") || q.includes("vendor") || q.includes("bech")) {
      return {
        answer: "🏭 **Selling as a Textile Mill / Weaver:**\n• Register for free on LeloBhai and access 15,000+ verified garment manufacturers.\n• Upload your weaves with GSM, yarn count, and roll width specs.\n• Enjoy 0% commission and 48-hour direct mill payouts upon buyer delivery confirmation.",
        suggestions: ["Go to Supplier Dashboard", "Add Product", "What is LeloBhai?"],
        action: { label: "Supplier Dashboard", url: "/supplier-dashboard" }
      };
    }

    // 3. GSM & Estimator
    if (q.includes("gsm") || q.includes("cost") || q.includes("price") || q.includes("estimator") || q.includes("calculate")) {
      return {
        answer: "⚖️ **GSM & Bulk Consignment Cost Guide:**\n• **< 130 GSM**: Lightweight shirting, voile, cambric, scarves.\n• **130–220 GSM**: Regular poplin, suiting linen, premium tees.\n• **> 220–450+ GSM**: Heavyweight denim, canvas, french terry hoodies.\n• Get 5% to 15% wholesale tier discounts for bulk orders on LeloBhai!",
        suggestions: ["Show Cotton under 250", "Estimate 180 GSM Cotton", "How to Sell?"],
        action: { label: "Open Bulk Estimator", url: "/#estimator" }
      };
    }

    // 4. Default Catalog Fallback Search
    const matched = cachedProducts.filter((p) => {
      const name = (p.name || p.title || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const words = q.split(' ').filter(w => w.length > 2);
      return words.some(w => name.includes(w) || cat.includes(w));
    });

    return {
      answer: matched.length > 0
        ? `Found **${matched.length} matching fabric consignments** available directly from verified mills:`
        : "Namaste! I am your **LeloBhai Textile AI Advisor**. Ask me anything about fabric specifications (GSM, weave, shrinkage), wholesale rates, order tracking, or how to sell as a mill.",
      products: matched.slice(0, 3),
      suggestions: ["What is LeloBhai?", "Show Cotton Fabrics", "Estimate Bulk Cost", "How does Escrow work?"],
      action: { label: "Explore Marketplace", url: "/marketplace" }
    };
  }, [cachedProducts]);

  // Main query execution
  const handleExecuteQuery = useCallback(async (queryText) => {
    const cleanQuery = (queryText || '').trim();
    if (!cleanQuery) return;

    // Add user message to UI
    const userMsg = { sender: 'user', text: cleanQuery };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Attempt backend AI endpoint first
      const res = await axiosClient.post('/ai/chat', { message: cleanQuery });

      if (res.data && res.data.success) {
        const aiMsg = {
          sender: 'ai',
          text: res.data.answer,
          products: res.data.products || [],
          suggestions: res.data.suggestions || [],
          action: res.data.action || null
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("Invalid backend AI response");
      }
    } catch {
      // Fallback seamlessly to client-side knowledge engine
      const fallback = getFallbackResponse(cleanQuery);
      const aiMsg = {
        sender: 'ai',
        text: fallback.answer,
        products: fallback.products || [],
        suggestions: fallback.suggestions || [],
        action: fallback.action || null
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [getFallbackResponse]);

  // Global event listener to open AI Assistant from anywhere in the app
  useEffect(() => {
    const handleGlobalTrigger = (e) => {
      setIsOpen(true);
      if (e.detail?.query) {
        handleExecuteQuery(e.detail.query);
      }
    };

    window.addEventListener('open-ai-assistant', handleGlobalTrigger);
    return () => window.removeEventListener('open-ai-assistant', handleGlobalTrigger);
  }, [handleExecuteQuery]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Voice Search Handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Automatically submit voice query
        handleExecuteQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    handleExecuteQuery(input);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        sender: 'ai',
        text: "Conversation cleared. How can I help with your textile sourcing or marketplace inquiries today?",
        products: [],
        suggestions: [
          "What is LeloBhai?",
          "Show Cotton fabrics under 300",
          "How to sell as a Mill?",
          "How does Escrow work?"
        ]
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Closed State: Floating Glowing Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-purple-600 hover:from-orange-400 hover:to-purple-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-[0_10px_35px_-5px_rgba(249,115,22,0.5)] transition-all duration-300 transform hover:scale-105 border border-white/20"
          aria-label="Open AI Textile Assistant"
        >
          {/* Animated ping ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
          </span>

          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Bot size={20} className="animate-pulse text-white" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold leading-tight flex items-center gap-1">
              Ask Textile AI <Sparkles size={12} className="text-yellow-200" />
            </span>
            <span className="text-[10px] text-white/80 leading-tight">Ask anything in project</span>
          </div>
        </button>
      )}

      {/* Open State: Full Chat Window */}
      {isOpen && (
        <div
          className={`bg-[#0d091e] border border-purple-500/30 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-slate-100 transition-all duration-300 ${
            isExpanded
              ? 'w-[92vw] sm:w-[540px] md:w-[600px] h-[82vh] max-h-[720px]'
              : 'w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh]'
          }`}
        >
          {/* Top Bar Header */}
          <div className="bg-gradient-to-r from-[#130b2c] via-[#1a0f3c] to-[#120826] p-4 border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 p-[1.5px] shadow-lg shadow-orange-500/20">
                  <div className="w-full h-full bg-[#0e0724] rounded-2xl flex items-center justify-center text-orange-400">
                    <Sparkles size={18} />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0d091e] rounded-full"></span>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  LeloBhai Textile AI
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Ask anything about fabrics, orders & platform</p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                title="Clear Chat History"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                title={isExpanded ? "Collapse View" : "Expand View"}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                title="Close AI Assistant"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Quick Pre-populated Prompt Chips */}
          <div className="px-3.5 py-2 bg-[#090616] border-b border-purple-900/30 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {QUICK_SUGGESTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleExecuteQuery(item.query)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-purple-950/60 border border-purple-500/20 hover:border-purple-400 text-[10px] font-medium text-slate-300 hover:text-white whitespace-nowrap transition"
                >
                  <Icon size={11} className="text-orange-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-none shadow-orange-500/10'
                      : 'bg-[#130b2c] border border-purple-500/20 text-slate-200 rounded-bl-none shadow-purple-950/40'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="text-xs leading-relaxed text-white font-medium">{msg.text}</p>
                  ) : (
                    <FormattedMessage text={msg.text} />
                  )}
                </div>

                {/* Direct Action Navigation Pill if provided by AI */}
                {msg.action && (
                  <div className="mt-2 pl-1">
                    <button
                      onClick={() => {
                        if (msg.action.url.startsWith('/#')) {
                          navigate('/');
                          setTimeout(() => {
                            const id = msg.action.url.replace('/#', '');
                            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                          }, 300);
                        } else {
                          navigate(msg.action.url);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:text-orange-300 font-semibold text-[11px] transition shadow-sm"
                    >
                      <span>{msg.action.label}</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                )}

                {/* Product Recommendation Cards Carousel / List */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 space-y-2 w-full max-w-[92%]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                      Matched Consignments:
                    </p>
                    {msg.products.map((product) => {
                      const id = product._id || product.id;
                      const image = product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300';
                      return (
                        <div
                          key={id}
                          className="bg-[#12082b] border border-purple-500/20 hover:border-orange-500/40 rounded-2xl p-2.5 flex items-center justify-between gap-3 transition group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={image}
                              alt={product.name || 'Fabric'}
                              className="w-12 h-12 rounded-xl object-cover border border-purple-900/40 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-[11px] truncate group-hover:text-orange-400 transition">
                                {product.name || product.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 truncate">
                                {product.category || 'Textile Weave'}
                              </p>
                              <p className="text-[11px] font-extrabold text-amber-400 mt-0.5">
                                ₹{product.price} <span className="text-[9px] font-normal text-slate-400">/ meter</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                addToCart(product);
                              }}
                              className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition shadow-sm"
                              title="Add to Cart"
                            >
                              <ShoppingCart size={13} />
                            </button>
                            <button
                              onClick={() => {
                                navigate(`/product/${id}`);
                              }}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="View Details"
                            >
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Follow-up Suggestions Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pl-1">
                    {msg.suggestions.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleExecuteQuery(suggestion)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-orange-500/10 border border-slate-800 hover:border-orange-500/30 text-slate-300 hover:text-orange-300 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loader Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2 py-1">
                <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Bot size={13} className="animate-spin" />
                </div>
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                </div>
                <span className="text-[10px] text-slate-400 italic">Consulting Textile Knowledge Engine...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-gradient-to-t from-[#0a0518] to-[#0e0722] border-t border-purple-500/20 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-xl border transition ${
                  isListening
                    ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/40'
                }`}
                title={isListening ? "Listening... click to stop" : "Voice input (Hindi/English)"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder="Ask e.g. 180 GSM cotton, how escrow works..."
                className="flex-1 bg-slate-900/90 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 disabled:opacity-40 disabled:hover:from-orange-500 text-white p-2.5 rounded-xl transition shadow-lg shadow-orange-500/20"
                title="Send Message"
              >
                <Send size={15} />
              </button>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 px-1">
              <span>Supports Hindi & English</span>
              <span>LeloBhai AI v2.0 • Escrow Protected</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}