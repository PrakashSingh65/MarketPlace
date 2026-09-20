import fs from 'fs';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';
import { invalidateProductCache } from '../middleware/cacheMiddleware.js';

const escapeRegex = (str = '') => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

export const getProducts = async (req, res) => {
  try {
    const { category, subCategory, keyword } = req.query;
    let query = {};

    if (category && category.trim()) {
      query.category = category.trim().toLowerCase();
    }
    if (subCategory && subCategory.trim()) {
      query.subCategory = { $regex: new RegExp(`^${escapeRegex(subCategory.trim())}$`, 'i') };
    }
    if (keyword && keyword.trim()) {
      const safeKeyword = escapeRegex(keyword.trim());
      query.$or = [
        { title: { $regex: safeKeyword, $options: 'i' } },
        { description: { $regex: safeKeyword, $options: 'i' } },
        { category: { $regex: safeKeyword, $options: 'i' } },
        { composition: { $regex: safeKeyword, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { subCategory } = req.query;

    const query = { 
      category: { $regex: new RegExp(`^${escapeRegex(categoryName || '')}$`, 'i') } 
    };

    if (subCategory && subCategory.trim()) {
      query.subCategory = { $regex: new RegExp(`^${escapeRegex(subCategory.trim())}$`, 'i') };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({ message: 'Server error fetching category products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product by id:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Please log in to add products' });
    }

    const {
      title,
      name,
      description,
      category,
      subCategory,
      fabricType,
      price,
      pricePerMeter,
      moq,
      stock,
      stockMeters,
      gsm,
      composition,
      colors,
      image,
      imageUrl: inputImageUrl,
    } = req.body;

    let imageUrl = inputImageUrl || image || '';

    // Handle file upload safely from memory buffer or disk
    if (req.file) {
      try {
        const fileInput = req.file.buffer || req.file.path;
        const cloudResponse = await uploadOnCloudinary(fileInput, 'products');
        if (cloudResponse?.url) {
          imageUrl = cloudResponse.url;
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload fallback to inline data URI:', cloudErr.message);
        // If Cloudinary is offline or fails, create an inline base64 Data URI so the image is preserved without error
        if (req.file.buffer) {
          const mime = req.file.mimetype || 'image/jpeg';
          imageUrl = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
        } else if (req.file.filename) {
          imageUrl = `/uploads/${req.file.filename}`;
        }
      }

      // Clean up temp disk file if diskStorage was somehow used
      if (req.file.path && fs.existsSync(req.file.path) && imageUrl.startsWith('http')) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.warn('Temp file unlink error:', unlinkErr.message);
        }
      }
    }

    // Default curated fallback image if none provided
    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800';
    }

    // Parse colors array safely
    let parsedColors = [];
    if (Array.isArray(colors)) {
      parsedColors = colors.map((c) => String(c).trim()).filter(Boolean);
    } else if (typeof colors === 'string' && colors.trim()) {
      parsedColors = colors.split(',').map((c) => c.trim()).filter(Boolean);
    }

    // Sanitize numeric fields to prevent NaN validation crashes
    const parsedPrice = Number(price || pricePerMeter || 0);
    const validPrice = !isNaN(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 100;

    const parsedStock = Number(stock || stockMeters || 0);
    const validStock = !isNaN(parsedStock) && parsedStock >= 0 ? parsedStock : 50;

    const parsedMoq = Number(moq || 0);
    const validMoq = !isNaN(parsedMoq) && parsedMoq >= 1 ? parsedMoq : 10;

    const parsedGsm = gsm ? Number(gsm) : undefined;
    const validGsm = parsedGsm && !isNaN(parsedGsm) && parsedGsm > 0 ? parsedGsm : undefined;

    const newProduct = new Product({
      title: (title || name || 'Premium Fabric').trim(),
      description: (description || '').trim(),
      category: category && category.trim() ? category.trim().toLowerCase() : 'cotton',
      subCategory: subCategory ? subCategory.trim() : '',
      price: validPrice,
      pricePerMeter: validPrice,
      moq: validMoq,
      stock: validStock,
      stockMeters: validStock,
      gsm: validGsm,
      composition: (composition || fabricType || '').trim(),
      colors: parsedColors,
      image: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      supplier: req.user._id,
      rating: 0,
      numReviews: 0,
    });

    const savedProduct = await newProduct.save();
    await invalidateProductCache(savedProduct._id);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error adding product',
      error: error.message 
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const isOwner =
      (product.supplier && product.supplier.toString() === req.user._id.toString()) ||
      (product.user && product.user.toString() === req.user._id.toString());

    const isAdmin = req.user.role === 'ADMIN';
    const isSupplier = (req.user.role || '').toUpperCase() === 'SUPPLIER';

    // Check if the original supplier is missing or deleted from database
    let isOrphaned = !product.supplier && !product.user;
    if (!isOwner && !isAdmin && product.supplier) {
      const supplierExists = await User.exists({ _id: product.supplier });
      if (!supplierExists) {
        isOrphaned = true;
      }
    }

    // Allow deletion if: owner, admin, product is orphaned (supplier deleted), or user is an authenticated supplier
    if (!isOwner && !isAdmin && !isOrphaned && !isSupplier) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    await invalidateProductCache(product._id);
    return res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

export const addProductReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    const review = {
      user: req.user._id,
      name: req.user.name || 'Verified Buyer',
      rating: Number(rating),
      comment: comment || '',
      createdAt: new Date(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();
    await invalidateProductCache(product._id);

    res.status(201).json({ message: 'Review Added Successfully', product });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error submitting review', error: error.message });
  }
};