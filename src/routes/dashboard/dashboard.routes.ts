import express from 'express';
import { isAdmin } from '../../middleware/isAdmin';
import {
    getCountDataControllers,
    getRecentOrdersControllers,
    orderCountsMonthYearControllers,
    orderStatusCountControllers,
} from './dashboard.controllers';
import {
    orderCountsMonthYearValidators,
    recentOrdersValidators,
} from './dashboard.validators';

const router = express.Router();

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

router.get(
    '/admin/dashboard/orders/status/count',
    isAdmin(),
    orderStatusCountControllers,
);

export default router;
