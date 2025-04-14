import express from 'express';
import {
    createChallanOrganizationValidators,
    createChallanValidators,
    createCustomChallanOrganizationValidators,
    createCustomChallanValidators,
    deleteChallanOrganizationValidators,
    deleteChallanValidators,
    deleteCustomChallanOrganizationValidators,
    editChallanOrganizationValidators,
    editChallanValidators,
    editCustomChallanOrganizationValidators,
    editCustomChallanValidators,
    listChallansOrganizationValidaors,
    listChallansValidaors,
    listCustomChallanOrgValidators,
    listCustomChallanValidators,
    viewChallanValidators,
    viewCustomChallanValidators,
} from './challan.validators';
import { isAdmin } from '../../middleware/isAdmin';
import {
    createChallanControllers,
    createChallanOrganizationControllers,
    createCustomChallanControllers,
    createCustomChallanOrganizationControllers,
    deleteChallanControllers,
    deleteChallanOrganizationControllers,
    deleteCustomChallanOrganizationControllers,
    deleteCutomChallanControllers,
    editChallanControllers,
    editChallanOrganizationControllers,
    editCustomChallanControllers,
    editCustomChallOrganizationControllers,
    listChallanOrgnaizationControllers,
    listChallansControllers,
    listCustomChallanControllers,
    listCustomChallanOrgControllers,
    viewChallanControllers,
    viewChallanOrganizationControlllers,
    viewCustomChallanControllers,
    viewCustomChallanOrganizationControllers,
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

router.post(
    '/admin/create/custom/challan/organization',
    createCustomChallanOrganizationValidators,
    isAdmin('Challan', 'A'),
    createCustomChallanOrganizationControllers,
);

router.post(
    '/admin/create/custom/challan',
    isAdmin('Challan', 'A'),
    createCustomChallanControllers,
);

router.get(
    '/admin/custom/challan/org/view',
    createCustomChallanValidators,
    isAdmin('Challan', 'V'),
    viewCustomChallanOrganizationControllers,
);

router.patch(
    '/admin/custom/challan/org/:id/edit',
    editCustomChallanOrganizationValidators,
    isAdmin('Challan', 'E'),
    editCustomChallOrganizationControllers,
);

router.delete(
    '/admin/custom/challan/org/:id/delete',
    deleteCustomChallanOrganizationValidators,
    isAdmin('Challan', 'D'),
    deleteCustomChallanOrganizationControllers,
);

router.get(
    '/admin/custom/challan/:id/view',
    viewCustomChallanValidators,
    isAdmin('Challan', 'V'),
    viewCustomChallanControllers,
);

router.patch(
    '/admin/custom/challan/:id/edit',
    editCustomChallanValidators,
    isAdmin('Challan', 'E'),
    editCustomChallanControllers,
);

router.delete(
    '/admin/custom/challan/:id/delete',
    deleteChallanValidators,
    isAdmin('Challan', 'D'),
    deleteCutomChallanControllers,
);

router.post(
    '/admin/custom/challa/org/list',
    listCustomChallanOrgValidators,
    isAdmin('Challan', 'V'),
    listCustomChallanOrgControllers,
);

router.post(
    '/admin/custom/challa/list',
    listCustomChallanValidators,
    isAdmin('Challan', 'V'),
    listCustomChallanControllers,
);

export default router;
