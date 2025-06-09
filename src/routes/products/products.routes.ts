import express from 'express';
import uploader from '../../utils/uploader';
import { isAdmin } from '../../middleware/isAdmin';
import {
    addProductsController,
    customerProductListController,
    customerProductViewController,
    deleteProductController,
    editProductController,
    listProdutsController,
    toggleProductStatus,
    viewProductsController,
} from './products.controllers';
import {
    addProductValidators,
    customerProductsListValidators,
    customerProductViewValidators,
    deleteProductValidators,
    editProductValidators,
    listProductsValidators,
    toggleProductStatusValidators,
    viewProductValidators,
} from './products.validators';
import { isCustomer } from '../../middleware/isCustomer';
const router = express.Router();

//Admin panel Apis
router.post(
    '/admin/products/add',
    uploader.uploadFile('image'),
    addProductValidators,
    isAdmin('products', 'A'),
    addProductsController,
);

router.post(
    '/admin/products/list',
    listProductsValidators,
    isAdmin('Products', 'V'),
    listProdutsController,
);

router.get(
    '/admin/product/:id/view',
    viewProductValidators,
    isAdmin('Products', 'V'),
    viewProductsController,
);

router.patch(
    '/admin/product/:id/toggle',
    toggleProductStatusValidators,
    isAdmin('Products', 'AD'),
    toggleProductStatus,
);

router.patch(
    '/admin/product/:id/edit',
    uploader.uploadFile('image'),
    editProductValidators,
    isAdmin('Products', 'E'),
    editProductController,
);

router.delete(
    '/admin/product/:id/delete',
    deleteProductValidators,
    isAdmin('Products', 'D'),
    deleteProductController,
);

// Customer APIs
router.get(
    '/customer/products/list',
    customerProductsListValidators,
    isCustomer(),
    customerProductListController,
);

router.get(
    '/customer/product/:id/view',
    customerProductViewValidators,
    isCustomer(),
    customerProductViewController,
);
export default router;
