import express from 'express';
import uploader from '../../utils/uploader';
import { isAdmin } from '../../middleware/isAdmin';
import {
    addProductsController,
    listProdutsController,
} from './products.controller';
import {
    addProductValidators,
    listProductsValidators,
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

export default router;
