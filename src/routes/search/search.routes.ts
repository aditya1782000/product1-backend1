import express from 'express';
import { isCustomer } from '../../middleware/isCustomer';
import { customerProductsSearchControllers } from './search.controllers';
import { searchCusotmerProductList } from './search.validators';
const router = express.Router();

router.get(
    '/customer/product/search',
    searchCusotmerProductList,
    isCustomer(),
    customerProductsSearchControllers,
);

export default router;
