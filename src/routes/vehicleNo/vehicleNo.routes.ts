import express from 'express';
import { isAdmin } from '../../middleware/isAdmin';
import {
    createVehicleNoControllers,
    deleteVehicleNoControllers,
    listVehicleNosControllers,
} from './vehicleNo.controllers';
import {
    deleteVehicleNoValidators,
    vehicleNoValidators,
} from './vehicleNo.validators';

const router = express.Router();

router.post(
    '/admin/create/vehicle/no',
    vehicleNoValidators,
    isAdmin('Challan', 'A'),
    createVehicleNoControllers,
);

router.get(
    '/admin/vehicle/no/list',
    isAdmin('Products', 'A'),
    listVehicleNosControllers,
);

router.delete(
    '/admin/vehicle/no/:id/delete',
    deleteVehicleNoValidators,
    isAdmin('Challan', 'A'),
    deleteVehicleNoControllers,
);

export default router;
