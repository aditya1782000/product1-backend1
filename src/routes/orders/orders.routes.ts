import express from 'express';
import { isCustomer } from '../../middleware/isCustomer';
import { createCustomerOrderController } from './orders.controllers';
import { createCustomerOrderValidators } from './orders.validators';

const router = express.Router();

router.post(
    '/customer/order/create',
    isCustomer(),
    createCustomerOrderValidators,
    createCustomerOrderController,
);

export default router;
