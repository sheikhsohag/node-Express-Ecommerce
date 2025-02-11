const express = require('express');
const { userRouter } = require('../modules/Peoples/people.router');


const router = express.Router();

const modularRoutes = [
  {
    path: "/users",
    route: userRouter
  }
];

// Apply routes dynamically
modularRoutes.forEach(route => {
  router.use(route.path, route.route);
});

module.exports = router;
