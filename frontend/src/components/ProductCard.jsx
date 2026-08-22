import React from 'react';

const API_IMAGE_URL = 'http://localhost:5000';

const ProductCard = ({ product }) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
      <div>
        <img
          src={product.image?.startsWith('http') ? product.image : `${API_IMAGE_URL}${product.image}`}
          alt={product.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Fabric+Image';
          }}
        />
        <div className="p-4">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-md uppercase mb-2">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-gray-900 truncate">{product.title}</h3>
          
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            {product.gsm && <p><strong>GSM:</strong> {product.gsm}</p>}
            {product.composition && <p><strong>Composition:</strong> {product.composition}</p>}
            <p><strong>MOQ:</strong> {product.moq} {product.priceUnit || 'meters'}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <span className="text-lg font-extrabold text-blue-600">
            ₹{product.price}
          </span>
          <span className="text-xs text-gray-500">/{product.priceUnit || 'm'}</span>
        </div>
        <div className="flex items-center text-amber-500 font-semibold text-sm">
          ★ {product.rating ? product.rating.toFixed(1) : 'New'}
          <span className="text-xs text-gray-400 ml-1">({product.numReviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;