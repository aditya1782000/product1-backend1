import express from 'express';
import registration from './registration/registration.routes';
import auth from './auth/auth.routes';
import dashboard from './dashboard/dashboard.routes';
import users from './users/users.routes';
import products from './products/products.routes';
import orders from './orders/orders.routes';
import invoices from './invocies/invoices.routes';

const router = express.Router();

router.use('/', [
    registration,
    auth,
    dashboard,
    users,
    products,
    orders,
    invoices,
]);

export default router;
