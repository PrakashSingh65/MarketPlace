import express from 'express';
import { getProducts, addProduct, getProductById } from '../controllers/productController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();


router.get('/', getProducts);
router.get('/:id', getProductById);


router.post('/', verifyToken, checkRole(['SUPPLIER']), addProduct);

export default router;