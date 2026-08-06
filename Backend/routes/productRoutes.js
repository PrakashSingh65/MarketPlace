import express from 'express';
import {
  getProducts,
  addProduct,
  getProductById,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), addProduct);
router.delete('/:id', deleteProduct);

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
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review Added Successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;