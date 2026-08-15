const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    subCategory: { type: String },
    price: { type: Number, required: true },
    pricePerMeter: { type: Number },
    moq: { type: Number, default: 50 },
    stock: { type: Number, default: 50 },
    stockMeters: { type: Number, default: 50 },
    gsm: { type: Number },
    composition: { type: String },
    colors: [{ type: String }],
    image: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);