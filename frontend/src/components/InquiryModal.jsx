import { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function InquiryModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(product?.minOrderQty || 50);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan Backend par inquiry Save / Email bhejne ki API lag sakti hai
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-800">Inquiry Sent!</h3>
            <p className="text-slate-500 text-sm">
              Supplier ko aapki requirement bhej di gayi hai. Wo aapse jald hi contact karenge.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Send Bulk Inquiry</h2>
            <p className="text-xs text-slate-500 mb-4">
              Item: <strong className="text-indigo-600">{product.title}</strong> (Min Qty: {product.minOrderQty} meters)
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Required Quantity (Meters)</label>
                <input
                  type="number"
                  min={product.minOrderQty}
                  required
                  className="w-full p-2.5 border rounded-lg focus:outline-indigo-600 text-sm"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Message / Delivery Location</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Need 500 meters delivered to Kanpur by next week..."
                  className="w-full p-2.5 border rounded-lg focus:outline-indigo-600 text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 flex justify-between">
                <span>Estimated Price:</span>
                <strong className="text-emerald-700 font-bold">₹{quantity * product.pricePerMeter}</strong>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <Send size={16} /> Submit Requirement
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}