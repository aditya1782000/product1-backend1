import express from 'express';
import {
    createChallanOrganizationValidators,
    createChallanValidators,
    deleteChallanOrganizationValidators,
    deleteChallanValidators,
    editChallanOrganizationValidators,
    editChallanValidators,
    listChallansOrganizationValidaors,
    listChallansValidaors,
    viewChallanValidators,
} from './challan.validators';
import { isAdmin } from '../../middleware/isAdmin';
import {
    createChallanControllers,
    createChallanOrganizationControllers,
    deleteChallanControllers,
    deleteChallanOrganizationControllers,
    editChallanControllers,
    editChallanOrganizationControllers,
    listChallanOrgnaizationControllers,
    listChallansControllers,
    viewChallanControllers,
    viewChallanOrganizationControlllers,
} from './challan.controllers';
import uploader from '../../utils/uploader';

const router = express.Router();

router.post(
    '/admin/create/challan/organization',
    uploader.uploadFile('image'),
    createChallanOrganizationValidators,
    isAdmin('Challan', 'A'),
    createChallanOrganizationControllers,
);

router.post(
    '/admin/create/challan',
    createChallanValidators,
    isAdmin('Challan', 'A'),
    createChallanControllers,
);

router.get(
    '/admin/view/challan/organization',
    isAdmin('Challan', 'V'),
    viewChallanOrganizationControlllers,
);

router.patch(
    '/admin/edit/challan/:id/organization',
    uploader.uploadFile('image'),
    editChallanOrganizationValidators,
    isAdmin('Challan', 'E'),
    editChallanOrganizationControllers,
);

router.delete(
    '/admin/delete/challan/:id/organization',
    deleteChallanOrganizationValidators,
    isAdmin('Challan', 'D'),
    deleteChallanOrganizationControllers,
);

router.get(
    '/admin/view/:id/challan',
    viewChallanValidators,
    isAdmin('Challan', 'V'),
    viewChallanControllers,
);

router.patch(
    '/admin/edit/:id/challan',
    editChallanValidators,
    isAdmin('Challan', 'E'),
    editChallanControllers,
);

router.delete(
    '/admin/delete/:id/challan',
    deleteChallanValidators,
    isAdmin('Challan', 'D'),
    deleteChallanControllers,
);

router.post(
    '/admin/list/challans',
    listChallansValidaors,
    isAdmin('Challan', 'V'),
    listChallansControllers,
);

router.post(
    '/admin/list/challans/organization',
    listChallansOrganizationValidaors,
    isAdmin('Challan', 'V'),
    listChallanOrgnaizationControllers,
);

export default router;
