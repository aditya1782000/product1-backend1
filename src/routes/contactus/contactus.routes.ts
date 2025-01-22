import express from 'express';
import { addContactUsValidators } from './contactus.validators';
import { isCustomer } from '../../middleware/isCustomer';
import { addContactUsControllers } from './contactus.controllers';

const router = express.Router();

// Customer APIs
router.post(
    '/customer/contactus/add',
    addContactUsValidators,
    isCustomer(),
    addContactUsControllers,
);

export default router;
