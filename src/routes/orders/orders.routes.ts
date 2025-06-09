import express from 'express';
import { isCustomer } from '../../middleware/isCustomer';
import {
    acceptOrderControllers,
    changeOrderStatusControllers,
    createAdminOrdersControllers,
    createCustomerOrderController,
    customerListControllers,
    deleteOrderControllers,
    editOrderControllers,
    getCustomerOrderListControllers,
    listCompletedOrdersControllers,
    listCustomerCompletedOrdersControllers,
    listCustomerPendingOrdersControllers,
    listPendingOrdersControllers,
    productsListControllers,
    receiveCustomerOrdersControllers,
    rejectedOrderControllers,
    updateBillingOptionControllers,
    viewAdminOrderControllers,
    viewCustomerOrderControllers,
} from './orders.controllers';
import {
    acceptOrderValidators,
    changeOrderStatusValidators,
    createAdminOrdersValidators,
    createCustomerOrderValidators,
    cusotmerOrderValidators,
    customerCompletedOrderListValidators,
    customerPendingOrderListValidators,
    deleteOrderValidators,
    editOrderValidators,
    listCompletedOrdersValidators,
    listPendingOrdersValidators,
    rejectOrderValidators,
    updateBillingOptionValidators,
    viewAdminOrderValidators,
} from './orders.validators';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();

// Admin panel APIs
router.get(
    '/admin/orders/receive',
    isAdmin('Orders', 'V'),
    receiveCustomerOrdersControllers,
);

router.post(
    '/admin/orders/pending/list',
    listPendingOrdersValidators,
    isAdmin('Orders', 'V'),
    listPendingOrdersControllers,
);

router.post(
    '/admin/orders/completed/list',
    listCompletedOrdersValidators,
    isAdmin('Orders', 'V'),
    listCompletedOrdersControllers,
);

router.get(
    '/admin/order/:id/view',
    viewAdminOrderValidators,
    isAdmin('Orders', 'V'),
    viewAdminOrderControllers,
);

router.patch(
    '/admin/order/:id/edit',
    editOrderValidators,
    isAdmin('Orders', 'E'),
    editOrderControllers,
);

router.patch(
    '/admin/order/:id/approve',
    acceptOrderValidators,
    isAdmin('Orders', 'E'),
    acceptOrderControllers,
);

router.patch(
    '/admin/order/:id/reject',
    rejectOrderValidators,
    isAdmin('Orders', 'E'),
    rejectedOrderControllers,
);

router.patch(
    '/admin/order/:id/deliever',
    changeOrderStatusValidators,
    isAdmin('Orders', 'E'),
    changeOrderStatusControllers,
);

router.post(
    '/admin/orders/add',
    createAdminOrdersValidators,
    isAdmin('Orders', 'A'),
    createAdminOrdersControllers,
);

router.delete(
    '/admin/order/:id/delete',
    deleteOrderValidators,
    isAdmin('Orders', 'D'),
    deleteOrderControllers,
);

router.post(
    '/admin/order/customers/list',
    isAdmin('Orders', 'V'),
    customerListControllers,
);

router.post(
    '/admin/order/products/list',
    isAdmin('Orders', 'V'),
    productsListControllers,
);

router.post(
    '/admin/orders/:id/customer/list',
    cusotmerOrderValidators,
    isAdmin('', 'V'),
    getCustomerOrderListControllers,
);

router.patch(
    '/admin/order/:id/update/billing/options',
    updateBillingOptionValidators,
    isAdmin('Orders', 'E'),
    updateBillingOptionControllers,
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
    customerPendingOrderListValidators,
    isCustomer(),
    listCustomerPendingOrdersControllers,
);

router.get(
    '/customer/orders/completed/list',
    customerCompletedOrderListValidators,
    isCustomer(),
    listCustomerCompletedOrdersControllers,
);

router.get('/customer/order/view', isCustomer(), viewCustomerOrderControllers);

export default router;
