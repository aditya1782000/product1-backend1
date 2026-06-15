import express from 'express';
import uploader from '../../utils/uploader';
import { isAdmin } from '../../middleware/isAdmin';
import {
    addStatementsControllers,
    listCustomerStatementsControllers,
    listStatementsControllers,
    listStatementsOrgnizationNameControllers,
} from './statement.controllers';
import {
    listCustomerStatementsValidators,
    listStatementsValidators,
} from './statement.validators';
import { isCustomer } from '../../middleware/isCustomer';
const router = express.Router();

router.post(
    '/admin/statements/add',
    uploader.uploadFile('csv'),
    isAdmin('Statements', 'A'),
    addStatementsControllers,
);

router.post(
    '/admin/statements/list',
    listStatementsValidators,
    isAdmin('Statements', 'V'),
    listStatementsControllers,
);

router.post(
    '/admin/statements/organization/name/list',
    isAdmin('Statements', 'V'),
    listStatementsOrgnizationNameControllers,
);

// Cusotomer Apis
router.post(
    '/customer/statements/list',
    listCustomerStatementsValidators,
    isCustomer(),
    listCustomerStatementsControllers,
);

export default router;
