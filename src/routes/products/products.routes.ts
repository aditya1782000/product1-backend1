import express from 'express';
import uploader from '../../utils/uploader';
import { isAdmin } from '../../middleware/isAdmin';
import {
    addProductsController,
    listProdutsController,
    viewProductsController,
} from './products.controller';
import {
    addProductValidators,
    listProductsValidators,
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

export default router;
