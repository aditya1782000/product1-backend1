import express from 'express';
import { isCustomer } from '../../middleware/isCustomer';
import {
    acceptOrderControllers,
    changeOrderStatusControllers,
    createAdminOrdersControllers,
    createCustomerOrderController,
    deleteOrderControllers,
    editOrderControllers,
    listCompletedOrdersControllers,
    listCustomerCompletedOrdersControllers,
    listCustomerPendingOrdersControllers,
    listPendingOrdersControllers,
    receiveCustomerOrdersControllers,
    rejectedOrderControllers,
    viewAdminOrderControllers,
    viewCustomerOrderControllers,
} from './orders.controllers';
import {
    acceptOrderValidators,
    changeOrderStatusValidators,
    createAdminOrdersValidators,
    createCustomerOrderValidators,
    deleteOrderValidators,
    editOrderValidators,
    listCompletedOrdersValidators,
    listPendingOrdersValidators,
    rejectOrderValidators,
    viewAdminOrderValidators,
    viewCustomerOrderValidators,
} from './orders.validators';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();

// Admin panel APIs
router.get(
    '/admin/orders/receive',
    isAdmin('orders', 'V'),
    receiveCustomerOrdersControllers,
);

router.post(
    '/admin/orders/pending/list',
    listPendingOrdersValidators,
    isAdmin('orders', 'V'),
    listPendingOrdersControllers,
);

router.post(
    '/admin/orders/completed/list',
    listCompletedOrdersValidators,
    isAdmin('orders', 'V'),
    listCompletedOrdersControllers,
);

router.get(
    '/admin/order/:id/view',
    viewAdminOrderValidators,
    isAdmin('orders', 'V'),
    viewAdminOrderControllers,
);

router.patch(
    '/admin/order/:id/edit',
    editOrderValidators,
    isAdmin('orders', 'E'),
    editOrderControllers,
);

router.patch(
    '/admin/order/:id/approve',
    acceptOrderValidators,
    isAdmin('orders', 'E'),
    acceptOrderControllers,
);

router.patch(
    '/admin/order/:id/reject',
    rejectOrderValidators,
    isAdmin('orders', 'E'),
    rejectedOrderControllers,
);

router.patch(
    '/admin/order/:id/deliever',
    changeOrderStatusValidators,
    isAdmin('orders', 'E'),
    changeOrderStatusControllers,
);

router.post(
    '/admin/orders/add',
    createAdminOrdersValidators,
    isAdmin('orders', 'A'),
    createAdminOrdersControllers,
);

router.delete(
    '/admin/order/:id/delete',
    deleteOrderValidators,
    isAdmin('orders', 'D'),
    deleteOrderControllers,
);

// Customer APIs
router.post(
    '/customer/order/create',
    createCustomerOrderValidators,
    isCustomer(),
    createCustomerOrderController,
);

router.get(
    '/customer/orders/pending/list',
    isCustomer(),
    listCustomerPendingOrdersControllers,
);

router.get(
    '/customer/orders/completed/list',
    viewCustomerOrderValidators,
    isCustomer(),
    listCustomerCompletedOrdersControllers,
);

router.get('/customer/order/view', isCustomer(), viewCustomerOrderControllers);

export default router;
