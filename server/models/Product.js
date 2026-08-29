import mongoose from 'mongoose';

// Review Sub-schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, default: 'Anonymous Buyer' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Main Product Schema (B2B Textile Focused)
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, lowercase: true, trim: true },
    subCategory: { type: String, trim: true, lowercase: true },
    
    // Pricing & Inventory
    price: { type: Number, required: true, min: 0 },
    priceUnit: { type: String, enum: ['meter', 'yard', 'kg', 'piece'], default: 'meter' },
    moq: { type: Number, default: 50, min: 1 }, // Minimum Order Quantity
    stock: { type: Number, required: true, default: 0, min: 0 },

    // Fabric/Textile Specific Specifications
    gsm: { type: Number, min: 0 }, // Grams per Square Meter
    width: { type: String }, // e.g., "58 inches"
    composition: { type: String, trim: true }, // e.g., "100% Cotton", "80% Poly 20% Cotton"
    weaveType: { type: String, trim: true }, // e.g., "Plain", "Twill", "Satin"
    colors: [{ type: String, trim: true }],

    // Media
    image: { type: String, required: true }, // Main featured image
    images: [{ type: String }], // Additional product gallery photos

    // Supplier Info (B2B Multi-vendor Support)
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Ratings & Reviews
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Fast Search ke liye Text Indexing Enable karein
productSchema.index({ 
  title: 'text', 
  description: 'text', 
  category: 'text', 
  composition: 'text' 
});

// Duplicate Model compilation errors se bachne ke liye standard check
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;