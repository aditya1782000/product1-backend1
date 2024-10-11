import express from 'express';
import { isCustomer } from '../../middleware/isCustomer';
import {
    createCustomerOrderController,
    receiveCustomerOrdersControllers,
} from './orders.controllers';
import { createCustomerOrderValidators } from './orders.validators';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();

// Admin panel APIs
router.get(
    '/admin/orders/receive',
    isAdmin('orders', 'V'),
    receiveCustomerOrdersControllers,
);

// Customer APIs
router.post(
    '/customer/order/create',
    isCustomer(),
    createCustomerOrderValidators,
    createCustomerOrderController,
);

export default router;
