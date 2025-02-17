import express from 'express';
import { UserRoutes } from '../modules/Peoples/people.router.js';


const router = express.Router();

const modularRoutes = [
  {
    path: "/user",
    route: UserRoutes
  }
];


modularRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
