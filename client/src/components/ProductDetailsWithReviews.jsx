import { useState } from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetProductById, useAddProductReview } from '../api/productApi';

export default function ProductDetailsWithReviews({ productId }) {
  const { data: product, isLoading: loading } = useGetProductById(productId);
  const addReviewMutation = useAddProductReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addReviewMutation.mutateAsync({
        id: productId,
        reviewData: { rating: Number(rating), comment: comment.trim() }
      });

      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review. Please ensure you are logged in.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400 text-xs">Loading reviews...</div>;
  if (!product) return null;

  const reviews = product.reviews || [];

  return (
    <div className="max-w-7xl mx-auto mt-12 bg-[#0f0c1b]/80 border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
      <div className="border-b border-purple-900/40 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-orange-400" size={20} /> Verified Buyer Feedback & Reviews
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real feedback from garment manufacturers and textile buyers
          </p>
        </div>
        <div className="flex items-center gap-3 bg-purple-950/60 border border-purple-800/40 px-4 py-2 rounded-2xl w-fit">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.round(product.rating || 5) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="font-bold text-white text-sm">
            {(product.rating || 5).toFixed(1)} / 5.0
          </span>
          <span className="text-xs text-purple-300">({product.numReviews || reviews.length} reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Write a Review */}
        <div className="lg:col-span-5 bg-[#0a0718] border border-purple-900/30 p-6 rounded-2xl space-y-4 h-fit">
          <h3 className="text-sm font-bold text-white">Share Your Fabric Evaluation</h3>
          <p className="text-xs text-slate-400">
            Rate GSM density, color consistency, and handfeel accuracy.
          </p>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-amber-400 hover:scale-110 transition cursor-pointer"
                  >
                    <Star size={22} fill={star <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
                <span className="text-xs text-slate-400 font-semibold ml-2">
                  {rating === 5 ? 'Excellent Quality' : rating === 4 ? 'Good Quality' : rating === 3 ? 'Average' : 'Below Expectation'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Comments & Notes</label>
              <textarea
                rows="4"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Mention yarn feel, shrinkage test results, dyeing fastness..."
                className="w-full bg-[#070714] border border-purple-900/40 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={addReviewMutation.isPending}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
            >
              {addReviewMutation.isPending ? 'Submitting...' : 'Post Evaluation'}
            </button>
          </form>
        </div>

        {/* RIGHT: Existing Reviews */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-white">Recent Buyer Reviews ({reviews.length})</h3>

          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-[#0a0718] border border-purple-900/30 rounded-2xl">
              <p className="text-xs text-slate-400">No buyer reviews submitted yet for this fabric.</p>
              <p className="text-[11px] text-purple-400 mt-1">Be the first to submit a review!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {reviews.map((rev, idx) => (
                <div
                  key={rev._id || idx}
                  className="bg-[#0a0718] border border-purple-900/30 p-4 rounded-2xl space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{rev.name || 'Verified Buyer'}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} /> Verified Purchase
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill={i < rev.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-slate-500 block">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}