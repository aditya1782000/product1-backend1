import express from 'express';
import uploader from '../../utils/uploader';
import {
    addInvoiceValidator,
    listDeliveredOrdersValidators,
} from './invoices.validators';
import { isAdmin } from '../../middleware/isAdmin';
import {
    addInvoiceControllers,
    listDeliveredOrdersControllers,
} from './invoices.controllers';

const router = express.Router();

router.post(
    '/admin/invoices/delivered/orders/list',
    listDeliveredOrdersValidators,
    isAdmin('Invoices', 'V'),
    listDeliveredOrdersControllers,
);

router.patch(
    '/admin/invoice/:id/add',
    uploader.uploadFile('pdf'),
    addInvoiceValidator,
    isAdmin('Invoices', 'A'),
    addInvoiceControllers,
);

export default router;
