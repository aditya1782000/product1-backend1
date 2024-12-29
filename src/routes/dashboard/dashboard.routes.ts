import express from 'express';
import { isAdmin } from '../../middleware/isAdmin';
import {
    getCountDataControllers,
    getRecentOrdersControllers,
} from './dashboard.controllers';
import { recentOrdersValidators } from './dashboard.validators';

const router = express.Router();

router.get('/admin/dashboard/count/data', isAdmin(), getCountDataControllers);

router.post(
    '/admin/dashboard/orders/recent',
    recentOrdersValidators,
    isAdmin(),
    getRecentOrdersControllers,
);

export default router;
