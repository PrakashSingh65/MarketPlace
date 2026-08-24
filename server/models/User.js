import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Password automatically queries me response me nahi jaayega
    },
    role: {
      type: String,
      enum: ['BUYER', 'SUPPLIER'],
      default: 'BUYER',
      uppercase: true
    },

    // Supplier Specific Profile Fields
    businessName: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    address: {
      street: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      pincode: { 
        type: String, 
        trim: true, 
        default: '',
        match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Pincode']
      }
    },
    operatingHours: {
      type: String,
      default: 'Mon - Sat: 9:00 AM - 7:00 PM'
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Please enter a valid GSTIN format'
      ]
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes optimization for performance
userSchema.index({ role: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;