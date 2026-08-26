import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function InquiryModal({ isOpen, onClose, product }) {
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setQuantity(product?.moq || '');
      setMessage(`I am interested in ordering ${product?.title}. Please provide more information about shipping and bulk pricing.`);
      setSuccess(false);
      setError('');
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  if (!isOpen && !isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to send an inquiry.');
      return;
    }
    
    if (quantity < (product?.moq || 1)) {
      setError(`Minimum order quantity is ${product?.moq || 1} meters.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: product._id,
          supplierId: product.supplierId?._id || product.supplierId,
          quantity: Number(quantity),
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to send inquiry');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-sm bg-slate-900/40' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-slate-800">Send Inquiry</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Inquiry Sent!</h3>
              <p className="text-slate-500">The supplier will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-sm text-slate-500 mb-1">Product</p>
                <p className="font-semibold text-slate-800">{product?.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Quantity (Meters)
                  </label>
                  <input
                    type="number"
                    required
                    min={product?.moq || 1}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow text-slate-800"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">Min Order: {product?.moq}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Est. Total
                  </label>
                  <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium">
                    ₹{((quantity || 0) * (product?.pricePerMeter || 0)).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message to Supplier
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow text-slate-800 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}