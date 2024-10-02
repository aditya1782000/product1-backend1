import express from 'express';
import uploader from '../../utils/uploader';
import { isAdmin } from '../../middleware/isAdmin';
import {
    addProductsController,
    editProductController,
    listProdutsController,
    toggleProductStatus,
    viewProductsController,
} from './products.controller';
import {
    addProductValidators,
    editProductValidators,
    listProductsValidators,
    toggleProductStatusValidators,
    viewProductValidators,
} from './products.validators';
const router = express.Router();

//Admin panel Apis
router.post(
    '/admin/products/add',
    uploader.uploadFile('image'),
    addProductValidators,
    isAdmin('products', 'A'),
    addProductsController,
);

router.get(
    '/admin/products/list',
    listProductsValidators,
    isAdmin('products', 'V'),
    listProdutsController,
);

router.get(
    '/admin/product/:id/view',
    viewProductValidators,
    isAdmin('products', 'V'),
    viewProductsController,
);

router.patch(
    '/admin/product/:id/toggle',
    toggleProductStatusValidators,
    isAdmin('products', 'AD'),
    toggleProductStatus,
);

router.patch(
    '/admin/product/:id/edit',
    uploader.uploadFile('image'),
    editProductValidators,
    isAdmin('products', 'E'),
    editProductController,
);

export default router;
