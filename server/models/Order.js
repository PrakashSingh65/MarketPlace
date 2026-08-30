import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      default: () => 'OD' + Date.now() + Math.floor(1000 + Math.random() * 9000)
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        title: { type: String, required: true },
        image: { type: String },
        seller: { type: String, default: 'OnestoLabs' },
        price: { type: Number, required: true },
        listingPrice: { type: Number },
        specialPrice: { type: Number },
        platformFee: { type: Number, default: 19 },
        quantity: { type: Number, required: true, default: 1 }
      }
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String },
      address: { type: String },
      city: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Cash On Delivery', 'cod', 'Online', 'Razorpay', 'UPI', 'upi', 'Card'],
      default: 'Razorpay'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    pricing: {
      listingPrice: { type: Number, default: 0 },
      specialPrice: { type: Number, default: 0 },
      totalPlatformFee: { type: Number, default: 0 },
      totalDiscount: { type: Number, default: 0 }
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Order Confirmed', 'Pending', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Confirmed'
    },
    timeline: [
      {
        title: { type: String },
        date: { type: String },
        description: { type: String },
        completed: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);