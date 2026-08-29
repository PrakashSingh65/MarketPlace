import React, { useState } from 'react';
import { useGetProductById, useAddProductReview } from '../api/productApi';

const ProductDetailsWithReviews = ({ productId }) => {
  const { data: product, isLoading: loading } = useGetProductById(productId);
  const addReviewMutation = useAddProductReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Submit new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await addReviewMutation.mutateAsync({
        id: productId,
        reviewData: { rating: Number(rating), comment }
      });

      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      setComment('');
      setRating(5);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to submit review. Please log in.' 
      });
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading product...</div>;
  if (!product) return <div className="p-6 text-center text-red-500">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6 space-y-8">
      {/* Product Overview Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.title}
          className="w-full md:w-1/3 h-64 object-cover rounded-lg"
        />
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
          <div className="text-xl font-semibold text-blue-600">
            ₹{product.price} / {product.priceUnit || 'meter'}
          </div>
          <div className="text-sm text-yellow-600 font-medium">
            Rating: ★ {product.rating.toFixed(1)} ({product.numReviews} buyer reviews)
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Review Submission Form */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Write a Buyer Review</h3>

        {message.text && (
          <div
            className={`p-3 rounded-md mb-4 text-sm ${
              message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5 - Excellent Quality</option>
              <option value="4">4 - Good Quality</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Below Expectation</option>
              <option value="1">1 - Poor Quality</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Comment</label>
            <textarea
              rows="4"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe fabric feel, color accuracy, defect check, or delivery experience..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={addReviewMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Existing Reviews List */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Buyer Reviews ({product.reviews.length})</h3>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet for this product.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev._id} className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{rev.name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-amber-500 text-sm">{'★'.repeat(rev.rating)}</div>
                <p className="text-gray-600 text-sm">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsWithReviews;