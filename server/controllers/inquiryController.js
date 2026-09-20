import Inquiry from '../models/Inquiry.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createInquiry = asyncHandler(async (req, res) => {
  const { productId, supplierId, quantity, unit, targetPrice, message, buyerName, buyerEmail, buyerPhone } = req.body;

  if (!productId || !quantity || !message) {
    return res.status(400).json({ success: false, message: 'Product, quantity, and message are required' });
  }

  let resolvedSupplierId = supplierId;
  if (!resolvedSupplierId) {
    const product = await Product.findById(productId);
    if (product) {
      resolvedSupplierId = product.supplier;
    }
  }

  const newInquiry = new Inquiry({
    product: productId,
    supplier: resolvedSupplierId || null,
    buyer: req.user?._id || null,
    buyerName: buyerName || req.user?.name || 'Prospective Buyer',
    buyerEmail: buyerEmail || req.user?.email || '',
    buyerPhone: buyerPhone || req.user?.phone || '',
    quantity: Number(quantity),
    unit: unit || 'meters',
    targetPrice: targetPrice ? Number(targetPrice) : undefined,
    message,
    status: 'New',
  });

  const savedInquiry = await newInquiry.save();

  res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully. Supplier will contact you shortly.',
    inquiry: savedInquiry,
  });
});

export const getUserInquiries = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const inquiries = await Inquiry.find({
    $or: [{ buyer: userId }, { supplier: userId }],
  })
    .populate('product', 'title price image category')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, inquiries });
});
