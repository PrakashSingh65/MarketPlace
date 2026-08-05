import { useState } from 'react';
import { Star, X, MessageSquare, User } from 'lucide-react';

export default function ProductReviewModal({ product, onClose, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewerName || 'Verified Buyer',
          rating,
          comment
        })
      });

      if (res.ok) {
        onReviewSubmitted();
        onClose();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">{product.title || product.name}</h2>
            <p className="text-xs text-slate-400">Ratings & Customer Feedback</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <MessageSquare size={14} className="text-indigo-400" /> Customer Reviews ({product.reviews?.length || 0})
          </h3>
          
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {(!product.reviews || product.reviews.length === 0) ? (
              <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to review!</p>
            ) : (
              product.reviews.map((rev, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <User size={12} className="text-slate-500" /> {rev.name}
                    </span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px]">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Write a Review Form */}
        <form onSubmit={handleSubmit} className="border-t border-slate-800 pt-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-200">Write a Review</h3>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-amber-400 transition hover:scale-110"
                >
                  <Star size={20} fill={star <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Your Name (Optional)"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <textarea
            required
            rows={3}
            placeholder="Write your feedback about material quality, feel, etc..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

      </div>
    </div>
  );
}