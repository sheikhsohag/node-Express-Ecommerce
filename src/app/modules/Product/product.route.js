import express from 'express';
import { Products } from './product.controller.js';
import verifyToken from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, Products.createProduct);
router.get('/', Products.getProducts);
router.get('/:id', Products.getProductById);
router.put('/:id', verifyToken, Products.updateProduct);
router.delete('/:id', verifyToken, Products.deleteProduct);

export const ProductRoutes = router;
