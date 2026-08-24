import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, Building2, CheckCircle2, Sparkles } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();

  // Onboarding Questions Array
  const questions = [
    { key: 'businessName', text: "Welcome to the Marketplace!  What is your Business Name?" },
    { key: 'businessType', text: "Great! What type of business are you? (e.g. Manufacturer, Wholesaler, Fabric Mill)" },
    { key: 'phone', text: "Got it! Please share your primary Contact Number." },
    { key: 'address', text: "Where is your business located? (City & State)" },
    { key: 'operatingHours', text: "What are your Operating Hours? (e.g. Mon-Sat, 9 AM - 7 PM)" },
    { key: 'categories', text: "Which Product Categories do you specialize in? (e.g. Cotton, Silk, Denim)" },
    { key: 'fabrics', text: "What specific types of fabrics do you offer? (e.g. Organic Cotton, Premium Rayon)" },
    { key: 'moq', text: "What is your Minimum Order Quantity (MOQ)? (e.g. 100 meters, 50 rolls)" }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: questions[0].text }
  ]);
  const [input, setInput] = useState('');
  const [profileData, setProfileData] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const currentQuestionKey = questions[currentStep].key;

    // Save user answer
    const updatedProfile = { ...profileData, [currentQuestionKey]: userMessage };
    setProfileData(updatedProfile);

    // Update Chat History
    const newMessages = [...messages, { sender: 'user', text: userMessage }];

    if (currentStep + 1 < questions.length) {
      // Move to Next Question
      setCurrentStep(currentStep + 1);
      newMessages.push({ sender: 'ai', text: questions[currentStep + 1].text });
      setMessages(newMessages);
      setInput('');
    } else {
      // Onboarding Finished
      newMessages.push({
        sender: 'ai',
        text: "Awesome! 🎉 Your supplier profile has been set up successfully. Redirecting you to your Dashboard..."
      });
      setMessages(newMessages);
      setInput('');
      setIsCompleted(true);

      // Save to localStorage or Backend API
      localStorage.setItem('supplierProfile', JSON.stringify(updatedProfile));

      // Redirect to Supplier Dashboard after 2 seconds
      setTimeout(() => {
        navigate('/supplier-dashboard');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                AI Onboarding Assistant <Sparkles size={14} className="text-amber-400" />
              </h2>
              <p className="text-[10px] text-slate-400">Step {Math.min(currentStep + 1, questions.length)} of {questions.length}</p>
            </div>
          </div>
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold">
              <CheckCircle2 size={14} /> Completed
            </span>
          )}
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            disabled={isCompleted}
            placeholder={isCompleted ? "Onboarding finished!" : "Type your answer..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isCompleted || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}