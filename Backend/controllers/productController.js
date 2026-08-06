export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    let imageUrl = "";
    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newProduct = new Product({
      title: req.body.title,
      category: req.body.category || 'Cotton',
      price: Number(req.body.price),
      description: req.body.description || '',
      images: imageUrl ? [imageUrl] : []
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error); // Terminal me exact crash reason dikhega
    res.status(500).json({ message: error.message });
  }
};