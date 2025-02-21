import express from 'express';
import verifyToken from '../../middlewares/authMiddleware.js';
import upload from '../../middlewares/fileHandler/multer.js';
import { ProductController } from './product.controllar.js';
import checkProductOwnership from '../../middlewares/Authorization/CheckProductOwnerOrAdmin.js';

const router = express.Router();


router.post('/', verifyToken, upload.array('images', 5), ProductController.createProduct);
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.put('/:id', verifyToken, upload.array('images', 5), ProductController.updateProduct);
router.delete('/:id', verifyToken, ProductController.deleteProduct);

export const ProductRoutes = router;
