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
import unitType from './unitType/unitType.routes';
import customerType from './customerType/customerType.routes';
import statement from './statement/statement.routes';
import deilveryAddress from './deliveryAddress/deliveryAddress.routes';
import vehicleNo from './vehicleNo/vehicleNo.routes';
import typeOfPacking from './typeOfPacking/typeOfPacking.routes';
import productCategory from './productCategory/productCategory.routes';

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
    unitType,
    customerType,
    statement,
    deilveryAddress,
    vehicleNo,
    typeOfPacking,
    productCategory,
]);

export default router;
