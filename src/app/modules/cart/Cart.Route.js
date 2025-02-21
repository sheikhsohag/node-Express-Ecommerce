
import verifyToken from "../../middlewares/authMiddleware.js";
import { CartController } from "./Cart.Controllar.js";
import express from 'express';
const router = express.Router();


router.post('/', verifyToken, CartController.addToCart);
router.get('/', CartController.getAllCarts);
router.get('/user',verifyToken, CartController.getUserCart);
router.put('/:cartItemId', verifyToken, CartController.updateCartItem);
router.delete('/:id', verifyToken, CartController.removeCartItem);

export const CartRoutes = router;
