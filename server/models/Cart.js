import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // String rakha hai taaki ObjectIds aur Dummy IDs dono handle ho ske
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);