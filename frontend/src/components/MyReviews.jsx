import React from 'react';
import { Star } from 'lucide-react';

export default function MyReviews() {
  const reviews = [
    {
      id: 1,
      productName: 'Wireless Bluetooth Headphones',
      rating: 5,
      comment: 'Great sound quality and battery life is awesome!',
      date: '10 Aug 2026',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">My Reviews & Ratings</h2>
      {reviews.length === 0 ? (
        <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
          You haven't submitted any product reviews yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border border-gray-200 rounded-sm bg-slate-50 flex flex-col gap-1">
              <h3 className="font-semibold text-sm text-gray-800">{review.productName}</h3>
              <div className="flex items-center gap-1 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">{review.comment}</p>
              <span className="text-[10px] text-gray-400 mt-1">{review.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}