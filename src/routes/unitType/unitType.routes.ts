import express from 'express';
import {
    createUnitTypeValidators,
    deleteUnitTypeValidators,
} from './unitType.validators';
import {
    createUnitTypControllers,
    deleteUnitTypesControllers,
    listUnitTypesControllers,
} from './unitType.controllers';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();

router.post(
    '/admin/create/unit/type',
    createUnitTypeValidators,
    isAdmin('Products', 'A'),
    createUnitTypControllers,
);

router.get(
    '/admin/unit/type/list',
    isAdmin('Products', 'A'),
    listUnitTypesControllers,
);

router.delete(
    '/admin/unit/type/:id/delete',
    deleteUnitTypeValidators,
    isAdmin('Products', 'A'),
    deleteUnitTypesControllers,
);

export default router;
