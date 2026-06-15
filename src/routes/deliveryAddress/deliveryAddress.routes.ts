import express from 'express';
import { addDeliveryAddressValidators } from './deliveryAddress.validators';
import { isCustomer } from '../../middleware/isCustomer';
import {
    addAdminDeliveryAddressControllers,
    addDeliveryAddressControllers,
    listAdminDeliveryAddressControllers,
    listDeliveryAddressControllers,
} from './deliveryAddress.controllers';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();

router.post(
    '/admin/delivery/address/:id/add',
    addDeliveryAddressValidators,
    isAdmin('Orders', 'A'),
    addAdminDeliveryAddressControllers,
);

router.get(
    '/admin/delivery/address/:id/list',
    isAdmin('Orders', 'V'),
    listAdminDeliveryAddressControllers,
);

router.post(
    '/custome/delivery/address/add',
    addDeliveryAddressValidators,
    isCustomer(),
    addDeliveryAddressControllers,
);

router.get(
    '/custome/delivery/address/list',
    isCustomer(),
    listDeliveryAddressControllers,
);

export default router;
