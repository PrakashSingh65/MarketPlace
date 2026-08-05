import mongoose from 'mongoose';

// 1. Review Sub-schema
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 2. Product Schema with Rating & Review Fields
const productSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    pricePerMeter: { type: Number },
    price: { type: Number },
    moq: { type: Number, default: 50 },
    stockMeters: { type: Number, default: 50 },
    stock: { type: Number, default: 50 },
    gsm: Number,
    composition: String,
    colors: [String],
    images: [String],
    image: String,
    isAvailable: { type: Boolean, default: true },
    
    // Rating and Reviews Fields
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;