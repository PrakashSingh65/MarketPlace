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

// 1. Get All Products (Filter Query params supported: /api/products?category=fashion&subCategory=Men's Wear)
router.get('/', getProducts);

// 2. Fetch Products by Category directly
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { subCategory } = req.query;

    const query = { category: categoryName.toLowerCase() };
    if (subCategory) {
      query.subCategory = subCategory;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Get Single Product
router.get('/:id', getProductById);

// 4. Add Product with Multer Image Upload
router.post('/', upload.single('image'), addProduct);

// 5. Delete Product
router.delete('/:id', deleteProduct);

// 6. Add Review to Product
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