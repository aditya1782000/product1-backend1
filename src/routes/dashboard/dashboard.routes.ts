import express from 'express';
import {
    customerOrdercountsControllers,
    customerRecentDeliveredOrdersController,
    getCountDataControllers,
    getRecentOrdersControllers,
    orderCountsMonthYearControllers,
    orderStatusCountControllers,
} from './dashboard.controllers';
import {
    customerOrderCountsValidators,
    orderCountsMonthYearValidators,
    recentOrdersValidators,
} from './dashboard.validators';
import { isCustomer } from '../../middleware/isCustomer';
import { validateOnlyAdmin } from '../../middleware/isOnlyAdmin';

const router = express.Router();

// Admin Panle Apis
router.get(
    '/admin/dashboard/count/data',
    validateOnlyAdmin(),
    getCountDataControllers,
);

router.post(
    '/admin/dashboard/orders/recent',
    recentOrdersValidators,
    validateOnlyAdmin(),
    getRecentOrdersControllers,
);

router.post(
    '/admin/dashboard/orders/count/month',
    orderCountsMonthYearValidators,
    validateOnlyAdmin(),
    orderCountsMonthYearControllers,
);

router.post(
    '/admin/dashboard/orders/status/count',
    validateOnlyAdmin(),
    orderStatusCountControllers,
);

// Customer Home Page Apis
router.post(
    '/customer/home/order/counts',
    customerOrderCountsValidators,
    isCustomer(),
    customerOrdercountsControllers,
);

router.get(
    '/customer/home/recent/delivered/orders',
    isCustomer(),
    customerRecentDeliveredOrdersController,
);

export default router;
