import express from 'express';
import { getProducts, addProduct, getProductById } from '../controllers/productController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', verifyToken, checkRole(['SUPPLIER']), addProduct);

//  POST /api/products/:id/reviews (Review & Rating Route)
router.post('/:id/reviews', async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      name: name || 'Anonymous Buyer',
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    // Average Rating calculate karein
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;