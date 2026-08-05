import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bot, X, Send, Mic, MicOff, Sparkles, ArrowRight, Scale } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Namaste! Main aapka AI Textile Assistant hoon. Aap mujhse kisi bhi fabric ke baare me pooch sakte hain.",
      products: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [products, setProducts] = useState([]);
  const chatEndRef = useRef(null);

  // 🟢 Fetch marketplace products for AI recommendations (Updated to /api/products)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products for AI:", error);
      }
    };

    fetchProducts();
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

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

  // Send Message & AI Logic
  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const query = input.toLowerCase();
    setInput('');

    // AI Recommendation Logic based on fetched products
    setTimeout(() => {
      const matchedProducts = products.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(query) || p.title?.toLowerCase().includes(query);
        const categoryMatch = p.category?.toLowerCase().includes(query);
        const materialMatch = p.material?.toLowerCase().includes(query);
        return nameMatch || categoryMatch || materialMatch;
      });

      let aiReplyText = "Main aapki requirement samajh gaya hoon. Yahan kuch relevant textile options hain:";

      if (matchedProducts.length === 0) {
        aiReplyText = "Aapke query ke mutabiq filhal koi exact match nahi mila, lekin aap hamare marketplace catalog me explore kar sakte hain.";
      }

      const aiReply = {
        sender: 'ai',
        text: aiReplyText,
        products: matchedProducts.slice(0, 3) // Top 3 recommendations
      };

      setMessages((prev) => [...prev, aiReply]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl transition flex items-center gap-2 group border border-indigo-400/30"
        >
          <Bot size={24} className="animate-bounce" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pr-1">
            AI Assistant
          </span>
        </button>
      )}

      {/* AI Chat Drawer / Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
          
          {/* Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Textile AI Advisor <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-slate-400">Smart Sourcing & Fabric Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Recommended Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2 w-full">
                    {msg.products.map((product) => (
                      <div
                        key={product._id || product.id}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-3 hover:border-indigo-500/50 transition"
                      >
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300'}
                          alt={product.name || product.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-[11px] truncate">
                            {product.name || product.title}
                          </h4>
                          <p className="text-[10px] text-indigo-400 font-semibold">
                            ₹{product.price} / meter
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-xl border transition ${
                isListening
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Voice Search"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              placeholder="Ask e.g. Cotton fabric under 200..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition shadow-md shadow-indigo-600/30"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}