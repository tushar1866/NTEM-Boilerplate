import express, { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
// import docsRoute from './docs.route';
// import config from '../../config/config';

const router: Router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
];

// const devRoutes = [
//   {
//     path: '/docs',
//     route: docsRoute,
//   },
// ];

// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
