import Product from '../models/Product.js';


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
    const { title, description, category, pricePerMeter, moq, stockMeters, gsm, composition, colors, images } = req.body;

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
      colors,
      images,
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
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