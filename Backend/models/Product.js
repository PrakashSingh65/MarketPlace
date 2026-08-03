import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    pricePerMeter: { type: Number, required: true },
    moq: { type: Number, required: true, default: 50 },
    stockMeters: { type: Number, required: true },
    gsm: Number,
    composition: String,
    colors: [String],
    images: [String],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;