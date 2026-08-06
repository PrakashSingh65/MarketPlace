import Product from '../models/Product.js';
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};


export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.pricePerMeter = {};
      if (minPrice) query.pricePerMeter.$gte = Number(minPrice);
      if (maxPrice) query.pricePerMeter.$lte = Number(maxPrice);
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).populate('supplierId', 'name profileDetails.businessName');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};


export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      pricePerMeter,
      moq,
      stockMeters,
      gsm,
      composition,
      colors,
    } = req.body;

    let images = [];
    let imagePublicId = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadImage(file.buffer);

        images.push(uploaded.secure_url);
        imagePublicId.push(uploaded.public_id);
      }
    }

    const product = new Product({
      supplierId: req.user.userId,
      title,
      description,
      category,
      pricePerMeter,
      moq,
      stockMeters,
      gsm,
      composition,
      colors: colors ? JSON.parse(colors) : [],
      images,
      imagePublicId,
    });

    await product.save();

    res.status(201).json({
      message: "Product Added Successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplierId', 'name profileDetails');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};