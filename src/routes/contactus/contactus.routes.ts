import express from 'express';
import {
    addContactUsValidators,
    deleteContactUsValidators,
    listContactUsValidators,
    resolveContactUsValidators,
} from './contactus.validators';
import { isCustomer } from '../../middleware/isCustomer';
import {
    addContactUsControllers,
    deleteContactUsControllers,
    listContactUsControllers,
    resolveContactUscontrollers,
} from './contactus.controllers';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();

// Customer APIs
router.post(
    '/customer/contactus/add',
    addContactUsValidators,
    isCustomer(),
    addContactUsControllers,
);

// Admin APIs
router.post(
    '/admin/contactus/list',
    listContactUsValidators,
    isAdmin('contact', 'V'),
    listContactUsControllers,
);

router.delete(
    '/admin/contactus/:id/delete',
    deleteContactUsValidators,
    isAdmin('contact', 'V'),
    deleteContactUsControllers,
);

router.patch(
    '/admin/contactus/:id/resolve',
    resolveContactUsValidators,
    isAdmin('contact', 'E'),
    resolveContactUscontrollers,
);

export default router;
