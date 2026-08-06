import mongoose from 'mongoose';
import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      pricePerMeter,
      moq,
      stockMeters,
      stock,
      gsm,
      composition,
      colors,
      isAvailable,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const productData = {
      title,
      description,
      category,
      price: price ? Number(price) : undefined,
      pricePerMeter: pricePerMeter ? Number(pricePerMeter) : undefined,
      moq: moq ? Number(moq) : 50,
      stockMeters: stockMeters ? Number(stockMeters) : 50,
      stock: stock ? Number(stock) : 50,
      gsm: gsm ? Number(gsm) : undefined,
      composition,
      colors: Array.isArray(colors)
        ? colors
        : colors
            ? colors.split(',').map((item) => item.trim()).filter(Boolean)
            : [],
      isAvailable: isAvailable === 'false' ? false : true,
    };

    if (req.file) {
      productData.images = [
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      ];
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

export default {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
};