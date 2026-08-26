import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, role, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(401).json({
      message: "User already exists",
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
    generateToken(newUser._id, res);
    return res.status(201).json({
      message: "user registered successfully",
      success: true,
    });
  } else {
    return res.status(409).json({
      message: "User registration failed",
      success: false,
    });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email }).select("+password");

  if (!userExists) {
    return res.status(409).json({
      message: "User does not exist",
      success: false,
    });
  }

  const isPasswordValid = await userExists.comparePassword(password);
  console.log("Password valid:", isPasswordValid);

  if (!isPasswordValid) {
    return res.status(200).json({
      message: "Invalid credentials",
      success: false,
    });
  }

  generateToken(userExists._id, res);

  return res.status(200).json({
    message: "User logged in successfully",
    success: true,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
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
