import express from 'express';
import { UserRoutes } from '../modules/Peoples/people.router.js';
import { ProductRoutes } from '../modules/Product/product.route.js';


const router = express.Router();

const modularRoutes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/products",
    route: ProductRoutes
  }
];


modularRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
