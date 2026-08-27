import Product from '../models/Product.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';

export const getProducts = async (req, res) => {
  try {
    const { category, subCategory, keyword } = req.query;
    let query = {};

    if (category) {
      query.category = category.toLowerCase();
    }
    if (subCategory) {
      query.subCategory = subCategory;
    }
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { subCategory } = req.query;

    const query = { 
      category: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
    };

    if (subCategory) {
      query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching category products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      price,
      pricePerMeter,
      moq,
      stock,
      stockMeters,
      gsm,
      composition,
      colors,
    } = req.body;

    let imageUrl = '';

    if (req.file) {
      const fileInput = req.file.buffer || req.file.path;
      const cloudResponse = await uploadOnCloudinary(fileInput, 'products');
      if (cloudResponse) {
        imageUrl = cloudResponse.url;
      }
    }

    const newProduct = new Product({
      title,
      description,
      category: category ? category.toLowerCase() : 'fashion',
      subCategory,
      price: Number(price || pricePerMeter || 0),
      pricePerMeter: Number(pricePerMeter || price || 0),
      moq: Number(moq || 50),
      stock: Number(stock || stockMeters || 50),
      stockMeters: Number(stockMeters || stock || 50),
      gsm: gsm ? Number(gsm) : undefined,
      composition,
      colors: Array.isArray(colors) ? colors : colors ? colors.split(',').map((c) => c.trim()) : [],
      image: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      user: req.user._id,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.status(200).json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

export const addProductReview = async (req, res) => {
  try {
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
      createdAt: new Date()
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review Added Successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error submitting review', error: error.message });
  }
};