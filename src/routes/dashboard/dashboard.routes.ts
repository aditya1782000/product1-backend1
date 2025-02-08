import express from 'express';
import { isAdmin } from '../../middleware/isAdmin';
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

const router = express.Router();

// Admin Panle Apis
router.get('/admin/dashboard/count/data', isAdmin(), getCountDataControllers);

router.post(
    '/admin/dashboard/orders/recent',
    recentOrdersValidators,
    isAdmin(),
    getRecentOrdersControllers,
);

router.post(
    '/admin/dashboard/orders/count/month',
    orderCountsMonthYearValidators,
    isAdmin(),
    orderCountsMonthYearControllers,
);

router.post(
    '/admin/dashboard/orders/status/count',
    isAdmin(),
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
