import express from 'express';
import { UserRoutes } from '../modules/Peoples/people.router.js';
import { ProductRoutes } from '../modules/Product/product.route.js';
import { CartRoutes } from '../modules/cart/Cart.Route.js';


const router = express.Router();

const modularRoutes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/products",
    route: ProductRoutes
  },
  {
    path: "/add-to-cart",
    route: CartRoutes
  }
];


modularRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
