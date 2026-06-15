import express from 'express';
import {
    createTypeofPackingValidators,
    deleteTypeOfPackingValidators,
} from './typeOfPacking.validators';
import { isAdmin } from '../../middleware/isAdmin';
import {
    createTypeOfPackingControllers,
    deleteTypeOfPackingControllers,
    listTypeOfPackingControllers,
} from './typeOfPacking.controllers';

const router = express.Router();

router.post(
    '/admin/create/type/of/packing',
    createTypeofPackingValidators,
    isAdmin('Challan', 'A'),
    createTypeOfPackingControllers,
);

router.get(
    '/admin/list/type/of/packing',
    isAdmin('Challan', 'A'),
    listTypeOfPackingControllers,
);

router.delete(
    '/admin/delete/:id/type/of/packing',
    deleteTypeOfPackingValidators,
    isAdmin('Challan', 'A'),
    deleteTypeOfPackingControllers,
);

export default router;
