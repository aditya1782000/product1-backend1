import express from 'express';
import { gstPercentageValidators } from './gstPercentage.validators';
import {
    createGstPercentageControllers,
    listGstPercentageControllers,
} from './gstPercentage.controllers';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();

router.post(
    '/admin/create/gst/percentage',
    gstPercentageValidators,
    createGstPercentageControllers,
);

router.get(
    '/admin/list/gst/percentage',
    isAdmin('Products', 'A'),
    listGstPercentageControllers,
);

export default router;
