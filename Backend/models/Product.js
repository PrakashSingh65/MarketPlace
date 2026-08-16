import mongoose from 'mongoose';

// Review Sub-schema
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: 'Anonymous Buyer' },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// Main Product Schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true, lowercase: true, trim: true },
    subCategory: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    pricePerMeter: { type: Number, min: 0 },
    moq: { type: Number, default: 50 },
    stock: { type: Number, default: 50 },
    stockMeters: { type: Number, default: 50 },
    gsm: { type: Number },
    composition: { type: String },
    colors: [{ type: String }],
    image: { type: String },
    images: [{ type: String }],
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

// Default export ensure karein taaki controller me 'import Product from ...' kaam kare
export default Product;