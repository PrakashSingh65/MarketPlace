import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['BUYER', 'SUPPLIER'], default: 'BUYER' },
    
    // Supplier Profile Fields
    businessName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' }
    },
    operatingHours: { type: String, default: 'Mon - Sat: 9:00 AM - 7:00 PM' },
    gstin: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;