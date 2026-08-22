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

// 1. Get All Products (Query params support: /api/products?category=textile)
router.get('/', getProducts);

// 2. Fetch Products by Category (Case-insensitive query matching)
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { subCategory } = req.query;

    // Case-insensitive regex match taaki DB filtering crash na ho
    const query = { 
      category: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
    };

    if (subCategory) {
      query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in GET /api/products/category:", error.message);
    res.status(500).json({ message: "Server error fetching category products", error: error.message });
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

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }

    // Safety check if reviews array doesn't exist on older documents
    if (!product.reviews) {
      product.reviews = [];
    }

    const review = {
      name: name || 'Anonymous Buyer',
      rating: Number(rating),
      comment: comment || '',
      createdAt: new Date()
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    // Average rating calculation
    const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review Added Successfully', product });
  } catch (error) {
    console.error("Error in POST /api/products/:id/reviews:", error.message);
    res.status(500).json({ message: "Server error submitting review", error: error.message });
  }
});

export default router;