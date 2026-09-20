import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    buyerName: { type: String, default: '' },
    buyerEmail: { type: String, default: '' },
    buyerPhone: { type: String, default: '' },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      default: 'meters',
    },
    targetPrice: {
      type: Number,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Under Review', 'Responded', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Inquiry', inquirySchema);
