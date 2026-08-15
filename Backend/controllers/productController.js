import Product from '../models/Product.js';

// Get All Products (Filter & Search query options included)
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

// Get Single Product by ID
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

// Add New Product
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

    // Multer / Cloudinary se mili image URL
    const imageUrl = req.file ? req.file.path : '';

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
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error: error.message });
  }
};

// Delete Product
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