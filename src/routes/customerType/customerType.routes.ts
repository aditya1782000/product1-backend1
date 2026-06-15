import express from 'express';
import { isAdmin } from '../../middleware/isAdmin';
import {
    createCustomerTypeValidators,
    deleteCustomerTypeValidators,
} from './customerType.validators';
import {
    createCustomerTypeControllers,
    deleteCustomerTypeControllers,
    listCustomerTypesControllers,
} from './customerType.controllers';

const router = express.Router();

router.post(
    '/admin/create/customer/type',
    createCustomerTypeValidators,
    isAdmin('', 'A'),
    createCustomerTypeControllers,
);

router.get(
    '/admin/customer/type/list',
    isAdmin('', 'A'),
    listCustomerTypesControllers,
);

router.delete(
    '/admin/customer/type/:id/delete',
    deleteCustomerTypeValidators,
    isAdmin('', 'A'),
    deleteCustomerTypeControllers,
);

export default router;
