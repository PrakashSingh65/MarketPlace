import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, role, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(409).json({
      message: "User with this email already exists",
      success: false,
    });
  }

  const newUser = await User.create({
    name,
    email,
    phone,
    role,
    password,
  });

  if (newUser) {
    const token = generateToken(newUser._id, res);
    const userSafe = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: userSafe,
    });
  } else {
    return res.status(400).json({
      message: "User registration failed",
      success: false,
    });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide both email and password",
      success: false,
    });
  }

  const userExists = await User.findOne({ email }).select("+password");

  if (!userExists) {
    return res.status(401).json({
      message: "Invalid email or password",
      success: false,
    });
  }

  const isPasswordValid = await userExists.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password",
      success: false,
    });
  }

  const token = generateToken(userExists._id, res);
  const userSafe = {
    _id: userExists._id,
    name: userExists.name,
    email: userExists.email,
    phone: userExists.phone,
    role: userExists.role,
    businessName: userExists.businessName,
    address: userExists.address,
  };

  return res.status(200).json({
    message: "User logged in successfully",
    success: true,
    token,
    user: userSafe,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: '/',
  });
  return res
    .status(200)
    .json({ message: "User logged out successfully", success: true });
});

export const checkAuth = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json({ message: "User is authenticated", success: true, user: req.user, });
});
