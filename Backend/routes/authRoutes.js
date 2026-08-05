import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// GET Supplier Profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Supplier Profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { businessName, phone, address, operatingHours, gstin, description } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        businessName,
        phone,
        address,
        operatingHours,
        gstin,
        description
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;