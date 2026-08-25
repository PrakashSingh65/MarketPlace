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
    res.status(201).json({
      message: "user registered successfully",
      success: true,
    });
  } else {
    res.status(409).json({
      message: "User registration failed",
      success: false,
    });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(409).json({
      message: "User does not exist",
      success: false,
    });
  }

  const isPasswordValid = await userExists.comparePassword(password);

  if (!isPasswordValid) {
    res.status(200).json({
      message: "Invalid credentials",
      success: false,
    });

    generateToken(userExists._id, res);
    res.status(200).json(userExists, {
      message: "User logged in successfully",
      success: true,
    });
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res
    .status(200)
    .json({ message: "User logged out successfully", success: true });
});

export const checkAuth = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(req.user, { message: "User is authenticated", success: true });
});
