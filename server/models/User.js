import { model, Schema } from "mongoose"
import bcrypt from "bcryptjs"


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
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
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
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12)
  }
  next()
})

userSchema.methods.comparepassowrd = async function(password) {
  return await bcrypt.compare(password, this.password)
}

const User = new model("User", userSchema);

export default User;
