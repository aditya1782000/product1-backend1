import { body, param } from 'express-validator';

export const toggleOfferBannerStatus = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Id must be valid mongo id'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .bail()
        .isBoolean()
        .withMessage('Status must be a boolean'),
];

export const deleteOfferBannerValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Id must be valid mongo id'),
];
