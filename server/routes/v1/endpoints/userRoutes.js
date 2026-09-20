import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAddresses,
  addAddress,
  deleteAddress,
  getSupplierProfile,
  updateSupplierProfile,
} from '../../../controllers/userController.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';

const router = express.Router();

// Current user profile routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

// Address routes
router.get('/addresses', authMiddleware, getAddresses);
router.post('/addresses', authMiddleware, addAddress);
router.delete('/addresses/:id', authMiddleware, deleteAddress);

// Parametric profile routes (for supplier profiles)
router.get('/profile/:userId', getSupplierProfile);
router.put('/profile/:userId', authMiddleware, updateSupplierProfile);

export default router;
