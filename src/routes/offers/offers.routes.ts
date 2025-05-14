import express from 'express';
import { isAdmin } from '../../middleware/isAdmin';
import {
    deleteOfferBannerControllers,
    offerbannersControllers,
    toggleOfferBannerStatusControllers,
} from './offers.controllers';
import { isCustomer } from '../../middleware/isCustomer';
import { toggleProductStatusValidators } from '../products/products.validators';
import { deleteOfferBannerValidators } from './offers.validators';

const router = express.Router();

// Admin APIs
router.get(
    '/admin/offers/banner/list',
    isAdmin('Offers', 'A'),
    offerbannersControllers,
);

router.patch(
    '/admin/toggle/offer/banner/:id/status',
    toggleProductStatusValidators,
    isAdmin('Offers', 'E'),
    toggleOfferBannerStatusControllers,
);

router.delete(
    '/admin/offer/banner/:id/delete',
    deleteOfferBannerValidators,
    isAdmin('Offers', 'D'),
    deleteOfferBannerControllers,
);

// Customer APIs
router.get(
    '/customer/offers/banner/list',
    isCustomer(),
    offerbannersControllers,
);

export default router;
