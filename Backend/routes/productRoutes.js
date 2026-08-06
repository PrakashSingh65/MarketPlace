import express from "express";
import {
  getProducts,
  addProduct,
  getProductById,
} from "../controllers/productController.js";

import { verifyToken, checkRole } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  upload.single("images"),
  addProduct
);

router.post("/:id/reviews", async (req, res) => {
  try {
    const { rating, comment, name } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    const review = {
      name: name || "Anonymous Buyer",
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review Added Successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;