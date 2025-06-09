import express from 'express';
import {
    createBillingOptionValidators,
    deleteBillingOptionValidators,
} from './billingOptions.validators';
import { isAdmin } from '../../middleware/isAdmin';
import {
    adminOrderCustomerBillingOptionControllers,
    createBillingOptionControllers,
    deleteBillingOptionControllers,
    listBillingOptionsControllers,
} from './billingOptions.controllers';
import { isCustomer } from '../../middleware/isCustomer';

const router = express.Router();

router.post(
    '/admin/create/billing/option',
    createBillingOptionValidators,
    isAdmin('Orders', 'A'),
    createBillingOptionControllers,
);

router.get(
    '/admin/billing/options/list',
    isAdmin('Orders', 'A'),
    listBillingOptionsControllers,
);

router.delete(
    '/admin/billin/option/:id/delete',
    deleteBillingOptionValidators,
    isAdmin('Orders', 'A'),
    deleteBillingOptionControllers,
);

router.get(
    '/customer/billing/option/list',
    isCustomer(),
    adminOrderCustomerBillingOptionControllers,
);

export default router;
