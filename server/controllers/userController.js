import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET current logged-in user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, user });
});

// UPDATE current user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { name, firstName, lastName, phone, gender, businessName, gstin, operatingHours, description, address } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const resolvedName = name || (firstName ? `${firstName} ${lastName || ''}`.trim() : user.name);
  user.name = resolvedName;
  if (phone) user.phone = phone;
  if (gender) user.gender = gender;
  if (businessName !== undefined) user.businessName = businessName;
  if (gstin !== undefined) user.gstin = gstin;
  if (operatingHours !== undefined) user.operatingHours = operatingHours;
  if (description !== undefined) user.description = description;
  if (address) {
    user.address = {
      street: address.street || user.address?.street || '',
      city: address.city || user.address?.city || '',
      state: address.state || user.address?.state || '',
      pincode: address.pincode || user.address?.pincode || '',
    };
  }

  const updatedUser = await user.save();
  res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedUser });
});

// GET user addresses
export const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, addresses: user.addresses || [] });
});

// ADD address
export const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const addressData = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.addresses.push(addressData);
  await user.save();

  const newAddress = user.addresses[user.addresses.length - 1];
  res.status(201).json({ success: true, address: newAddress, addresses: user.addresses });
});

// DELETE address
export const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.addresses = user.addresses.filter((addr) => addr._id.toString() !== id);
  await user.save();

  res.status(200).json({ success: true, message: 'Address deleted successfully', addresses: user.addresses });
});

// GET Supplier profile by User ID
export const getSupplierProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'Supplier profile not found' });
  }

  res.status(200).json({
    success: true,
    businessName: user.businessName || user.name,
    phone: user.phone,
    address: user.address || {},
    operatingHours: user.operatingHours || 'Mon - Sat: 9:00 AM - 7:00 PM',
    gstin: user.gstin || '',
    description: user.description || '',
    email: user.email,
  });
});

// UPDATE Supplier profile by User ID
export const updateSupplierProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const targetId = req.user?._id || userId;

  const user = await User.findById(targetId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { businessName, phone, address, operatingHours, gstin, description } = req.body;
  if (businessName !== undefined) user.businessName = businessName;
  if (phone) user.phone = phone;
  if (address) {
    user.address = {
      street: address.street || user.address?.street || '',
      city: address.city || user.address?.city || '',
      state: address.state || user.address?.state || '',
      pincode: address.pincode || user.address?.pincode || '',
    };
  }
  if (operatingHours !== undefined) user.operatingHours = operatingHours;
  if (gstin !== undefined) user.gstin = gstin;
  if (description !== undefined) user.description = description;

  await user.save();
  res.status(200).json({ success: true, message: 'Supplier profile updated successfully', user });
});
