import express from 'express';
import registration from './registration/registration.routes';
import auth from './auth/auth.routes';
import dashboard from './dashboard/dashboard.routes';
import users from './users/users.routes';
import products from './products/products.routes';
import orders from './orders/orders.routes';
import invoices from './invocies/invoices.routes';
import contactus from './contactus/contactus.routes';
import notifications from './notifications/notifications.routes';
import search from './search/search.routes';
import challan from './challan/challan.routes';
import attendance from './attendance/attendance.routes';

const router = express.Router();

router.use('/', [
    registration,
    auth,
    dashboard,
    users,
    products,
    orders,
    invoices,
    contactus,
    notifications,
    search,
    challan,
    attendance,
]);

export default router;
