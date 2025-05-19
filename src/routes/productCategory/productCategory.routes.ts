import express from 'express';
import { createProductCategoryValidators } from './productCategory.validators';
import { isAdmin } from '../../middleware/isAdmin';
import {
    createProductCategoryControllers,
    deleteProductCategoryContorllers,
    listProductCategoryControllers,
} from './productCategory.controllers';
import { isCustomer } from '../../middleware/isCustomer';

const router = express.Router();

router.post(
    '/admin/create/product/category',
    createProductCategoryValidators,
    isAdmin('Products', 'A'),
    createProductCategoryControllers,
);

router.get(
    '/admin/list/product/category',
    isAdmin('Products', 'A'),
    listProductCategoryControllers,
);

router.delete(
    '/admin/delete/:id/product/category',
    isAdmin('Products', 'A'),
    deleteProductCategoryContorllers,
);

router.get(
    '/customer/products/category/list',
    isCustomer(),
    listProductCategoryControllers,
);

export default router;
