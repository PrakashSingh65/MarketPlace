import { model, Schema } from "mongoose"
import bcrypt from "bcryptjs"


const addressSchema = new Schema({
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  pincode: { type: String, default: "" },
  locality: { type: String, default: "" },
  address: { type: String, default: "" },
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  type: { type: String, default: "Home" },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["BUYER", "SUPPLIER"],
      default: "BUYER",
      uppercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    businessName: { type: String, default: "" },
    gstin: { type: String, default: "" },
    operatingHours: { type: String, default: "Mon - Sat: 9:00 AM - 7:00 PM" },
    description: { type: String, default: "" },
    gender: { type: String, default: "Male" },
    addresses: [addressSchema],
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

export default User;
