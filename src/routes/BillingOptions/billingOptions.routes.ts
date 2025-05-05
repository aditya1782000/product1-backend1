import express from 'express';
import {
    createBillingOptionValidators,
    deleteBillingOptionValidators,
} from './billingOptions.validators';
import { isAdmin } from '../../middleware/isAdmin';
import {
    createBillingOptionControllers,
    deleteBillingOptionControllers,
    listBillingOptionsControllers,
} from './billingOptions.controllers';

const router = express.Router();

router.post(
    '/admin/create/billing/option',
    createBillingOptionValidators,
    isAdmin('', 'A'),
    createBillingOptionControllers,
);

router.get(
    '/admin/billing/options/list',
    isAdmin('', 'A'),
    listBillingOptionsControllers,
);

router.delete(
    '/admin/billin/option/:id/delete',
    deleteBillingOptionValidators,
    isAdmin('', 'A'),
    deleteBillingOptionControllers,
);

export default router;
