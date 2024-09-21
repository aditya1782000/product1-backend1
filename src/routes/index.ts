import express from 'express';
import registration from './registration/registration.routes';
import auth from './auth/auth.routes';
import users from './users/users.routes';
import products from './products/products.routes';

const router = express.Router();

router.use('/', [registration, auth, users, products]);

export default router;
