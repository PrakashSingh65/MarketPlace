import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['BUYER', 'SUPPLIER'], required: true },
    isOnboarded: { type: Boolean, default: false },
    profileDetails: {
      businessName: String,
      businessType: String,
      phone: String,
      address: String,
      preferredCategories: [String],
      moqPreference: Number,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;